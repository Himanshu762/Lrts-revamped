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
          'relative overflow-hidden rounded-2xl cursor-pointer',
          'bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900',
          'animate-gradient-x transition-transform transform',
          'w-full max-w-sm mx-auto',
          'h-[400px]',
          popular && 'ring-2 ring-blue-300 dark:ring-blue-500'
        )}
      >
        {popular && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-300 to-purple-300 dark:from-pink-600 dark:to-purple-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
            Popular
          </div>
        )}

        <div className="p-8 space-y-6 h-full flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-extrabold text-gray-800 dark:text-white">₹{price}</span>
                  <span className="text-lg text-gray-500 dark:text-gray-400">/{duration}</span>
                </div>
              </div>
              <CreditCard className="w-12 h-12 text-gray-500 dark:text-gray-400" />
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
          </div>

          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div
                  className={clsx(
                    'flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center',
                    feature.included ? 'bg-blue-300 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'
                  )}
                >
                  <Check
                    className={clsx(
                      'h-4 w-4',
                      feature.included ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                    )}
                  />
                </div>
                <span
                  className={clsx(
                    'text-sm',
                    feature.included
                      ? 'text-gray-800 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500 line-through'
                  )}
                >
                  {feature.text}
                </span>
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