import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import clsx from "clsx";
import { QRCodeSVG } from "qrcode.react";

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
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null);

  return (
    <>
      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {passes.map((pass) => (
          <motion.div
            key={pass.pass_secret}
            whileHover={{ translateY: -3 }}
            className={clsx(
              "relative overflow-hidden rounded-lg",
              "bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900",
              "animate-gradient-x shadow-lg cursor-pointer",
              "w-full max-w-xs"
            )}
            style={{ width: "300px", height: "150px" }}
            onClick={() => setSelectedPass(pass)} // Open modal on click
          >
            <div className="p-4 space-y-2 h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                    {pass.pass_type}
                  </h3>
                  <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>
                    <strong>Home Zone:</strong> {pass.home_zone}
                  </p>
                  <p>
                    <strong>Destination Zone:</strong> {pass.destination_zone}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-base font-semibold text-gray-800 dark:text-white">
                  ₹{pass.price}
                </div>
                <QRCodeSVG value={pass.pass_secret} size={48} level="H" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {selectedPass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className={clsx(
              "relative overflow-hidden rounded-lg",
              "bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900",
              "animate-gradient-x shadow-lg w-full max-w-md"
            )}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6 space-y-4">
              <button
                onClick={() => setSelectedPass(null)} // Close modal
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
              >
                &times;
              </button>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {selectedPass.pass_type}
                  </h3>
                  <CreditCard className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    <strong>Home Zone:</strong> {selectedPass.home_zone}
                  </p>
                  <p>
                    <strong>Destination Zone:</strong> {selectedPass.destination_zone}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedPass.email}
                  </p>
                  <p>
                    <strong>Payment Mode:</strong> {selectedPass.payment_mode}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  ₹{selectedPass.price}
                </div>
                <QRCodeSVG value={selectedPass.pass_secret} size={64} level="H" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default UserPasses;