import React, { useState } from "react";
import PaymentGateway from "./PaymentGateway"; // Import payment gateway

interface ZoneSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  passDetails: { title: string; price: string };
}

const ZoneSelectionModal: React.FC<ZoneSelectionModalProps> = ({
  isOpen,
  onClose,
  passDetails,
}) => {
  const [homeZone, setHomeZone] = useState("");
  const [destinationZone, setDestinationZone] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleConfirm = () => {
    if (homeZone && destinationZone) {
      console.log("Opening PaymentGateway...");
      setIsPaymentOpen(true); // Open PaymentGateway modal
    }
  };

  const handlePaymentClose = () => {
    console.log("Closing PaymentGateway...");
    setIsPaymentOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {!isPaymentOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4 text-black dark:text-white">
              Select Zones
            </h3>
            <div>
              <label
                className="block mb-2 text-sm text-black dark:text-gray-300"
              >
                Home Zone:
              </label>
              <input
                type="text"
                value={homeZone}
                onChange={(e) => setHomeZone(e.target.value)}
                className="w-full p-2 border rounded mb-4 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-300 dark:border-gray-600"
                placeholder="Enter home zone"
              />
            </div>
            <div>
              <label
                className="block mb-2 text-sm text-black dark:text-gray-300"
              >
                Destination Zone:
              </label>
              <input
                type="text"
                value={destinationZone}
                onChange={(e) => setDestinationZone(e.target.value)}
                className="w-full p-2 border rounded mb-4 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-300 dark:border-gray-600"
                placeholder="Enter destination zone"
              />
            </div>
            <button
              onClick={handleConfirm}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <PaymentGateway
          passDetails={{ ...passDetails, homeZone, destinationZone }}
          onClose={handlePaymentClose}
        />
      )}
    </>
  );
};

export default ZoneSelectionModal;
