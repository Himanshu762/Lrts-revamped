import React, { useState, useEffect } from "react";
import UserPasses from "../components/passes/UserPasses";
import PassCard from "../components/passes/PassCard";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const PassesPage: React.FC = () => {
  const [availablePasses, setAvailablePasses] = useState<any[]>([]); // Ensure it's an array
  const [hasUserPasses, setHasUserPasses] = useState<boolean | null>(null);

  // Fetch available passes on mount
  useEffect(() => {
    const fetchAvailablePasses = async () => {
      try {
        const { data, error } = await supabase.from("passes").select("*");

        if (error) {
          console.error("Error fetching available passes:", error);
          setAvailablePasses([]); // Clear the passes if error occurs
          return;
        }

        // Handle case where no data is returned
        if (!data || data.length === 0) {
          console.warn("No passes found.");
          setAvailablePasses([]); // Set to empty array if no data
          return;
        }

        setAvailablePasses(data);
      } catch (err) {
        console.error("Unexpected error:", err);
        setAvailablePasses([]); // Clear passes on error
      }
    };

    fetchAvailablePasses();
  }, []);

  // Callback to determine if the user has passes
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
                    features={Array.isArray(pass.features) ? pass.features : []} // Ensure features is an array
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
