import React, { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const PassesPage: React.FC = () => {
  const [userPasses, setUserPasses] = useState<any[]>([]);
  const { user } = useClerk();

  useEffect(() => {
    const fetchPasses = async () => {
      const { data, error } = await supabase
        .from("passes")
        .select("*")
        .eq("user_id", user?.id);

      if (error) console.error("Error fetching passes:", error);
      else setUserPasses(data || []);
    };

    fetchPasses();
  }, [user]);

  if (userPasses.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
            Manage Your Passes
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {userPasses.map((pass) => (
              <div
                key={pass.pass_secret}
                className="p-4 border rounded-lg bg-white dark:bg-gray-800"
              >
                <h3 className="text-xl font-bold">{pass.pass_type}</h3>
                <p>
                  <strong>Price:</strong> ₹{pass.price}
                </p>
                <p>
                  <strong>Home Zone:</strong> {pass.home_zone}
                </p>
                <p>
                  <strong>Destination Zone:</strong> {pass.destination_zone}
                </p>
                <p>
                  <strong>Email:</strong> {pass.email}
                </p>
                <p>
                  <strong>Pass Secret:</strong> {pass.pass_secret}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Choose Your Pass
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
            Select the perfect pass that suits your travel needs
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {passes.map((pass, index) => (
            <PassCard key={index} {...pass} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassesPage;