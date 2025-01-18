import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import UserPasses from "../components/passes/UserPasses";
import PassCard from "../components/passes/PassCard";
import BuyAnotherPassModal from "../components/modals/BuyAnotherPassModal";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const passes = [
  {
    title: "Daily Pass - Single Trip",
    price: "25",
    duration: "trip",
    features: [
      { text: "Single trip to any metro station in the zone", included: true },
    ],
  },
  {
    title: "Daily Pass - Single Zone",
    price: "35",
    duration: "day",
    features: [
      { text: "Up to 2 rides/day in one zone", included: true },
    ],
  },
  {
    title: "Daily Pass - Dual Zone",
    price: "95",
    duration: "day",
    features: [
      { text: "Up to 4 rides/day across two zones", included: true },
    ],
  },
];

const PassesPage: React.FC = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [userPasses, setUserPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setLoading(false);
      return;
    }

    const fetchUserPasses = async () => {
      if (user?.primaryEmailAddress) {
        try {
          const { data, error } = await supabase
            .from("passes")
            .select("*")
            .eq("email", user.primaryEmailAddress);

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
      }
    };

    fetchUserPasses();
  }, [user, isLoaded, isSignedIn]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Please Sign In or Sign Up to Access Your Passes
          </h2>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signin"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
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
                onClick={() => setIsModalOpen(true)}
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
                availablePasses={passes}
                onPassSelect={() => {
                  setIsModalOpen(false);
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1">
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