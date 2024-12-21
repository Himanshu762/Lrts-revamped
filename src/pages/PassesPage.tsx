import React, { useState, useEffect } from "react";
import UserPasses from "../components/passes/UserPasses";
import PassCard from "../components/passes/PassCard";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const PassesPage: React.FC = () => {
  const [availablePasses, setAvailablePasses] = useState<any[]>([]); // Available passes for purchase
  const [hasUserPasses, setHasUserPasses] = useState<boolean | null>(null); // Tracks if the user has passes

  // Fetch available passes for purchase
  useEffect(() => {
    const fetchAvailablePasses = async () => {
      try {
        const { data, error } = await supabase.from("passes").select("*");

        if (error) {
          console.error("Error fetching available passes:", error);
          setAvailablePasses([]);
          return;
        }

        // Ensure features are always an array
        const passesWithFeatures = (data || []).map((pass) => ({
          ...pass,
          features: Array.isArray(pass.features) ? pass.features : [],
        }));

        setAvailablePasses(passesWithFeatures);
      } catch (err) {
        console.error("Unexpected error fetching available passes:", err);
        setAvailablePasses([]);
      }
    };

    fetchAvailablePasses();
  }, []);

  // Callback from UserPasses to determine if user has passes
  const handleUserPassCheck = (hasPasses: boolean) => {
    setHasUserPasses(hasPasses);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {hasUserPasses ? (
          <>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
              Your Passes
            </h2>
            <UserPasses onPassCheck={handleUserPassCheck} />
          </>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
              Choose Your Pass
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {availablePasses.length > 0 ? (
                availablePasses.map((pass) => (
                  <PassCard
                    key={pass.id}
                    title={pass.pass_type}
                    price={pass.price}
                    duration={pass.duration}
                    features={pass.features || []}
                  />
                ))
              ) : (
                <p className="text-gray-500">No passes available at the moment.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PassesPage;