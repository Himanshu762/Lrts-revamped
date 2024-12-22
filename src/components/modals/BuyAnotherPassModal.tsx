import React, { useState } from "react";
import PassCard from "../passes/PassCard";
import ZoneSelectionModal from "../modals/ZoneSelectionModal";

interface Pass {
  id: number;
  pass_type: string;
  price: string;
  duration: string;
  features: { text: string; included: boolean }[];
}

interface BuyAnotherPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  availablePasses: Pass[];
}

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

const BuyAnotherPassModal: React.FC<BuyAnotherPassModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedPass, setSelectedPass] = useState<null | {
    title: string;
    price: string;
  }>(null);

  const handlePassSelection = (pass: { title: string; price: string }) => {
    setSelectedPass(pass); // Open ZoneSelectionModal with pass details
  };

  const handleZoneModalClose = () => {
    setSelectedPass(null); // Close ZoneSelectionModal
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-4xl w-full shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Buy Another Pass
            </h3>
            <button
              onClick={onClose}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            >
              &times;
            </button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {passes.map((pass, index) => (
              <div
                key={index}
                className="transform translate-y-2 transition-all duration-300 cursor-pointer"
                onClick={() => handlePassSelection(pass)}
              >
                <PassCard {...pass} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Render ZoneSelectionModal */}
      {selectedPass && (
        <ZoneSelectionModal
          isOpen={!!selectedPass}
          onClose={handleZoneModalClose}
          passDetails={selectedPass}
        />
      )}
    </>
  );
};

export default BuyAnotherPassModal;