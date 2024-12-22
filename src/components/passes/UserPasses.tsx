import React from "react";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import clsx from "clsx";
import { createClient } from "@supabase/supabase-js";
import { QRCodeSVG } from "qrcode.react";

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
  passes: Pass[];
}

const UserPasses: React.FC<UserPassesProps> = ({ passes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {passes.map((pass) => (
        <motion.div
          key={pass.pass_secret}
          whileHover={{ translateY: -3 }}
          className={clsx(
            "relative overflow-hidden rounded-lg",
            "bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900",
            "animate-gradient-x shadow-lg",
            "w-full max-w-sm"
          )}
          style={{ width: "350px", height: "200px" }} // Slightly larger than standard credit card size
        >
          <div className="p-4 space-y-3 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-bold text-gray-800 dark:text-white">
                  {pass.pass_type}
                </h3>
                <CreditCard className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>
                  <strong>Home Zone:</strong> {pass.home_zone}
                </p>
                <p>
                  <strong>Destination Zone:</strong> {pass.destination_zone}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold text-gray-800 dark:text-white">
                ₹{pass.price}
              </div>
              <QRCodeSVG value={pass.pass_secret} size={64} level="H" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UserPasses;