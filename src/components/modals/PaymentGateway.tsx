import React, { useState } from "react";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

interface PaymentGatewayProps {
  passDetails: { title: string; price: string; homeZone: string; destinationZone: string };
  onClose: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ passDetails, onClose }) => {
  const { user } = useClerk();
  const navigate = useNavigate();
  const [activePaymentMode, setActivePaymentMode] = useState("UPI");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");

  const handlePayment = async () => {
    if (!selectedPaymentMode) {
      alert("Please select a payment mode.");
      return;
    }

    setIsPaymentProcessing(true);

    try {
      const { error } = await supabase.from("passes").insert([
        {
          user_id: user?.id,
          name: user?.fullName || "Unknown User",
          email: user?.primaryEmailAddress?.emailAddress || "No Email",
          pass_type: passDetails.title,
          price: passDetails.price,
          home_zone: passDetails.homeZone,
          destination_zone: passDetails.destinationZone,
          pass_secret: uuidv4(),
          payment_mode: selectedPaymentMode,
        },
      ]);

      if (error) {
        console.error("Failed to save pass details:", error);
        alert("Payment failed. Please try again.");
        setIsPaymentProcessing(false);
        return;
      }

      // Navigate to passes page after successful payment
      navigate("/passes", { state: { success: true } });
    } catch (err) {
      console.error("Payment error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const renderPaymentMode = () => {
    switch (activePaymentMode) {
      case "UPI":
        return <UPIScreen onSelect={(upiId) => setSelectedPaymentMode(`UPI: ${upiId}`)} />;
      case "Cards":
        return <CardsScreen onSelect={(cardDetails) => setSelectedPaymentMode(`Card: ${cardDetails}`)} />;
      case "Wallets":
        return <WalletsScreen onSelect={(wallet) => setSelectedPaymentMode(`Wallet: ${wallet}`)} />;
      case "Net Banking":
        return <NetBankingScreen onSelect={(bank) => setSelectedPaymentMode(`Net Banking: ${bank}`)} />;
      case "EMI":
        return <EMIScreen onSelect={(emi) => setSelectedPaymentMode(`EMI: ${emi}`)} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-2/3 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4">Payment Gateway</h3>
        <div className="flex">
          <div className="w-1/3">
            {["UPI", "Cards", "Wallets", "Net Banking", "EMI"].map((mode) => (
              <div
                key={mode}
                onClick={() => setActivePaymentMode(mode)}
                className={clsx(
                  "py-2 px-4 cursor-pointer rounded-md mb-2",
                  activePaymentMode === mode
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                )}
              >
                {mode}
              </div>
            ))}
          </div>
          <div className="w-2/3">{renderPaymentMode()}</div>
        </div>
        <button
          onClick={handlePayment}
          disabled={isPaymentProcessing}
          className={clsx(
            "w-full py-2 px-4 rounded mt-4",
            isPaymentProcessing ? "bg-gray-400" : "bg-green-500 text-white"
          )}
        >
          {isPaymentProcessing ? "Processing Payment..." : "Confirm Payment"}
        </button>
      </div>
    </div>
  );
};

// Individual Payment Modes

const UPIScreen: React.FC<{ onSelect: (upiId: string) => void }> = ({ onSelect }) => {
  const [upiId, setUpiId] = useState("");

  const handleVerify = () => {
    if (upiId) {
      onSelect(upiId);
      alert("UPI Verified Successfully");
    } else {
      alert("Please enter a valid UPI ID.");
    }
  };

  return (
    <div>
      <h4 className="font-semibold mb-2">Enter your UPI ID</h4>
      <input
        type="text"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        placeholder="example@bank"
        className="w-full border p-2 rounded mb-2"
      />
      <button onClick={handleVerify} className="w-full bg-black text-white py-2 rounded">
        Verify and Select
      </button>
    </div>
  );
};

const CardsScreen: React.FC<{ onSelect: (details: string) => void }> = ({ onSelect }) => {
  const [cardNumber, setCardNumber] = useState("");

  const handleSelect = () => {
    if (cardNumber) {
      onSelect(cardNumber);
      alert("Card Selected Successfully");
    } else {
      alert("Please enter valid card details.");
    }
  };

  return (
    <div>
      <h4 className="font-semibold mb-2">Enter your Card Number</h4>
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="1234 5678 9012 3456"
        className="w-full border p-2 rounded mb-2"
      />
      <button onClick={handleSelect} className="w-full bg-black text-white py-2 rounded">
        Select Card
      </button>
    </div>
  );
};

const WalletsScreen: React.FC<{ onSelect: (wallet: string) => void }> = ({ onSelect }) => (
  <div>
    <h4 className="font-semibold mb-2">Select a Wallet</h4>
    {["Paytm", "Google Pay", "PhonePe"].map((wallet) => (
      <div
        key={wallet}
        onClick={() => onSelect(wallet)}
        className="border p-2 rounded mb-2 cursor-pointer hover:bg-gray-100"
      >
        {wallet}
      </div>
    ))}
  </div>
);

const NetBankingScreen: React.FC<{ onSelect: (bank: string) => void }> = ({ onSelect }) => (
  <div>
    <h4 className="font-semibold mb-2">Select Your Bank</h4>
    {["HDFC", "ICICI", "SBI"].map((bank) => (
      <div
        key={bank}
        onClick={() => onSelect(bank)}
        className="border p-2 rounded mb-2 cursor-pointer hover:bg-gray-100"
      >
        {bank}
      </div>
    ))}
  </div>
);

const EMIScreen: React.FC<{ onSelect: (emi: string) => void }> = ({ onSelect }) => (
  <div>
    <h4 className="font-semibold mb-2">Select EMI Option</h4>
    {["6 Months", "9 Months", "12 Months"].map((emi) => (
      <div
        key={emi}
        onClick={() => onSelect(emi)}
        className="border p-2 rounded mb-2 cursor-pointer hover:bg-gray-100"
      >
        {emi}
      </div>
    ))}
  </div>
);

export default PaymentGateway;