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

const passes = [
  {
    title: 'Basic',
    price: '999',
    duration: 'month',
    features: [
      { text: 'Unlimited rides in one zone', included: true },
      { text: 'Peak hour access', included: true },
      { text: 'Multi-zone access', included: false },
      { text: 'Priority booking', included: false },
    ],
  },
  {
    title: 'Standard',
    price: '1499',
    duration: 'month',
    features: [
      { text: 'Unlimited rides in Multiple Zones', included: true },
      { text: 'Peak hour access', included: true },
      { text: 'Multi-zone access', included: true },
      { text: 'Priority booking', included: true },
    ],
    popular: true,
  },
]

const BuyAnotherPassModal: React.FC<BuyAnotherPassModalProps> = ({
  isOpen,
  onClose,
  availablePasses,
  onPassSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-4xl w-full shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Buy Another Pass</h3>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
          >
            &times;
          </button>
        </div>
        {/* Horizontal Layout */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {availablePasses.map((pass) => (
            <div
              key={pass.id}
              className="flex-shrink-0 w-72 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              {passes.map((pass, index) => (
            <PassCard 
              key={index} {...pass}
              onSelect={() => onPassSelect(pass)}
            />
          ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyAnotherPassModal;