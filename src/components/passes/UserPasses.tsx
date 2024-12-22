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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {passes.map((pass) => (
        <motion.div
          key={pass.pass_secret}
          whileHover={{ translateY: -3 }}
          className={clsx(
            "relative overflow-hidden rounded-lg",
            "bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900",
            "animate-gradient-x shadow-md"
          )}
        >
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {pass.pass_type}
                </h3>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    ₹{pass.price}
                  </span>
                </div>
              </div>
              <CreditCard className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Home:</strong> {pass.home_zone}
              </p>
              <p>
                <strong>Destination:</strong> {pass.destination_zone}
              </p>
              <p>
                <strong>Email:</strong> {pass.email}
              </p>
              <p>
                <strong>Payment:</strong> {pass.payment_mode}
              </p>
            </div>
            <div className="mt-2 flex flex-col items-center space-y-1">
              <strong className="text-sm">QR Code:</strong>
              <QRCodeSVG value={pass.pass_secret} size={96} level="H" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UserPasses;
