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
          'w-full',
          'aspect-[1.586]',
          'min-w-[240px] max-w-[340px]'
        )}
      >
        {popular && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-0.5 text-xs font-medium rounded-bl-lg">
            Popular
          </div>
        )}

        <div className="p-3 space-y-1.5 h-full flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-white line-clamp-1 flex-1 mr-2">
                {title}
              </h3>
              <CreditCard className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </div>
            <div className="text-xs text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="text-gray-300">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    <text x="12" y="15" textAnchor="middle" fill="currentColor" fontSize="8" fontFamily="sans-serif">
                      LRTS
                    </text>
                  </svg>
                </div>
                <span className="font-mono text-[10px] whitespace-nowrap overflow-hidden text-ellipsis">
                  •••• •••• •••• {Math.floor(Math.random() * 9000) + 1000}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-1.5">
            {features.slice(0, 1).map((feature, index) => (
              <div key={index} className="flex items-center space-x-1.5 bg-blue-800/50 rounded p-1">
                <Check className="h-3 w-3 text-blue-300 flex-shrink-0" />
                <span className="text-[10px] text-blue-100 line-clamp-1">
                  {feature.text}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold text-white whitespace-nowrap">
                ₹{price}<span className="text-[10px] text-gray-300">/{duration}</span>
              </div>
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