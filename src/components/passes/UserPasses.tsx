import React, { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import clsx from "clsx";

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

interface Pass {
  pass_secret: string;
  pass_type: string;
  price: string;
  home_zone: string;
  destination_zone: string;
  email: string;
  payment_mode: string; // Added payment_mode
}

const UserPasses: React.FC = () => {
  const [passes, setPasses] = useState<Pass[]>([]);
  const { user } = useClerk();

  useEffect(() => {
    const fetchPasses = async () => {
      const { data, error } = await supabase
        .from("passes")
        .select("*")
        .eq("user_id", user?.id);

      if (error) console.error("Error fetching passes:", error);
      else setPasses(data || []);
    };

    if (user?.id) {
      fetchPasses();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
          Your Passes
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {passes.map((pass) => (
            <motion.div
              key={pass.pass_secret}
              whileHover={{ translateY: -5 }}
              className={clsx(
                "relative overflow-hidden rounded-2xl",
                "bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900",
                "animate-gradient-x"
              )}
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {pass.pass_type}
                    </h3>
                    <div className="mt-2">
                      <span className="text-4xl font-extrabold text-gray-800 dark:text-white">
                        ₹{pass.price}
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                </div>

                <div className="space-y-2">
                  <p><strong>Home Zone:</strong> {pass.home_zone}</p>
                  <p><strong>Destination Zone:</strong> {pass.destination_zone}</p>
                  <p><strong>Email:</strong> {pass.email}</p>
                  <p><strong>Pass Secret:</strong> {pass.pass_secret}</p>
                  <p><strong>Payment Mode:</strong> {pass.payment_mode}</p> {/* Display payment mode */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPasses;

<style jsx>{`
  @keyframes gradient-x {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 5s ease infinite;
  }
`}</style>
