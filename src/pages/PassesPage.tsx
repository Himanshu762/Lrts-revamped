import React, { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import PassCard from "../components/passes/PassCard";
import UserPasses from "../components/passes/UserPasses";
import ZoneSelectionModal from "../components/modals/ZoneSelectionModal";

// Initialize Supabase
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
          .from("passes") // Assuming all passes are in this table
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
    setShowZoneModal(true);
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

        {userPasses.length > 0 ? (
          <UserPasses />
        ) : (
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
        />
      )}
    </div>
  );
};

export default PassesPage;