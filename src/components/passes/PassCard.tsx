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
        whileHover={{ translateY: -3 }}
        onClick={handleClick}
        className={clsx(
          'relative overflow-hidden rounded-lg cursor-pointer',
          'bg-gradient-to-br from-blue-900 to-blue-950',
          'shadow-lg',
          'w-full max-w-xs',
          'h-[150px]'
        )}
      >
        {popular && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
            Popular
          </div>
        )}

        <div className="p-4 space-y-2 h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-white">
                {title}
              </h3>
              <CreditCard className="w-5 h-5 text-gray-300" />
            </div>
            <div className="text-xs text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6">
                  <svg viewBox="0 0 24 24" className="text-gray-300">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    <text x="12" y="15" textAnchor="middle" fill="currentColor" fontSize="8" fontFamily="sans-serif">
                      LRTS
                    </text>
                  </svg>
                </div>
                <span className="font-mono">•••• •••• •••• {Math.floor(Math.random() * 9000) + 1000}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-base font-semibold text-white">
              ₹{price}<span className="text-xs text-gray-300">/{duration}</span>
            </div>
            <div className="flex space-x-1">
              {features.slice(0, 1).map((feature, index) => (
                <span key={index} className="text-xs text-gray-300 truncate max-w-[150px]">
                  {feature.text}
                </span>
              ))}
            </div>
          </div>
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