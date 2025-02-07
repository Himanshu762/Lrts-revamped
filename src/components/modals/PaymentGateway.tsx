import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
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
import { QRCodeSVG } from "qrcode.react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const cardIcons: { [key: string]: string } = {Visa: visa, MasterCard: mastercard, "American Express": amex, Discover: discover, JCB: jcb, "Diners Club": diners, UnionPay: unionpay, Maestro: maestro, Unknown: generic,};
const cvvIcon = cvvicon;

const identifyCardType = (cardNumber: string): string => {const visaRegex = /^4/;
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

const validUPISuffixes = ["@okhdfcbank","@okaxis","@okicici","@oksbi","@ptyes","@ptsbi","@pthdfc","@ptaxis",];

interface PaymentGatewayProps {
  passDetails: { title: string; price: string; homeZone: string; destinationZone: string };
  onClose: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ passDetails, onClose }) => {
  const { user } = useClerk();
  const [activePaymentMode, setActivePaymentMode] = useState("UPI");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    if (activePaymentMode === "UPI") {
      generateUPIQR();
    }
  }, [activePaymentMode, passDetails.price]);

  const generateUPIQR = () => {
    const merchantId = "LRTS" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const transactionId = Math.random().toString(36).substring(2, 12).toUpperCase();
    const timestamp = Date.now();
    const amount = parseFloat(passDetails.price).toFixed(2);
    
    const upiUrl = `upi://pay?pa=lrts@upi&pn=LRTS_METRO&tr=${transactionId}&tn=${passDetails.title}&am=${amount}&cu=INR&mc=4121&mid=${merchantId}&sign=${timestamp}`;
    setQrValue(upiUrl);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMode) {alert("Please select a payment mode.");return;}
  
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
  
      if(error){console.error("Failed to save pass details:",error);alert("Payment failed. Please try again.");}else{alert("Payment successful! Your pass has been added.");onClose();}}catch(err){console.error("Payment error:", err); alert("An unexpected error occurred. Please try again.");}finally{setIsPaymentProcessing(false);}
  };
  

  const renderPaymentMode = () => {
    switch (activePaymentMode) {
      case "UPI":
        return <UPIScreen onSelect={(upiId) => setSelectedPaymentMode(`UPI: ${upiId}`)} qrValue={qrValue} />;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-5xl relative overflow-hidden">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl z-10"
        >
          &times;
        </button>
        
        <div className="flex flex-col lg:flex-row min-h-[500px] max-h-[90vh]">
          {/* Left Panel - Payment Summary */}
          <div className="lg:w-1/3 bg-blue-900 text-white p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4">LRTS.com</h2>
              <p className="text-sm mb-2">LRTSPay</p>
              <p className="text-sm mb-4">Trusted Business</p>
              <h3 className="text-xl font-semibold mb-2">{passDetails.title}</h3>
              <p className="text-sm mb-4">Price Summary</p>
              <p className="text-3xl font-bold">₹{passDetails.price}</p>
            </div>
            <div className="mt-auto">
              <p className="text-sm">Secured by</p>
              <p className="font-semibold">LRTSPay</p>
            </div>
          </div>

          {/* Right Panel - Payment Options */}
          <div className="lg:w-2/3 p-6 overflow-y-auto">
            <div className="flex flex-wrap gap-2 mb-6">
              {["UPI", "Cards", "Wallets", "Net Banking", "EMI"].map((mode) => (
                <MenuOption
                  key={mode}
                  label={mode}
                  active={activePaymentMode === mode}
                  onClick={() => setActivePaymentMode(mode)}
                />
              ))}
            </div>
            <div className="mt-4">
              {renderPaymentMode()}
              <button
                onClick={handlePayment}
                disabled={isPaymentProcessing}
                className="bg-green-600 text-white py-2 px-4 rounded-md w-full mt-4 hover:bg-green-700 disabled:bg-gray-400"
              >
                {isPaymentProcessing ? "Processing..." : "Pay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
};

const MenuOption: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <div 
    onClick={onClick} 
    className={clsx(
      "py-2 px-4 cursor-pointer rounded-md transition-colors",
      active 
        ? "bg-blue-600 text-white" 
        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-600"
    )}
  >
    {label}
  </div>
);

const UPIScreen: React.FC<{ 
  onSelect: (upiId: string) => void;
  qrValue: string;
}> = ({ onSelect, qrValue }) => {
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
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
        Enter your UPI ID
      </h3>
      <input
        type="text"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        placeholder="example@bank"
        className="w-full border border-gray-300 rounded-md p-3 mb-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
      />
      <button
        onClick={handleVerify}
        className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700"
      >
        Verify and Select
      </button>
      
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-4">
        Or Scan QR Code
      </h3>
      <div className="flex justify-center my-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG
            value={qrValue}
            size={160}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Scan with any UPI app to pay
      </p>
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
  const isValidCardNumber = (cardNumber: string, cardType: string): boolean => {
    const cardLengths: { [key: string]: number[] } = {Visa: [13, 16], MasterCard: [16], "American Express": [15], Discover: [16], "Diners Club": [14], JCB: [15, 16], Maestro: [12, 13, 14, 15, 16, 17, 18, 19], Unknown: [16],};
    return cardLengths[cardType]?.includes(cardNumber.length) || false;
  };
  const handleCardSelect = () => {
    if (!isValidCardNumber(cardNumber, cardType)) {alert(`Please enter a valid ${cardType} card number.`);return;}
    onSelect(`${cardType} Card ending in ${cardNumber.slice(-4)}`);
  }; 
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Enter your Card Details</h3>
      <div className="relative mb-4">
        <div className="relative mb-4">
          <div className="relative">
            <input type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="Card Number" className="w-full pl-14 pr-4 border border-gray-300 rounded-md p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white" maxLength={16}/>
            <img src={cardIcons[cardType]} alt={`${cardType} icon`} className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8"/>
          </div>
        </div>
        <input type="text" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} placeholder="Cardholder Name" className="w-full border border-gray-300 rounded-md p-3 mb-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"/>
        <input type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="MM/YY" className="w-full border border-gray-300 rounded-md p-3 mb-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"/>
        <div className="relative mb-4">
        <div className="relative">
          <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="CVV" className="w-full pl-4 pr-14 border border-gray-300 rounded-md p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white" maxLength={4}/>
          <img src={cvvIcon} alt="CVV icon" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8"/>
        </div>
      </div>
      </div>
      <button onClick={handleCardSelect} className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700">Verify and Select</button>
    </div>
  );
}; 

const WalletsScreen: React.FC<{ onSelect: (wallet: string) => void }> = ({ onSelect }) => {
  const [wallet, setWallet] = useState("");
  const handleVerify = () => { if (wallet) {onSelect(wallet); alert("Wallet Selected Successfully");} else {alert("Please select a wallet.");}};
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Select your Wallet</h3>
      <select value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full border border-gray-300 rounded-md p-3 mb-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
        <option value="" className="text-gray-600 dark:text-gray-300">-- Select Wallet --</option>
        <option value="Paytm" className="text-gray-800 dark:text-white">Paytm</option>
        <option value="Google Pay" className="text-gray-800 dark:text-white">Google Pay</option>
        <option value="PhonePe" className="text-gray-800 dark:text-white">PhonePe</option>
        <option value="Amazon Pay" className="text-gray-800 dark:text-white">Amazon Pay</option>
        <option value="Mobikwik" className="text-gray-800 dark:text-white">Mobikwik</option>
        <option value="Freecharge" className="text-gray-800 dark:text-white">Freecharge</option>
        <option value="Airtel Money" className="text-gray-800 dark:text-white">Airtel Money</option>
        <option value="JioMoney" className="text-gray-800 dark:text-white">JioMoney</option>
      </select>
      <button onClick={handleVerify} className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700">Select Wallet</button>
    </div>
  );
};

const NetBankingScreen: React.FC<{ onSelect: (bank: string) => void }> = ({ onSelect }) => {
  const [bank, setBank] = useState("");
  const handleVerify = () => {if (bank) {onSelect(bank); alert("Net Banking Selected Successfully");} else {alert("Please select a bank.");}};
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Select your Bank</h3>
      <select value={bank} onChange={(e) => setBank(e.target.value)} className="w-full border border-gray-300 rounded-md p-3 mb-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
        <option value="" className="text-gray-600 dark:text-gray-300">-- Select Bank --</option>
        <option value="HDFC" className="text-gray-800 dark:text-white">HDFC</option>
        <option value="SBI" className="text-gray-800 dark:text-white">SBI</option>
        <option value="ICICI" className="text-gray-800 dark:text-white">ICICI</option>
        <option value="Axis Bank" className="text-gray-800 dark:text-white">Axis Bank</option>
        <option value="Kotak Mahindra" className="text-gray-800 dark:text-white">Kotak Mahindra</option>
        <option value="Punjab National Bank" className="text-gray-800 dark:text-white">Punjab National Bank</option>
        <option value="Bank of Baroda" className="text-gray-800 dark:text-white">Bank of Baroda</option>
        <option value="Canara Bank" className="text-gray-800 dark:text-white">Canara Bank</option>
        <option value="Yes Bank" className="text-gray-800 dark:text-white">Yes Bank</option>
        <option value="IDBI Bank" className="text-gray-800 dark:text-white">IDBI Bank</option>
      </select>
      <button onClick={handleVerify} className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700">Select Bank</button>
    </div>
  );
};

const EMIScreen: React.FC<{ onSelect: (emi: string) => void }> = ({ onSelect }) => {
  const [emi, setEmi] = useState("");
  const handleVerify = () => {if (emi) {onSelect(emi); alert("EMI Selected Successfully");} else {alert("Please select an EMI option.");}};
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Select EMI Option</h3>
      <select value={emi} onChange={(e) => setEmi(e.target.value)} className="w-full border border-gray-300 rounded-md p-3 mb-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
        <option value="" className="text-gray-600 dark:text-gray-300">-- Select EMI --</option>
        <option value="3 months" className="text-gray-800 dark:text-white">3 months</option>
        <option value="6 months" className="text-gray-800 dark:text-white">6 months</option>
        <option value="12 months" className="text-gray-800 dark:text-white">12 months</option>
      </select>
      <button onClick={handleVerify} className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700">Select EMI</button>
    </div>
  );
};

export default PaymentGateway;