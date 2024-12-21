import React from "react";
import PassCard from "../passes/PassCard";

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
  onPassSelect: (pass: Pass) => void;
}

const BuyAnotherPassModal: React.FC<BuyAnotherPassModalProps> = ({
  isOpen,
  onClose,
  availablePasses,
  onPassSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-5xl w-full">
        <h3 className="text-lg font-bold mb-4">Buy Another Pass</h3>
        {/* Horizontal Layout */}
        <div className="flex gap-4 overflow-x-auto">
          {availablePasses.map((pass) => (
            <div key={pass.id} className="flex-shrink-0 w-80">
              <PassCard
                title={pass.pass_type}
                price={pass.price}
                duration={pass.duration}
                features={pass.features}
                onSelect={() => onPassSelect(pass)} // Trigger when a pass is selected
              />
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 px-4 bg-gray-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BuyAnotherPassModal;