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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        {!isPaymentOpen ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Select Zones</h3>

            <div>
              <label className="block mb-2 text-sm">Home Zone:</label>
              <select
                value={homeZone}
                onChange={(e) => setHomeZone(e.target.value)}
                className="w-full p-2 border rounded mb-4 dark:text-white dark:bg-gray-900"
              >
                <option value="">Select Home Zone</option>
                {delhiMetroStations.map((station) => (
                  <option key={station.name} value={station.name}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm">Destination Zone:</label>
              <select
                value={destinationZone}
                onChange={(e) => setDestinationZone(e.target.value)}
                className="w-full p-2 border rounded mb-4 dark:text-white dark:bg-gray-900"
              >
                <option value="">Select Destination Zone</option>
                {delhiMetroStations.map((station) => (
                  <option key={station.name} value={station.name}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded"
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