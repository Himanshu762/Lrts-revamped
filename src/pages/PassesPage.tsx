import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import PassCard from "../components/passes/PassCard";
import UserPasses from "../components/passes/UserPasses";

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
  const [availablePasses, setAvailablePasses] = useState<Pass[]>([]);
  const [showAvailablePasses, setShowAvailablePasses] = useState(false);

  useEffect(() => {
    const fetchAvailablePasses = async () => {
      try {
        const { data, error } = await supabase.from("available_passes").select("*");
        if (error) {
          console.error("Error fetching available passes:", error);
          setAvailablePasses([]);
          return;
        }
        setAvailablePasses(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };
    fetchAvailablePasses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
          Your Passes
        </h2>
        {!showAvailablePasses ? (
          <UserPasses />
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
              Available Passes
            </h2>
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
          </>
        )}
        {!showAvailablePasses && (
          <button
            onClick={() => setShowAvailablePasses(true)}
            className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
          >
            Buy Another Pass
          </button>
        )}
      </div>
    </div>
  );
};

export default PassesPage;