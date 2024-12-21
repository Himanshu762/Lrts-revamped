import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useClerk } from "@clerk/clerk-react";
import UserPasses from "../components/passes/UserPasses";
import PassCard from "../components/passes/PassCard";
import BuyAnotherPassModal from "../components/modals/BuyAnotherPassModal";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const passes = [
  {
    title: 'Basic',
    price: '999',
    duration: 'month',
    features: [
      { text: 'Unlimited rides in one zone', included: true },
      { text: 'Peak hour access', included: true },
      { text: 'Multi-zone access', included: false },
      { text: 'Priority booking', included: false },
    ],
  },
  {
    title: 'Standard',
    price: '1499',
    duration: 'month',
    features: [
      { text: 'Unlimited rides in Multiple Zones', included: true },
      { text: 'Peak hour access', included: true },
      { text: 'Multi-zone access', included: true },
      { text: 'Priority booking', included: true },
    ],
    popular: true,
  },
];

const PassesPage: React.FC = () => {
  const { user } = useClerk();
  const [userPasses, setUserPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchUserPasses = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("passes")
          .select("*")
          .eq("email", user.primaryEmailAddress.emailAddress);

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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Your Purchased Passes
              </h2>
              <button
                onClick={() => setIsModalOpen(true)} // Toggle modal visibility
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Buy Another Pass
              </button>
            </div>
            <UserPasses passes={userPasses} />
            {isModalOpen && (
              <BuyAnotherPassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                availablePasses={passes} // Provide the list of passes
                onPassSelect={() => {
                  setIsModalOpen(false); // Close the modal after selection
                }}
              />
            )}
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                Choose Your Pass
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
                Select the perfect pass that suits your travel needs
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {passes.map((pass, index) => (
                <PassCard key={index} {...pass} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassesPage;
