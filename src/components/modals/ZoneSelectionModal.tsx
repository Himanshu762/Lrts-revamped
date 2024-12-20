import React, { useState } from "react";
import PaymentGateway from "./PaymentGateway";
import { findNearestStations } from "../../utils/zoneUtils"; // Function to find nearest stations
import { delhiMetroStations } from "../../data/stations"; // Data for predefined stations

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
  const [homeNearest, setHomeNearest] = useState<string | null>(null);
  const [destinationNearest, setDestinationNearest] = useState<string | null>(
    null
  );
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleZoneSearch = (input: string, setZone: any, setNearest: any) => {
    const normalizedInput = input.toLowerCase().trim();
    const nearestStations = findNearestStations(normalizedInput, delhiMetroStations);
    
    if (nearestStations.length > 0) {
      setZone(input);
      setNearest(nearestStations[0].name); // Assuming nearestStations is sorted by distance
    } else {
      setZone(input);
      setNearest(null);
    }
  };

  const handleConfirm = () => {
    if (homeZone && destinationZone) {
      setIsPaymentOpen(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {!isPaymentOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Select Zones</h3>
            <div>
              <label className="block mb-2 text-sm">Home Zone:</label>
              <input
                type="text"
                value={homeZone}
                onChange={(e) =>
                  handleZoneSearch(e.target.value, setHomeZone, setHomeNearest)
                }
                className="w-full p-2 border rounded mb-4"
              />
              {homeNearest ? (
                <p className="text-sm text-gray-500">Nearest: {homeNearest}</p>
              ) : (
                <p className="text-sm text-red-500">No matching zone found</p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm">Destination Zone:</label>
              <input
                type="text"
                value={destinationZone}
                onChange={(e) =>
                  handleZoneSearch(
                    e.target.value,
                    setDestinationZone,
                    setDestinationNearest
                  )
                }
                className="w-full p-2 border rounded mb-4"
              />
              {destinationNearest ? (
                <p className="text-sm text-gray-500">Nearest: {destinationNearest}</p>
              ) : (
                <p className="text-sm text-red-500">No matching zone found</p>
              )}
            </div>
            <button
              onClick={handleConfirm}
              disabled={!homeZone || !destinationZone}
              className={`w-full py-2 px-4 ${
                homeZone && destinationZone
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } rounded`}
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <PaymentGateway
          passDetails={{ ...passDetails, homeZone, destinationZone }}
          onClose={() => {
            setIsPaymentOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default ZoneSelectionModal;
