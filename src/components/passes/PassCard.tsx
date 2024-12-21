import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard } from "lucide-react";
import clsx from "clsx";
import ZoneSelectionModal from "../modals/ZoneSelectionModal";

const PassCard: React.FC = () => {
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState<{
    title: string;
    price: string;
  } | null>(null);

  const passes = [
    {
      title: "Basic",
      price: "999",
      duration: "month",
      features: [
        { text: "Unlimited rides in one zone", included: true },
        { text: "Peak hour access", included: true },
        { text: "Multi-zone access", included: false },
        { text: "Priority booking", included: false },
      ],
    },
    {
      title: "Standard",
      price: "1499",
      duration: "month",
      features: [
        { text: "Unlimited rides in Multiple Zones", included: true },
        { text: "Peak hour access", included: true },
        { text: "Multi-zone access", included: true },
        { text: "Priority booking", included: true },
      ],
      popular: true,
    },
  ];

  const handleGetStarted = (pass: { title: string; price: string }) => {
    setSelectedPass(pass);
    setIsZoneModalOpen(true);
  };

  return (
    <>
      {/* Pass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {passes.map((pass, index) => (
          <motion.div
            key={index}
            whileHover={{ translateY: -5 }}
            className={clsx(
              "relative overflow-hidden rounded-2xl",
              "bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900",
              "animate-gradient-x",
              pass.popular && "ring-2 ring-blue-300 dark:ring-blue-500"
            )}
          >
            {/* Popular Tag */}
            {pass.popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-300 to-purple-300 dark:from-pink-600 dark:to-purple-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                Popular
              </div>
            )}

            {/* Pass Details */}
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {pass.title}
                  </h3>
                  <div className="mt-2">
                    <span className="text-4xl font-extrabold text-gray-800 dark:text-white">
                      ₹{pass.price}
                    </span>{" "}
                    <span className="text-lg text-gray-500 dark:text-gray-400">
                      /{pass.duration}
                    </span>
                  </div>
                </div>
                <CreditCard className="w-10 h-10 text-gray-500 dark:text-gray-400" />
              </div>

              {/* Features */}
              <ul className="space-y-3">
                {pass.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
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
                          feature.included
                            ? "text-white"
                            : "text-gray-400 dark:text-gray-500"
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

              {/* Get Started Button */}
              <button
                onClick={() =>
                  handleGetStarted({ title: pass.title, price: pass.price })
                }
                className={clsx(
                  "w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200",
                  "bg-blue-300 hover:bg-blue-400 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                )}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Zone Selection Modal */}
      {selectedPass && (
        <ZoneSelectionModal
          isOpen={isZoneModalOpen}
          onClose={() => setIsZoneModalOpen(false)}
          passDetails={selectedPass}
        />
      )}
    </>
  );
};

export default PassCard;