import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard } from "lucide-react";
import clsx from "clsx";
import ZoneSelectionModal from "./components/modals/ZoneSelectionModal";

interface PassCardProps {
  title: string;
  price: string;
  duration: string;
  popular?: boolean;
}

const PassCard: React.FC<PassCardProps> = ({ title, price, duration, popular }) => {
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ translateY: -5 }}
        className={clsx(
          "relative overflow-hidden rounded-2xl",
          "bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900",
          "animate-gradient-x",
          popular && "ring-2 ring-blue-300 dark:ring-blue-500"
        )}
      >
        {popular && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-300 to-purple-300 dark:from-pink-600 dark:to-purple-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
            Popular
          </div>
        )}

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h3>
              <div className="mt-2">
                <span className="text-4xl font-extrabold text-gray-800 dark:text-white">₹{price}</span>{" "}
                <span className="text-lg text-gray-500 dark:text-gray-400">/{duration}</span>
              </div>
            </div>
            <CreditCard className="w-10 h-10 text-gray-500 dark:text-gray-400" />
          </div>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8">
              <svg viewBox="0 0 32 32" className="text-gray-500">
                <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
                <text x="16" y="20" textAnchor="middle" fill="currentColor" fontSize="12" fontFamily="sans-serif">
                  LRTS
                </text>
              </svg>
            </div>
            <div className="text-gray-500 font-mono">•••• •••• •••• {Math.floor(Math.random() * 9000) + 1000}</div>
          </div>

          {/* Hardcoded Features */}
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <div
                className={clsx(
                  "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center",
                  "bg-blue-300 dark:bg-blue-500"
                )}
              >
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-gray-800 dark:text-white">Unlimited rides in Multiple Zones</span>
            </li>

            <li className="flex items-center space-x-3">
              <div
                className={clsx(
                  "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center",
                  "bg-blue-300 dark:bg-blue-500"
                )}
              >
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-gray-800 dark:text-white">Peak hour access</span>
            </li>

            <li className="flex items-center space-x-3">
              <div
                className={clsx(
                  "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center",
                  "bg-blue-300 dark:bg-blue-500"
                )}
              >
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-gray-800 dark:text-white">Multi-zone access</span>
            </li>

            <li className="flex items-center space-x-3">
              <div
                className={clsx(
                  "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center",
                  "bg-blue-300 dark:bg-blue-500"
                )}
              >
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-gray-800 dark:text-white">Priority booking</span>
            </li>
          </ul>

          <button
            onClick={() => setIsZoneModalOpen(true)}
            className={clsx(
              "w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200",
              "bg-blue-300 hover:bg-blue-400 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            )}
          >
            Get Started
          </button>
        </div>
      </motion.div>

      <ZoneSelectionModal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
        passDetails={{ title, price }}
      />
    </>
  );
};

export default PassCard;