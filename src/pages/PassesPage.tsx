import React, { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import PassCard from "../components/passes/PassCard";
import UserPasses from "../components/passes/UserPasses";

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
  const [availablePasses, setAvailablePasses] = useState<Pass[]>([]);
  const [userPasses, setUserPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all passes
  useEffect(() => {
    const fetchAvailablePasses = async () => {
      try {
        const { data, error } = await supabase.from("passes").select("*").is("user_id", null); // Fetch passes not tied to a user

        if (error) {
          console.error("Error fetching available passes:", error);
          setError("Unable to fetch available passes. Please try again later.");
          return;
        }
        setAvailablePasses(data || []);
      } catch (err) {
        console.error("Unexpected error fetching available passes:", err);
        setError("An unexpected error occurred.");
      }
    };

    fetchAvailablePasses();
  }, []);

  // Fetch user's passes
  useEffect(() => {
    const fetchUserPasses = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("passes")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching user passes:", error);
          setError("Unable to fetch your passes. Please try again later.");
          return;
        }
        setUserPasses(data || []);
      } catch (err) {
        console.error("Unexpected error fetching user passes:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPasses();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
            Please log in to view and buy passes
          </h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {userPasses.length > 0 ? (
          <>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
              Your Passes
            </h2>
            <UserPasses passes={userPasses} />
            <button
              onClick={() => setAvailablePasses([])} // Replace with modal or navigation logic
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
            >
              Buy Another Pass
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
              Choose Your Pass
            </h2>
            {availablePasses.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {availablePasses.map((pass) => (
                  <PassCard
                    key={pass.id}
                    title={pass.pass_type}
                    price={pass.price}
                    duration={pass.duration}
                    features={pass.features}
                    onSelect={() => console.log("Selected pass:", pass)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No passes available at the moment.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PassesPage;