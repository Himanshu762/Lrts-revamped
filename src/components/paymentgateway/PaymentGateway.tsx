import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
              <h3 className="text-lg font-bold">Price Summary</h3>
              <p className="text-2xl font-extrabold mt-4">₹999</p>
            </div>

            <div className="mt-6">
              <p className="text-sm">
                Using as <span className="font-semibold">+91 78929 74539</span>
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
            {/* Offers */}
            <div
              className={`flex items-center space-x-4 p-3 rounded-md ${
                isDarkMode ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-800"
              }`}
            >
              <span className="text-sm font-medium">UPTO ₹200 Cashback on CRED</span>
              <button
                className={`text-sm underline ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                View all
              </button>
            </div>

            {/* Payment Methods */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {["UPI", "Cards", "Netbanking", "Wallet", "Pay Later"].map((method, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between border rounded-md p-3 hover:shadow-md ${
                    isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  <div className="text-sm font-medium">{method}</div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {index === 0 ? "2 Offers" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UPI QR Section */}
          <div className="mt-8">
            <h3 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              UPI QR
            </h3>
            <div className="mt-3 flex items-center space-x-4">
              <div
                className={`p-4 rounded-md ${
                  isDarkMode ? "bg-gray-600" : "bg-gray-100"
                }`}
              >
                <div
                  className={`p-4 rounded-md ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <img src="qr-code-placeholder.png" alt="QR Code" className="h-24 w-24" />
                </div>
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                  Scan with any app
                </p>
              </div>
            </div>
          </div>

          {/* Recommended */}
          <div
            className={`mt-6 p-3 rounded-md ${
              isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-gray-800"
            }`}
          >
            <p className="text-sm font-medium">Recommended</p>
            <div className="mt-2 text-sm">UPI - Google Pay</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;