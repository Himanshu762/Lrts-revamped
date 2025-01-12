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
          'bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900',
          'animate-gradient-x transition-transform transform',
          'w-full max-w-sm mx-auto',
          'h-[300px]',
          popular && 'ring-2 ring-blue-300 dark:ring-blue-500'
        )}
      >
        {popular && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-300 to-purple-300 dark:from-pink-600 dark:to-purple-600 text-white px-3 py-1 rounded-bl-lg text-xs font-medium">
            Popular
          </div>
        )}

        <div className="p-6 space-y-4 h-full flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
                <div className="mt-1">
                  <span className="text-3xl font-extrabold text-gray-800 dark:text-white">₹{price}</span>
                  <span className="text-base text-gray-500 dark:text-gray-400">/{duration}</span>
                </div>
              </div>
              <CreditCard className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
          </div>

          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <Check className={clsx(
                  'h-4 w-4',
                  feature.included ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400'
                )} />
                <span className={clsx(
                  'text-sm',
                  feature.included
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-400 line-through'
                )}>
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