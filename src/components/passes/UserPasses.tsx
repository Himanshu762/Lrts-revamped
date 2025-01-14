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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 auto-rows-fr">
        {passes.map((pass) => (
          <div key={pass.pass_secret} className="flex items-center justify-center">
            <motion.div
              whileHover={{ translateY: -3 }}
              className={clsx(
                "relative overflow-hidden rounded-lg",
                "bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900",
                "animate-gradient-x shadow-lg cursor-pointer",
                "w-full aspect-[1.586]",
                "min-w-[240px] max-w-[340px]"
              )}
              onClick={() => setSelectedPass(pass)}
            >
              <div className="p-3 space-y-1.5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-gray-800 dark:text-white line-clamp-1 flex-1 mr-2">
                      {pass.pass_type}
                    </h3>
                    <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                    <p className="flex items-center space-x-1">
                      <strong>Home Zone:</strong> 
                      <span className="truncate">{pass.home_zone}</span>
                    </p>
                    <p className="flex items-center space-x-1">
                      <strong>Destination Zone:</strong>
                      <span className="truncate">{pass.destination_zone}</span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-semibold text-gray-800 dark:text-white">
                    ₹{pass.price}
                  </div>
                  <QRCodeSVG value={pass.pass_secret} size={32} level="H" />
                </div>
              </div>
            </motion.div>
          </div>
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