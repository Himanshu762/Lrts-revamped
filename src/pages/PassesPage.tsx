import React, { useState } from "react";
import UserPasses from "../components/passes/UserPasses";
import PassCard from "../components/passes/PassCard";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const PassesPage: React.FC = () => {
  const [availablePasses, setAvailablePasses] = useState([]);
  const [hasUserPasses, setHasUserPasses] = useState<boolean | null>(null);

  // Fetch available passes on mount
  React.useEffect(() => {
    const fetchAvailablePasses = async () => {
      try {
        const { data, error } = await supabase.from("passes").select("*");
        if (error) {
          console.error("Error fetching available passes:", error);
          return;
        }
        setAvailablePasses(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
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
        {hasUserPasses === null && (
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
            Loading...
          </h2>
        )}

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
              {availablePasses.map((pass) => (
                <PassCard
                  key={pass.id}
                  title={pass.pass_type}
                  price={pass.price}
                  duration={pass.duration}
                  features={pass.features}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PassesPage;
