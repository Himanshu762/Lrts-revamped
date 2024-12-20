import React from "react";
import clsx from "clsx";
import { X } from "lucide-react";

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[800px] max-w-full flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 bg-green-100 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-green-700">LRTS दिल्ली</h2>
            <p className="text-xs text-gray-500 mt-1">JoyeshPay Trusted Business</p>

            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800">Price Summary</h3>
              <p className="text-2xl font-extrabold text-green-700 mt-4">₹188</p>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500">Using as <span className="text-gray-700 font-semibold">+91 78929 74539</span></p>
              <button className="mt-2 text-blue-600 text-sm underline">Change</button>
            </div>
          </div>

          <div>
            <button className="text-green-700 bg-green-300 px-4 py-2 rounded-full text-sm w-full">
              Offers on UPI and UPI QR
            </button>
          </div>
        </div>

        {/* Main Section */}
        <div className="w-2/3 bg-white p-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Payment Options</h2>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="mt-4">
            {/* Offers */}
            <div className="flex items-center space-x-4 bg-gray-100 p-3 rounded-md">
              <span className="text-sm font-medium text-gray-800">UPTO ₹200 CRED cashback on CRED</span>
              <button className="text-blue-600 text-sm underline">View all</button>
            </div>

            {/* Payment Methods */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* UPI */}
              <div className="flex items-center justify-between border rounded-md p-3 hover:shadow-md">
                <div className="text-sm font-medium text-gray-800">UPI</div>
                <div className="flex items-center space-x-2">
                  <img src="upi-icon.png" alt="UPI" className="h-5 w-5" />
                  <span className="text-xs text-gray-500">2 Offers</span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex items-center justify-between border rounded-md p-3 hover:shadow-md">
                <div className="text-sm font-medium text-gray-800">Cards</div>
                <img src="visa-icon.png" alt="Cards" className="h-5 w-5" />
              </div>

              {/* Netbanking */}
              <div className="flex items-center justify-between border rounded-md p-3 hover:shadow-md">
                <div className="text-sm font-medium text-gray-800">Netbanking</div>
                <img src="netbanking-icon.png" alt="Netbanking" className="h-5 w-5" />
              </div>

              {/* Wallet */}
              <div className="flex items-center justify-between border rounded-md p-3 hover:shadow-md">
                <div className="text-sm font-medium text-gray-800">Wallet</div>
                <img src="wallet-icon.png" alt="Wallet" className="h-5 w-5" />
              </div>

              {/* Pay Later */}
              <div className="flex items-center justify-between border rounded-md p-3 hover:shadow-md">
                <div className="text-sm font-medium text-gray-800">Pay Later</div>
                <img src="paylater-icon.png" alt="Pay Later" className="h-5 w-5" />
              </div>
            </div>

            {/* UPI QR Section */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-800">UPI QR</h3>
              <div className="mt-3 flex items-center space-x-4">
                <div className="bg-gray-100 p-4 rounded-md">
                  <div className="bg-white p-4 rounded-md">
                    <img src="qr-code-placeholder.png" alt="QR Code" className="h-24 w-24" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scan with any app</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <img src="gpay-icon.png" alt="Google Pay" className="h-6 w-6" />
                    <img src="phonepe-icon.png" alt="PhonePe" className="h-6 w-6" />
                    <img src="paytm-icon.png" alt="Paytm" className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended */}
            <div className="mt-6 bg-gray-100 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-800">Recommended</p>
              <div className="mt-2 text-sm text-gray-500">UPI - Google Pay</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;