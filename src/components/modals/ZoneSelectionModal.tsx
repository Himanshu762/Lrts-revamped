import React, { useState } from "react";
import PaymentGateway from "./PaymentGateway";
import LocationSearch from "../components/trip/LocationSearch"; // Assuming LocationSearch is available
import { findNearestStations } from "../utils/zoneUtils";
import { delhiMetroStations } from "../data/stations";

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
  const [homeNearest, setHomeNearest] = useState<string | null>(null);
  const [destinationNearest, setDestinationNearest] = useState<string | null>(
    null
  );

  const handleZoneSearch = async (zone: string, setZone: any, setNearest: any) => {
    try {
      const lat = 28.6139 + (Math.random() - 0.5) * 0.1;
      const lon = 77.2090 + (Math.random() - 0.5) * 0.1;
      const nearestStations = findNearestStations(lat, lon, delhiMetroStations);
      if (nearestStations.length > 0) {
        setZone(zone);
        setNearest(nearestStations[0].name); // Assuming nearestStations returns a sorted list
      }
    } catch {
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
            <div className="mb-4">
              <label className="block mb-2 text-sm">Home Zone:</label>
              <LocationSearch
                onSearch={(zone) => handleZoneSearch(zone, setHomeZone, setHomeNearest)}
                isLoading={false}
              />
              {homeNearest && (
                <p className="text-sm text-gray-500 mt-2">
                  Nearest Zone: {homeNearest}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm">Destination Zone:</label>
              <LocationSearch
                onSearch={(zone) =>
                  handleZoneSearch(zone, setDestinationZone, setDestinationNearest)
                }
                isLoading={false}
              />
              {destinationNearest && (
                <p className="text-sm text-gray-500 mt-2">
                  Nearest Zone: {destinationNearest}
                </p>
              )}
            </div>
            <button
              onClick={handleConfirm}
              className={`w-full py-2 px-4 ${
                homeZone && destinationZone
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } rounded`}
              disabled={!homeZone || !destinationZone}
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
            onClose(); // Only trigger onClose when done with payment modal
          }}
        />
      )}
    </>
  );
};

export default ZoneSelectionModal;