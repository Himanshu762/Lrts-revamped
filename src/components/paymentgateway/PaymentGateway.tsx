import React, { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUPIDropdownOpen, setIsUPIDropdownOpen] = useState(false);
  const [isCardsDropdownOpen, setIsCardsDropdownOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState<string | null>(null);
  const [selectedPass, setSelectedPass] = useState("Basic");
  const [price, setPrice] = useState(999);

  // Detect if dark mode is preferred by the user
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  // Update price based on selected pass
  useEffect(() => {
    if (selectedPass === "Basic") setPrice(999);
    else if (selectedPass === "Standard") setPrice(1499);
  }, [selectedPass]);

  // Detect Card Type
  useEffect(() => {
    const detectCardType = (number: string) => {
      const visaRegex = /^4/;
      const masterCardRegex = /^5[1-5]/;
      const amexRegex = /^3[47]/;
      const rupayRegex = /^6/;

      if (visaRegex.test(number)) return "Visa";
      if (masterCardRegex.test(number)) return "MasterCard";
      if (amexRegex.test(number)) return "Amex";
      if (rupayRegex.test(number)) return "Rupay";
      return null;
    };

    setCardType(detectCardType(cardNumber));
  }, [cardNumber]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isDarkMode ? "bg-gray-900 bg-opacity-80" : "bg-black bg-opacity-60"
      }`}
    >
      <div
        className={`rounded-lg shadow-lg w-[800px] max-w-full flex overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Sidebar */}
        <div
          className={`w-1/3 p-6 flex flex-col justify-between ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-blue-100 text-gray-900"
          }`}
        >
          <div>
            <h2 className="text-xl font-semibold">LRTS दिल्ली</h2>
            <p className="text-xs mt-1">JoyeshPay Trusted Business</p>

            <div className="mt-6">
              <h3 className="text-lg font-bold">Select Your Pass</h3>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="pass"
                      value="Basic"
                      checked={selectedPass === "Basic"}
                      onChange={() => setSelectedPass("Basic")}
                      className="form-radio"
                    />
                    <span>Basic - ₹999</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="pass"
                      value="Standard"
                      checked={selectedPass === "Standard"}
                      onChange={() => setSelectedPass("Standard")}
                      className="form-radio"
                    />
                    <span>Standard - ₹1499</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold">Price Summary</h3>
              <p className="text-2xl font-extrabold mt-4">₹{price}</p>
            </div>

            <div className="mt-6">
              <p className="text-sm">
                Using as <span className="font-semibold">+91 86605 83883</span>
              </p>
              <button
                className={`mt-2 text-sm underline ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Change
              </button>
            </div>
          </div>

          <div>
            <button
              className={`px-4 py-2 rounded-full text-sm w-full ${
                isDarkMode
                  ? "bg-blue-500 text-white"
                  : "bg-blue-300 text-blue-700"
              }`}
            >
              Offers on UPI and UPI QR
            </button>
          </div>
        </div>

        {/* Main Section */}
        <div className="w-2/3 p-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Payment Options
            </h2>
            <button onClick={onClose}>
              <X className={`h-6 w-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"} hover:text-gray-700`} />
            </button>
          </div>

          <div className="mt-4">
            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-4">
              {/* UPI Dropdown */}
              <div
                className={`border rounded-md p-3 ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setIsUPIDropdownOpen(!isUPIDropdownOpen)}
                >
                  <span className="text-sm font-medium">UPI</span>
                  {isUPIDropdownOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>

                {/* Dropdown Content */}
                {isUPIDropdownOpen && (
                  <div className="mt-3">
                    <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      UPI QR Code
                    </h3>
                    <div className="mt-2 flex items-center space-x-4">
                      <div
                        className={`p-4 rounded-md ${
                          isDarkMode ? "bg-gray-600" : "bg-gray-100"
                        }`}
                      >
                        <img
                          src="/src/components/pages/QR.png"
                          alt="QR Code"
                          className="h-24 w-24"
                        />
                      </div>
                      <div>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Scan with any UPI app to pay
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cards Dropdown */}
              <div
                className={`border rounded-md p-3 ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setIsCardsDropdownOpen(!isCardsDropdownOpen)}
                >
                  <span className="text-sm font-medium">Cards</span>
                  {isCardsDropdownOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>

                {/* Dropdown Content */}
                {isCardsDropdownOpen && (
                  <div className="mt-3 space-y-4">
                    <div>
                      <label className="block text-sm">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Enter your card number"
                        maxLength={16}
                        className={`mt-1 w-full p-2 rounded-md ${
                          isDarkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      />
                      {cardType && (
                        <p className={`mt-1 text-sm ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                          Detected: {cardType}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;