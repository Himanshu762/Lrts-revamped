import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useClerk } from "@clerk/clerk-react";
import UserPasses from "../components/passes/UserPasses";
import PassCard from "../components/passes/PassCard";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const PassesPage: React.FC = () => {
  const { user } = useClerk();
  const [userPasses, setUserPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPasses = async () => {
      if (!user?.emailAddress) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("passes")
          .select("*")
          .eq("email", user.emailAddress);

        if (error) {
          console.error("Error fetching passes:", error);
          setUserPasses([]);
        } else {
          setUserPasses(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setUserPasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPasses();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {userPasses.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Your Purchased Passes
            </h2>
            <UserPasses passes={userPasses} />
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Available Passes
            </h2>
            <PassCard />
          </>
        )}
      </div>
    </div>
  );
};

export default PassesPage;
