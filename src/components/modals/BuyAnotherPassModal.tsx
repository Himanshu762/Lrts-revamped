import React, { useState } from 'react';
import PassCard from '../passes/PassCard';
import ZoneSelectionModal from '../modals/ZoneSelectionModal';

const passes = [
  {
    title: 'Daily Pass - Single Trip',
    price: '17',
    duration: 'trip',
    features: [
      { text: 'Single trip to any metro station in the zone', included: true },
    ],
  },
  {
    title: 'Daily Pass - Single Zone',
    price: '35',
    duration: 'day',
    features: [
      { text: 'Up to 2 rides/day in one zone', included: true },
    ],
  },
  {
    title: 'Daily Pass - Dual Zone',
    price: '95',
    duration: 'day',
    features: [
      { text: 'Up to 4 rides/day across two zones', included: true },
    ],
  },
];

const BuyAnotherPassModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [selectedPass, setSelectedPass] = useState<{ title: string; price: string } | null>(null);

  if (!isOpen) return null;

  return (
    <>
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

          {/* Add margin-top to move the PassCards down */}
          <div className="flex gap-4 overflow-x-auto pb-4 mt-2">
            {passes.map((pass, index) => (
              <div key={index} className="mt-2">
                <PassCard
                  {...pass}
                  insideBuyAnotherPassModal={true}
                  onCardClick={() => setSelectedPass({ title: pass.title, price: pass.price })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPass && (
        <ZoneSelectionModal
          isOpen={!!selectedPass}
          onClose={() => setSelectedPass(null)}
          passDetails={selectedPass}
        />
      )}
    </>
  );
};

export default BuyAnotherPassModal;