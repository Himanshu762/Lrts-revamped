import React, { useState } from "react";
import PaymentGateway from "./PaymentGateway";

interface ZoneSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  passDetails: { title: string; price: string };
}

const ZoneSelectionModal: React.FC<ZoneSelectionModalProps> = ({ isOpen, onClose, passDetails }) => {
  const [homeZone, setHomeZone] = useState("");
  const [destinationZone, setDestinationZone] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleConfirm = () => {
    if (homeZone && destinationZone) {
      setIsPaymentOpen(true); // Trigger payment modal
    } else {
      alert("Please fill in both Home Zone and Destination Zone.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
      >
        {!isPaymentOpen ? (
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-auto shadow-lg transition-all transform"
          >
            {/* Header */}
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Select Zones
            </h3>

            {/* Home Zone Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Home Zone:
              </label>
              <input
                type="text"
                value={homeZone}
                onChange={(e) => setHomeZone(e.target.value)}
                className="w-full p-2 border rounded-lg dark:text-white dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter your home zone"
              />
            </div>

            {/* Destination Zone Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destination Zone:
              </label>
              <input
                type="text"
                value={destinationZone}
                onChange={(e) => setDestinationZone(e.target.value)}
                className="w-full p-2 border rounded-lg dark:text-white dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter your destination zone"
              />
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Confirm
            </button>
          </div>
        ) : (
          <PaymentGateway
            passDetails={{ ...passDetails, homeZone, destinationZone }}
            onClose={() => {
              setIsPaymentOpen(false); // Return to the zone selection modal
              onClose(); // Close the main modal
            }}
          />
        )}
      </div>
    </>
  );
};

export default ZoneSelectionModal;