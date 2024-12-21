import React, { useState, useEffect } from "react";
import UserPasses from "../components/passes/UserPasses";
import PassCard from "../components/passes/PassCard";
import { createClient } from "@supabase/supabase-js";
import { useClerk } from "@clerk/clerk-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const PassesPage: React.FC = () => {
  const { user } = useClerk();
  const [userHasPasses, setUserHasPasses] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default available passes
  const defaultPasses = [
    {
      id: 1, // Unique ID
      title: "Basic",
      price: "999",
      duration: "month",
      features: [
        { text: "Unlimited rides in one zone", included: true },
        { text: "Peak hour access", included: true },
        { text: "Multi-zone access", included: false },
        { text: "Priority booking", included: false },
      ],
    },
    {
      id: 2,
      title: "Standard",
      price: "1499",
      duration: "month",
      features: [
        { text: "Unlimited rides in Multiple Zones", included: true },
        { text: "Peak hour access", included: true },
        { text: "Multi-zone access", included: true },
        { text: "Priority booking", included: true },
      ],
      popular: true,
    },
  ];

  // Fetch user passes from the database
  useEffect(() => {
    const fetchUserPasses = async () => {
      if (!user) {
        console.warn("User not authenticated.");
        setUserHasPasses(false);
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
          setUserHasPasses(false);
        } else {
          setUserHasPasses(data && data.length > 0);
        }
      } catch (err) {
        console.error("Unexpected error fetching passes:", err);
        setUserHasPasses(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPasses();
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {userHasPasses ? (
          <>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
              Your Passes
            </h2>
            <UserPasses />
          </>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
              Choose Your Pass
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {defaultPasses.map((pass) => (
                <PassCard
                  key={pass.id}
                  title={pass.title}
                  price={pass.price}
                  duration={pass.duration}
                  features={pass.features}
                  popular={pass.popular}
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
