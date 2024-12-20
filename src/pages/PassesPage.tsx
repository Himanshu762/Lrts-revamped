import React, { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import PassCard from "../components/passes/PassCard";
import UserPasses from "../components/passes/UserPasses";
import ZoneSelectionModal from "../components/modals/ZoneSelectionModal";
import BuyAnotherPassModal from "../components/modals/BuyAnotherPassModal";

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
}

const PassesPage: React.FC = () => {
  const { user } = useClerk();
  const [passes, setPasses] = useState<Pass[]>([]);
  const [userPasses, setUserPasses] = useState<any[]>([]);
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showBuyAnotherModal, setShowBuyAnotherModal] = useState(false);

  // Fetch all available passes
  useEffect(() => {
    const fetchPasses = async () => {
      const { data, error } = await supabase.from("passes").select("*");

      if (error) console.error("Error fetching passes:", error);
      else setPasses(data || []);
    };

    fetchPasses();
  }, []);

  // Fetch user's purchased passes
  useEffect(() => {
    if (user) {
      const fetchUserPasses = async () => {
        const { data, error } = await supabase
          .from("user_passes")
          .select("*")
          .eq("user_id", user.id);

        if (error) console.error("Error fetching user passes:", error);
        else setUserPasses(data || []);
      };

      fetchUserPasses();
    }
  }, [user]);

  const handlePassSelect = (pass: Pass) => {
    setSelectedPass(pass);
    setShowZoneModal(true); // Open ZoneSelectionModal
  };

  const handleNewPassPurchase = async (newPassDetails: any) => {
    const newPass = {
      user_id: user?.id,
      pass_type: newPassDetails.pass_type,
      price: newPassDetails.price,
      home_zone: newPassDetails.homeZone,
      destination_zone: newPassDetails.destinationZone,
    };

    const { error } = await supabase.from("user_passes").insert(newPass);
    if (error) {
      console.error("Error saving pass to database:", error);
    } else {
      setUserPasses((prev) => [...prev, newPass]); // Add the new pass to userPasses
      setShowZoneModal(false);
      setShowBuyAnotherModal(false);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
          {userPasses.length > 0 ? "Your Passes" : "Choose Your Pass"}
        </h2>

        {userPasses.length > 0 && (
          <>
            {/* Display user's purchased passes */}
            <UserPasses passes={userPasses} />
            <button
              onClick={() => setShowBuyAnotherModal(true)}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
            >
              Buy Another Pass
            </button>
          </>
        )}

        {/* Show available passes if no user passes */}
        {userPasses.length === 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {passes.map((pass) => (
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
          onPaymentSuccess={(newPass) => handleNewPassPurchase(newPass)}
        />
      )}

      {/* Buy Another Pass Modal */}
      {showBuyAnotherModal && (
        <BuyAnotherPassModal
          isOpen={showBuyAnotherModal}
          onClose={() => setShowBuyAnotherModal(false)}
          availablePasses={passes}
          onPassSelect={(pass) => handlePassSelect(pass)}
        />
      )}
    </div>
  );
};

export default PassesPage;