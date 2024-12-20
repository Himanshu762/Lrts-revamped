import React, { useState } from "react";
import PaymentGateway from "./PaymentGateway"; // Import payment gateway
import LocationSearch from "../trip/LocationSearch";
import { delhiMetroStations } from "../../data/stations"; // Assuming station data
import { findNearestStations } from "../../utils/zoneUtils";

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
  const [searchResult, setSearchResult] = useState<{
    lat: number;
    lon: number;
    nearestStations: typeof delhiMetroStations;
  } | null>(null);

  const handleSearch = async (location: string, setZone: (zone: string) => void) => {
    try {
      // Simulating a geocoding API call for the location
      const lat = 28.6139 + (Math.random() - 0.5) * 0.1;
      const lon = 77.2090 + (Math.random() - 0.5) * 0.1;

      const nearest = findNearestStations(lat, lon, delhiMetroStations);
      if (nearest.length > 0) {
        setZone(nearest[0].name);
        setSearchResult({ lat, lon, nearestStations: nearest });
      }
    } catch (error) {
      console.error("Error finding location:", error);
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
                onSearch={(location) => handleSearch(location, setHomeZone)}
                isLoading={false} // Assuming a loading state can be implemented
              />
              {homeZone && <p className="text-sm text-gray-600 mt-2">Selected: {homeZone}</p>}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm">Destination Zone:</label>
              <LocationSearch
                onSearch={(location) => handleSearch(location, setDestinationZone)}
                isLoading={false}
              />
              {destinationZone && <p className="text-sm text-gray-600 mt-2">Selected: {destinationZone}</p>}
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded"
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
            onClose();
          }}
        />
      )}
    </>
  );
};

export default ZoneSelectionModal;