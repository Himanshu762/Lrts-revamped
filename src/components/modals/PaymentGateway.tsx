import React, { useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useClerk } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

interface PaymentGatewayProps {
  passDetails: {
    title: string;
    price: string;
    homeZone: string;
    destinationZone: string;
  };
  onClose: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ passDetails, onClose }) => {
  const navigate = useNavigate();
  const { user } = useClerk();
  const [activeScreen, setActiveScreen] = useState("UPI");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const handlePayment = async (paymentMode: string) => {
    setIsPaymentProcessing(true);

    try {
      const passSecret = uuidv4();

      const { error } = await supabase.from("passes").insert([
        {
          user_id: user?.id,
          name: user?.fullName || "Unknown User",
          email: user?.primaryEmailAddress?.emailAddress || "No Email",
          pass_type: passDetails.title,
          price: passDetails.price,
          home_zone: passDetails.homeZone,
          destination_zone: passDetails.destinationZone,
          pass_secret: passSecret,
          payment_mode: paymentMode,
        },
      ]);

      if (error) {
        console.error("Failed to save pass details:", error);
        alert("Payment failed. Please try again.");
        setIsPaymentProcessing(false);
        return;
      }

      navigate("/passes", { state: { success: true } });
    } catch (err) {
      console.error("Payment error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "UPI":
        return <UPIScreen onPay={() => handlePayment("UPI")} />;
      case "Cards":
        return <CardsScreen onPay={() => handlePayment("Card")} />;
      case "Wallets":
        return <WalletsScreen onPay={() => handlePayment("Wallet")} />;
      case "NetBanking":
        return <NetBankingScreen onPay={() => handlePayment("NetBanking")} />;
      case "EMI":
        return <EMIScreen onPay={() => handlePayment("EMI")} />;
      default:
        return <UPIScreen onPay={() => handlePayment("UPI")} />;
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center bg-gray-100 text-gray-900">
      <div className="flex w-[900px] shadow-lg rounded-md overflow-hidden bg-white">
        {/* Sidebar */}
        <div className="w-1/3 p-6 bg-green-200">
          <div className="text-center">
            <img src="/fresh-to-home-logo.png" alt="Logo" className="mx-auto mb-4" />
            <h2 className="text-lg font-bold">LRTS.com</h2>
            <p className="text-sm text-gray-600">JoyeshPay Trusted Business</p>
          </div>
          <div className="mt-8">
            <h3 className="text-md font-semibold">{passDetails.title}</h3>
            <p className="text-2xl font-bold mt-2">₹{passDetails.price}</p>
          </div>
          <div className="mt-6">
            <p className="text-sm">Using as {user?.primaryPhoneNumber || "No Phone"}</p>
            <p className="text-sm mt-2 text-green-700 cursor-pointer">
              Offers on UPI and Cards
            </p>
          </div>
          <div className="absolute bottom-6 left-6">
            <p className="text-xs text-gray-500">Secured by JoyeshPay</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Options</h2>
          <div className="flex">
            <div className="w-1/3">
              {["UPI", "Cards", "Wallets", "NetBanking", "EMI"].map((mode) => (
                <MenuOption
                  key={mode}
                  label={mode}
                  active={activeScreen === mode}
                  onClick={() => setActiveScreen(mode)}
                />
              ))}
            </div>
            <div className="w-2/3">{renderScreen()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuOption = ({ label, active, onClick }: any) => (
  <div
    onClick={onClick}
    className={clsx(
      "py-2 px-4 cursor-pointer rounded-md",
      active ? "bg-green-100 font-bold" : "hover:bg-gray-50 text-gray-700"
    )}
  >
    {label}
  </div>
);

const UPIScreen = ({ onPay }: { onPay: () => void }) => {
  const [upiId, setUpiId] = useState("");

  return (
    <div>
      <h3 className="font-semibold mb-4">Enter your UPI ID</h3>
      <input
        type="text"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        placeholder="example@okhdfcbank"
        className="w-full border p-2 rounded-md"
      />
      <button onClick={onPay} className="mt-4 w-full bg-black text-white py-2 rounded-md">
        Verify and Pay
      </button>
    </div>
  );
};

const CardsScreen = ({ onPay }: { onPay: () => void }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  return (
    <div>
      <h3 className="font-semibold mb-4">Add a new card</h3>
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="Card Number"
        className="w-full border p-2 rounded-md mb-4"
      />
      <div className="flex space-x-4">
        <input
          type="text"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          placeholder="MM / YY"
          className="w-1/2 border p-2 rounded-md"
        />
        <input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="CVV"
          className="w-1/2 border p-2 rounded-md"
        />
      </div>
      <button onClick={onPay} className="mt-4 w-full bg-black text-white py-2 rounded-md">
        Continue
      </button>
    </div>
  );
};

const WalletsScreen = ({ onPay }: { onPay: () => void }) => (
  <div>
    <h3 className="font-semibold mb-4">All Wallet Options</h3>
    <ul className="space-y-2">
      {["Amazon Pay", "Google Pay", "Paytm Wallet", "PhonePe"].map((wallet, index) => (
        <li
          key={index}
          onClick={onPay}
          className="cursor-pointer border p-2 rounded-md hover:bg-gray-50"
        >
          {wallet}
        </li>
      ))}
    </ul>
  </div>
);

const NetBankingScreen = ({ onPay }: { onPay: () => void }) => (
  <div>
    <h3 className="font-semibold mb-4">Select Your Bank</h3>
    <ul className="space-y-2">
      {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank"].map((bank, index) => (
        <li
          key={index}
          onClick={onPay}
          className="cursor-pointer border p-2 rounded-md hover:bg-gray-50"
        >
          {bank}
        </li>
      ))}
    </ul>
  </div>
);

const EMIScreen = ({ onPay }: { onPay: () => void }) => (
  <div>
    <h3 className="font-semibold mb-4">EMI Options</h3>
    <ul className="space-y-2">
      {["6 Months", "9 Months", "12 Months"].map((option, index) => (
        <li
          key={index}
          onClick={onPay}
          className="cursor-pointer border p-2 rounded-md hover:bg-gray-50"
        >
          {option}
        </li>
      ))}
    </ul>
  </div>
);

export default PaymentGateway;
