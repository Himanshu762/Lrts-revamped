import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import clsx from "clsx";
import { useClerk } from "@clerk/clerk-react";

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
  payment_mode: string;
}

interface UserPassesProps {
  onPassCheck?: (hasPasses: boolean) => void; // Callback to notify the parent about user passes
}

const UserPasses: React.FC<UserPassesProps> = ({ onPassCheck }) => {
  const [passes, setPasses] = useState<Pass[]>([]);
  const { user } = useClerk();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const { data, error } = await supabase
          .from("passes")
          .select("*")
          .eq("user_id", user?.id);
        if (error) {
          console.error("Error fetching user passes:", error);
          return;
        }
        setPasses(data || []);

        // Notify the parent about whether the user has passes
        if (onPassCheck) {
          onPassCheck((data || []).length > 0);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchPasses();
  }, [user, onPassCheck]);

  if (loading) {
    return <p>Loading your passes...</p>;
  }

  if (!passes.length) {
    return null; // No need to display anything if the user has no passes
  }

  return (
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
              <p>
                <strong>Payment Mode:</strong> {pass.payment_mode}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UserPasses;
