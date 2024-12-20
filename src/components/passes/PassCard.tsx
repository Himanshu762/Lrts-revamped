import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard } from "lucide-react";
import clsx from "clsx";
import PaymentGateway from "../paymentgateway/PaymentGateway"; // Import the PaymentGateway component

interface PassFeature {
  text: string;
  included: boolean;
}

interface PassCardProps {
  title: string;
  price: string;
  duration: string;
  features: PassFeature[];
  popular?: boolean;
}

const PassCard: React.FC<PassCardProps> = ({ title, price, duration, features, popular }) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false); // State to manage payment modal visibility

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false); // Close the modal
    alert(`Payment successful! You have purchased the ${title} pass.`); // Notify the user
  };

  return (
    <>
      {/* Card */}
      <motion.div
        whileHover={{ translateY: -5 }}
        className={clsx(
          "relative overflow-hidden rounded-2xl",
          "bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900", // Dark mode background
          "animate-gradient-x",
          popular && "ring-2 ring-blue-300 dark:ring-blue-500" // Popular ring for dark mode
        )}
      >
        {popular && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-300 to-purple-300 dark:from-pink-600 dark:to-purple-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
            Popular
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h3> {/* Dark mode title */}
              <div className="mt-2">
                <span className="text-4xl font-extrabold text-gray-800 dark:text-white">₹{price}</span>{" "}
                <span className="text-lg text-gray-500 dark:text-gray-400">/{duration}</span>{" "}
                {/* Dark mode duration text */}
              </div>
            </div>
            <CreditCard className="w-10 h-10 text-gray-500 dark:text-gray-400" /> {/* Dark mode icon */}
          </div>

          {/* SVG & Info Section */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8">
              <svg viewBox="0 0 32 32" className="text-gray-500 dark:text-gray-400">
                <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
                <text x="16" y="20" textAnchor="middle" fill="currentColor" fontSize="12" fontFamily="sans-serif">
                  LRTS
                </text>
              </svg>
            </div>
            <div className="text-gray-500 dark:text-gray-400 font-mono">
              •••• •••• •••• {Math.floor(Math.random() * 9000) + 1000}
            </div>
          </div>

          {/* Features Section */}
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div
                  className={clsx(
                    "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center",
                    feature.included
                      ? "bg-blue-300 dark:bg-blue-500"
                      : "bg-gray-300 dark:bg-gray-700"
                  )}
                >
                  <Check
                    className={clsx(
                      "h-3 w-3",
                      feature.included ? "text-white" : "text-gray-400 dark:text-gray-500"
                    )}
                  />
                </div>
                <span
                  className={clsx(
                    "text-sm",
                    feature.included
                      ? "text-gray-800 dark:text-white"
                      : "text-gray-400 dark:text-gray-500 line-through"
                  )}
                >
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          {/* Button Section */}
          <button
            onClick={() => setIsPaymentOpen(true)} // Open the payment modal
            className={clsx(
              "w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200",
              "bg-blue-300 hover:bg-blue-400 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            )}
          >
            Get Started
          </button>
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentGateway
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)} // Close modal handler
        onPaymentSuccess={handlePaymentSuccess} // Payment success handler
      />
    </>
  );
};

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
`}</style>;

export default PassCard;
