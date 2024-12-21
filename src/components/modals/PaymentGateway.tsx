import React, { useState } from "react";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import visa from "../misc/icons/visa.svg";
import mastercard from "../misc/icons/mastercard.svg";
import amex from "../misc/icons/amex.svg";
import discover from "../misc/icons/discover.svg";
import generic from "../misc/icons/generic.svg";
import diners from "../misc/icons/diners.svg";
import unionpay from "../misc/icons/unionpay.svg";
import maestro from "../misc/icons/maestro.svg";
import jcb from "../misc/icons/jcb.svg";
import cvvicon from "../misc/icons/cvv.svg";
import qrcode from "../misc/QR.png";

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

// Card Type Icons
const cardIcons: { [key: string]: string } = {
  Visa: visa,
  MasterCard: mastercard,
  "American Express": amex,
  Discover: discover,
  JCB: jcb,
  "Diners Club": diners,
  UnionPay: unionpay,
  Maestro: maestro,
  Unknown: generic,
};

const cvvIcon = cvvicon;
const QRCode = qrcode;

// Identify Card Type Helper
const identifyCardType = (cardNumber: string): string => {
  const visaRegex = /^4/;
  const masterCardRegex = /^5[1-5]/;
  const maestroRegex = /^(?:5018|5020|5038|56|58|63|67)/;
  const amexRegex = /^3[47]/;
  const discoverRegex = /^6(?:011|4[4-9]|5)/;
  const dinersClubRegex = /^3(?:0[0-5]|[689])/;
  const jcbRegex = /^(?:2131|1800|35\d{2})/;
  const unionPayRegex = /^62/;

  if (visaRegex.test(cardNumber)) return "Visa";
  if (masterCardRegex.test(cardNumber)) return "MasterCard";
  if (maestroRegex.test(cardNumber)) return "Maestro";
  if (amexRegex.test(cardNumber)) return "American Express";
  if (discoverRegex.test(cardNumber)) return "Discover";
  if (dinersClubRegex.test(cardNumber)) return "Diners Club";
  if (jcbRegex.test(cardNumber)) return "JCB";
  if (unionPayRegex.test(cardNumber)) return "UnionPay";
  return "Unknown";
};


// Allowed UPI suffixes
const validUPISuffixes = [
  "@okhdfcbank",
  "@okaxis",
  "@okicici",
  "@oksbi",
  "@ptyes",
  "@ptsbi",
  "@pthdfc",
  "@ptaxis",
];

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
      } else {
        alert("Payment successful! Your pass has been added.");
        onClose(); // Close the payment gateway after successful payment
      }
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
      <div className="bg-gradient-to-br from-white to-blue-100 dark:from-gray-800 dark:to-blue-900 rounded-lg shadow-lg w-4/5 max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
        >
          &times;
        </button>
        <div className="flex h-full">
          {/* Sidebar */}
          <Sidebar passDetails={passDetails} />

          {/* Main Content */}
          <div className="w-3/4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Payment Options</h2>
            </div>

            <div className="flex space-x-4 mb-4">
              {["UPI", "Cards", "Wallets", "Net Banking", "EMI"].map((mode) => (
                <MenuOption
                  key={mode}
                  label={mode}
                  active={activePaymentMode === mode}
                  onClick={() => setActivePaymentMode(mode)}
                />
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-3/4 p-6">{renderPaymentMode()}</div>
        </div>
        <div className="p-6">
          <button
            onClick={handlePayment}
            disabled={isPaymentProcessing}
            className={clsx(
              "w-full py-3 rounded-lg text-lg font-bold",
              isPaymentProcessing
                ? "bg-gray-400 text-gray-800"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {isPaymentProcessing ? "Processing Payment..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar: React.FC<{ passDetails: PaymentGatewayProps["passDetails"] }> = ({ passDetails }) => (
  <div className="w-1/4 bg-blue-300 dark:bg-blue-600 p-6 flex flex-col justify-between">
    <div className="text-center">
      <img src="https://img.freepik.com/premium-vector/modern-l-letter-logo-vector_724449-55.jpg" alt="Logo" className="mx-auto mb-4" />
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">LRTS.com</h2>
      <p className="text-sm text-gray-500 dark:text-gray-200">JoyeshPay Trusted Business</p>
    </div>
    <div>
      <h3 className="text-md font-semibold text-gray-800 dark:text-white">Price Summary</h3>
      <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">₹{passDetails.price}</p>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-200">Secured by JoyeshPay</p>
  </div>
);

// MenuOption Component
const MenuOption: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <div
    onClick={onClick}
    className={clsx(
      "py-2 px-4 cursor-pointer rounded-md",
      active
        ? "bg-blue-700 text-white"
        : "hover:bg-blue-100 text-white dark:hover:bg-blue-500"
    )}
  >
    {label}
  </div>
);

// UPI Screen Component with QR Code
const UPIScreen: React.FC<{ onSelect: (upiId: string) => void }> = ({ onSelect }) => {
  const [upiId, setUpiId] = useState("");

  const handleVerify = () => {
    if (!upiId) {
      alert("Please enter a UPI ID.");
      return;
    }

    const isValidUPI = validUPISuffixes.some((suffix) => upiId.endsWith(suffix));

    if (!isValidUPI) {
      alert("Invalid UPI ID. Please use a valid UPI ID.");
      return;
    }

    onSelect(upiId);
    alert("UPI ID Verified Successfully!");
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Enter your UPI ID</h3>
      <input
        type="text"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        placeholder="example@bank"
        className="w-full border border-gray-300 rounded-md p-3 mb-4"
      />
      <button
        onClick={handleVerify}
        className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700"
      >
        Verify and Select
      </button>

      <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-4">Or Scan QR Code</h3>
      <img src={QRCode} alt="QR Code for Payment" className="w-40 h-40 mx-auto my-4" />
    </div>
  );
};

const CardsScreen: React.FC<{ onSelect: (cardDetails: string) => void }> = ({ onSelect }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState<string>("");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setCardNumber(input);
    setCardType(identifyCardType(input));
  };

  const handleCardSelect = () => {
    if (!cardNumber || cardNumber.length < 16) {
      alert("Please enter a valid card number.");
      return;
    }
    onSelect(`${cardType} Card ending in ${cardNumber.slice(-4)}`);
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-Black mb-2">Enter your Card Details</h3>
      <div className="relative mb-4">
        <div className="relative mb-4">
          {/* Card Number Input */}
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="Card Number"
              className="w-full pl-14 pr-4 border border-gray-300 rounded-md p-3"
              maxLength={16}
            />
            <img
              src={cardIcons[cardType]}
              alt={`${cardType} icon`}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8"
            />
          </div>
        </div>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="Cardholder Name"
          className="w-full border border-gray-300 rounded-md p-3 mb-2"
        />
        <input
          type="text"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          placeholder="MM/YY"
          className="w-full border border-gray-300 rounded-md p-3 mb-2"
        />
        <div className="relative mb-4">
        {/* CVV Input */}
        <div className="relative">
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="CVV"
            className="w-full pl-4 pr-14 border border-gray-300 rounded-md p-3"
            maxLength={4}
          />
          <img
            src={cvvIcon}
            alt="CVV icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8"
          />
        </div>
      </div>
      </div>
      <button
        onClick={handleCardSelect}
        className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700"
      >
        Verify and Select
      </button>
    </div>
  );
};

const WalletsScreen: React.FC<{ onSelect: (wallet: string) => void }> = ({ onSelect }) => {
  const [wallet, setWallet] = useState("");

  const handleVerify = () => {
    if (wallet) {
      onSelect(wallet);
      alert("Wallet Selected Successfully");
    } else {
      alert("Please select a wallet.");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Select your Wallet</h3>
      <select
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-3 mb-4"
      >
        <option value="">-- Select Wallet --</option>
        <option value="Paytm">Paytm</option>
        <option value="Google Pay">Google Pay</option>
        <option value="PhonePe">PhonePe</option>
      </select>
      <button
        onClick={handleVerify}
        className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700"
      >
        Select Wallet
      </button>
    </div>
  );
};

const NetBankingScreen: React.FC<{ onSelect: (bank: string) => void }> = ({ onSelect }) => {
  const [bank, setBank] = useState("");

  const handleVerify = () => {
    if (bank) {
      onSelect(bank);
      alert("Net Banking Selected Successfully");
    } else {
      alert("Please select a bank.");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Select your Bank</h3>
      <select
        value={bank}
        onChange={(e) => setBank(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-3 mb-4"
      >
        <option value="">-- Select Bank --</option>
        <option value="HDFC">HDFC</option>
        <option value="SBI">SBI</option>
        <option value="ICICI">ICICI</option>
        <option value="Axis Bank">Axis Bank</option>
        <option value="Kotak Mahindra">Kotak Mahindra</option> 
        <option value="Punjab National Bank">Punjab National Bank</option> 
        <option value="Bank of Baroda">Bank of Baroda</option> 
        <option value="Yes Bank">Yes Bank</option> 
        <option value="IDFC First Bank">IDFC First Bank</option> 
      </select>
      <button
        onClick={handleVerify}
        className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700"
      >
        Select Bank
      </button>
    </div>
  );
};

const EMIScreen: React.FC<{ onSelect: (emi: string) => void }> = ({ onSelect }) => {
  const [emi, setEmi] = useState("");

  const handleVerify = () => {
    if (emi) {
      onSelect(emi);
      alert("EMI Selected Successfully");
    } else {
      alert("Please select an EMI option.");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Select EMI Option</h3>
      <select
        value={emi}
        onChange={(e) => setEmi(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-3 mb-4"
      >
        <option value="">-- Select EMI --</option>
        <option value="3 months">3 months</option>
        <option value="6 months">6 months</option>
        <option value="12 months">12 months</option>
      </select>
      <button
        onClick={handleVerify}
        className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700"
      >
        Select EMI
      </button>
    </div>
  );
};

export default PaymentGateway;
