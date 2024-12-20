import React, { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import PassCard from "../components/passes/PassCard";
import UserPasses from "../components/passes/UserPasses";
import ZoneSelectionModal from "../components/modals/ZoneSelectionModal";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

interface Pass {
  id: number;
  pass_type: string;
  price: string;
  duration: string;
  features: { text: string; included: boolean }[];
  user_id: string | null; // Tracks the user who owns the pass
}

const PassesPage: React.FC = () => {
  const { user } = useClerk();
  const [passes, setPasses] = useState<Pass[]>([]);
  const [userPasses, setUserPasses] = useState<Pass[]>([]);
  const [availablePasses, setAvailablePasses] = useState<Pass[]>([]);
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all passes and split into user-owned and available
  useEffect(() => {
    const fetchPasses = async () => {
      const { data, error } = await supabase.from("passes").select("*");

      if (error) {
        console.error("Error fetching passes:", error);
      } else {
        const userOwned = data.filter((pass: Pass) => pass.user_id === user?.id);
        const available = data.filter((pass: Pass) => !pass.user_id);

        setUserPasses(userOwned);
        setAvailablePasses(available);
      }
      setLoading(false);
    };

    fetchPasses();
  }, [user]);

  const handlePassSelect = (pass: Pass) => {
    setSelectedPass(pass);
    setShowZoneModal(true);
  };

  const handleNewPassPurchase = async (homeZone: string, destinationZone: string) => {
    if (!selectedPass || !user) return;

    // Add pass to the user in the database
    const { error } = await supabase
      .from("passes")
      .update({ user_id: user.id, home_zone: homeZone, destination_zone: destinationZone })
      .eq("id", selectedPass.id);

    if (error) {
      console.error("Error updating pass:", error);
    } else {
      setUserPasses((prev) => [...prev, { ...selectedPass, user_id: user.id }]);
      setAvailablePasses((prev) => prev.filter((pass) => pass.id !== selectedPass.id));
      setShowZoneModal(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
            Please log in to view and buy passes
          </h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
          {userPasses.length > 0 ? "Your Passes" : "Choose Your Pass"}
        </h2>

        {/* Show user's purchased passes */}
        {userPasses.length > 0 && (
          <>
            <UserPasses passes={userPasses} />
            <button
              onClick={() => setShowZoneModal(true)}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
            >
              Buy Another Pass
            </button>
          </>
        )}

        {/* Show available passes if no user passes */}
        {userPasses.length === 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {availablePasses.map((pass) => (
              <PassCard
                key={pass.id}
                title={pass.pass_type}
                price={pass.price}
                duration={pass.duration}
                features={pass.features}
                onSelect={() => handlePassSelect(pass)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Zone Selection Modal */}
      {showZoneModal && selectedPass && (
        <ZoneSelectionModal
          isOpen={showZoneModal}
          onClose={() => setShowZoneModal(false)}
          passDetails={selectedPass}
          onPaymentSuccess={(homeZone, destinationZone) =>
            handleNewPassPurchase(homeZone, destinationZone)
          }
        />
      )}
    </div>
  );
};

export default PassesPage;