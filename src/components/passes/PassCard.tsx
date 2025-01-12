import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard } from 'lucide-react';
import clsx from 'clsx';
import ZoneSelectionModal from '../modals/ZoneSelectionModal';

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
  insideBuyAnotherPassModal?: boolean; // New prop
  onCardClick?: () => void; // Callback for click when inside BuyAnotherPassModal
}

const PassCard: React.FC<PassCardProps> = ({
  title,
  price,
  duration,
  features = [],
  popular,
  insideBuyAnotherPassModal = false,
  onCardClick,
}) => {
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);

  const handleClick = () => {
    if (insideBuyAnotherPassModal && onCardClick) {
      onCardClick();
    } else if (!insideBuyAnotherPassModal) {
      setIsZoneModalOpen(true);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ translateY: -5 }}
        onClick={handleClick}
        className={clsx(
          'relative overflow-hidden rounded-lg cursor-pointer',
          'bg-gradient-to-b from-blue-800 to-blue-900',
          'transition-transform transform',
          'w-full max-w-sm mx-auto',
          'h-[200px]',
          popular && 'ring-2 ring-blue-300'
        )}
      >
        {popular && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium">
            Popular
          </div>
        )}

        <div className="p-6 space-y-4 h-full flex flex-col justify-between text-white">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold">₹{price}</span>
                  <span className="text-sm text-gray-300">/{duration}</span>
                </div>
              </div>
              <CreditCard className="w-6 h-6 text-gray-300" />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <div className="h-8 w-8">
              <svg viewBox="0 0 32 32" className="text-gray-300">
                <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
                <text x="16" y="20" textAnchor="middle" fill="currentColor" fontSize="12" fontFamily="sans-serif">
                  LRTS
                </text>
              </svg>
            </div>
            <div className="text-gray-300 font-mono">•••• •••• •••• {Math.floor(Math.random() * 9000) + 1000}</div>
          </div>

          <ul className="space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                <Check className="h-4 w-4" />
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {!insideBuyAnotherPassModal && (
        <ZoneSelectionModal
          isOpen={isZoneModalOpen}
          onClose={() => setIsZoneModalOpen(false)}
          passDetails={{ title, price }}
        />
      )}
    </>
  );
};

export default PassCard;