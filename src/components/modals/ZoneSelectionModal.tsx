import React, { useState } from "react";
import PaymentGateway from "./PaymentGateway";
import { delhiMetroStations } from "../../data/stations"; // Adjust the path as needed

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
      alert("Please select both Home Zone and Destination Zone.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl relative transition-transform transform scale-100">
          {!isPaymentOpen ? (
            <>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white text-center">
                Select Zones
              </h3>
              <div>
                <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
                  Home Zone:
                </label>
                <select
                  value={homeZone}
                  onChange={(e) => setHomeZone(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="" disabled>
                    Select Home Zone
                  </option>
                  {delhiMetroStations.map((station) => (
                    <option key={station.name} value={station.name}>
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
                  Destination Zone:
                </label>
                <select
                  value={destinationZone}
                  onChange={(e) => setDestinationZone(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="" disabled>
                    Select Destination Zone
                  </option>
                  {delhiMetroStations.map((station) => (
                    <option key={station.name} value={station.name}>
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleConfirm}
                className="w-full mt-6 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200"
              >
                Confirm
              </button>
            </>
          ) : (
            <PaymentGateway
              passDetails={{ ...passDetails, homeZone, destinationZone }}
              onClose={() => {
                setIsPaymentOpen(false);
                onClose();
              }}
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-transform transform hover:scale-110"
          >
            &times;
          </button>
        </div>
      </div>
    </>
  );
};

export default ZoneSelectionModal;