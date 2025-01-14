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
import qrcode from "../misc/QR.png";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const cardIcons: { [key: string]: string } = {Visa: visa, MasterCard: mastercard, "American Express": amex, Discover: discover, JCB: jcb, "Diners Club": diners, UnionPay: unionpay, Maestro: maestro, Unknown: generic,};
const cvvIcon = cvvicon;
const QRCode = qrcode;

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

  const generateUPIQR = () => {
    const merchantId = Math.random().toString(36).substring(2, 15);
    const transactionId = uuidv4();
    const timestamp = Date.now();
    const randomSalt = Math.random().toString(36).substring(7);
    
    const baseAmount = parseFloat(passDetails.price);
    const amount = baseAmount.toFixed(2);
    
    const upiString = `upi://pay?pa=lrts${merchantId}@ybl&pn=LRTS_METRO&mc=4121&tid=${transactionId}&tr=${timestamp}${randomSalt}&tn=LRTS%20Pass%20Payment&am=${amount}&cu=INR&mode=04`;
    return upiString;
  };

  useEffect(() => {
    setQrValue(generateUPIQR());
    const interval = setInterval(() => {
      setQrValue(generateUPIQR());
    }, 300000);

    return () => clearInterval(interval);
  }, [passDetails.price]);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl relative overflow-hidden max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl z-10">&times;</button>
        
        <div className="flex flex-col lg:flex-row h-full overflow-hidden">
          <div className="lg:w-1/3 p-6 bg-gradient-to-b from-blue-900 to-blue-950 text-white">
            <Sidebar passDetails={passDetails} />
          </div>

          <div className="lg:w-2/3 flex flex-col overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-md mx-auto">
                {renderPaymentMode()}
              </div>
            </div>

            <div className="p-6 border-t dark:border-gray-700">
              <button
                onClick={handlePayment}
                disabled={!selectedPaymentMode || isPaymentProcessing}
                className={clsx(
                  "w-full py-3 px-4 rounded-lg text-white font-semibold transition-all",
                  selectedPaymentMode && !isPaymentProcessing
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                )}
              >
                {isPaymentProcessing ? "Processing..." : "Pay ₹" + passDetails.price}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
};
const Sidebar: React.FC<{ passDetails: PaymentGatewayProps["passDetails"] }> = ({ passDetails }) => (
  <div className="w-1/4 bg-blue-100 dark:bg-blue-900 p-6 flex flex-col justify-between">
    <div className="text-center">
      <img src="https://img.freepik.com/premium-vector/modern-l-letter-logo-vector_724449-55.jpg" alt="Logo" className="mx-auto mb-4" />
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">LRTS.com</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">LRTSPay Trusted Business</p>
    </div>
    <div>
      <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">{passDetails.title}</p>
      <h3 className="text-md font-semibold text-gray-800 dark:text-white">Price Summary</h3>
      <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">₹{passDetails.price}</p>
    </div>
    <p className="text-xs text-gray-600 dark:text-gray-300">Secured by LRTSPay</p>
  </div>
);
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
const UPIScreen: React.FC<{ onSelect: (upiId: string) => void }> = ({ onSelect }) => {
  const [upiId, setUpiId] = useState("");
  const handleVerify = () => {
    if (!upiId) {alert("Please enter a UPI ID.");return;}
    const isValidUPI = validUPISuffixes.some((suffix) => upiId.endsWith(suffix));
    if (!isValidUPI) {alert("Invalid UPI ID. Please use a valid UPI ID.");return;}
    onSelect(upiId);
    alert("UPI ID Verified Successfully!");
  };
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Enter your UPI ID</h3>
      <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="example@bank" className="w-full border border-gray-300 rounded-md p-3 mb-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"/>
      <button onClick={handleVerify} className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700">Verify and Select</button>
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