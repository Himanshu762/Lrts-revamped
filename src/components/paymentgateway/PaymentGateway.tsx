import React, { useState } from "react";

const PaymentUI = () => {
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const handleCardChange = (field, value) => {
    setCardDetails({ ...cardDetails, [field]: value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-100">
      <div className="bg-white rounded-lg shadow-lg w-[400px]">
        {/* Header */}
        <div className="bg-green-500 p-4 text-white text-lg font-semibold rounded-t-lg">
          Freshtohome.com
        </div>

        {/* Price Summary */}
        <div className="p-4 border-b">
          <p className="text-gray-700">Price Summary</p>
          <h2 className="text-xl font-bold">₹152</h2>
          <p className="text-sm text-gray-500 mt-1">Using as +91 78929 74539</p>
        </div>

        {/* Payment Methods */}
        <div className="p-4">
          <h3 className="text-gray-700 font-semibold mb-2">Payment Options</h3>
          <div className="flex gap-2">
            {[
              { name: "UPI", icon: "upi-icon" },
              { name: "Cards", icon: "card-icon" },
              { name: "Netbanking", icon: "bank-icon" },
              { name: "Wallet", icon: "wallet-icon" },
              { name: "Pay Later", icon: "paylater-icon" },
            ].map((method) => (
              <button
                key={method.name}
                onClick={() => setSelectedMethod(method.name)}
                className={`flex-1 p-2 border rounded-md text-sm font-medium text-gray-600 ${
    selectedMethod === method.name ? "bg-green-500 text-white" : "bg-white"
  }`}
              >
                {method.name}
              </button>
            ))}
          </div>

          {/* Selected Method Details */}
          {selectedMethod === "UPI" && (
            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-1">UPI ID / Number</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="example@okhdfcbank"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          )}

          {selectedMethod === "Cards" && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => handleCardChange("number", e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => handleCardChange("expiry", e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardChange("cvv", e.target.value)}
                    placeholder="123"
                    maxLength={3}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Name on Card</label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => handleCardChange("name", e.target.value)}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 rounded-b-lg">
          <button className="w-full bg-green-500 text-white rounded-md py-2 font-medium hover:bg-green-600">
            Verify and Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentUI;