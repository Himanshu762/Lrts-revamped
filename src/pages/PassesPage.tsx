import React, { useState, useEffect } from "react";
import UserPasses from "../components/passes/UserPasses";
import PassCard from "../components/passes/PassCard";
import { useClerk } from "@clerk/clerk-react";

const PassesPage: React.FC = () => {
  const { user } = useClerk();
  const [userHasPasses, setUserHasPasses] = useState(false);

  const handleUserPassCheck = (hasPasses: boolean) => {
    setUserHasPasses(hasPasses);
  };

  // Default available passes
  const defaultPasses = [
    {
      id: 1, // Add unique IDs for default passes
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

  useEffect(() => {
    // Ensure user is authenticated before checking for passes
    if (!user) {
      console.warn("User not authenticated.");
      setUserHasPasses(false);
      return;
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {userHasPasses ? (
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
              {defaultPasses.map((pass) => (
                <PassCard
                  key={pass.id}
                  title={pass.title}
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