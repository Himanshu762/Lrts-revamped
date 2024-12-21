import React, { useState, useEffect } from "react";
import UserPasses from "../components/passes/UserPasses";
import PassCard from "../components/passes/PassCard";

const PassesPage: React.FC = () => {
  const [userHasPasses, setUserHasPasses] = useState(false);

  const handleUserPassCheck = (hasPasses: boolean) => {
    setUserHasPasses(hasPasses);
  };

  // Default available passes
  const defaultPasses = [
    {
      id: 1,
      pass_type: "Basic Pass",
      price: "100",
      duration: "1 Month",
      features: [
        { text: "Access to Zone 1", included: true },
        { text: "Limited Rides", included: true },
        { text: "Premium Features", included: false },
      ],
    },
    {
      id: 2,
      pass_type: "Standard Pass",
      price: "300",
      duration: "3 Months",
      features: [
        { text: "Access to Zones 1-2", included: true },
        { text: "Unlimited Rides", included: true },
        { text: "Premium Features", included: true },
      ],
    },
  ];

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