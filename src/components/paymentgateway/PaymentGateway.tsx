import React, { useState } from "react";
import clsx from "clsx";
import { useDarkMode } from "../../context/DarkModeContext"; // Import DarkModeContext

const PaymentGateway = () => {
  const [activeScreen, setActiveScreen] = useState("UPI");
  const { darkMode, toggleDarkMode } = useDarkMode(); // Use global dark mode context

  const renderScreen = () => {
    switch (activeScreen) {
      case "UPI":
        return <UPIScreen />;
      case "Cards":
        return <CardsScreen />;
      case "Wallets":
        return <WalletsScreen />;
      default:
        return <UPIScreen />;
    }
  };

  return (
    <div
      className={clsx(
        "flex w-full h-screen justify-center items-center",
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      )}
    >
      <div
        className={clsx(
          "flex w-[900px] shadow-lg rounded-md overflow-hidden transition-colors duration-300",
          darkMode ? "bg-gray-800" : "bg-white"
        )}
      >
        {/* Sidebar */}
        <div
          className={clsx(
            "w-1/3 p-6 relative transition-colors duration-300",
            darkMode ? "bg-gray-700" : "bg-green-200"
          )}
        >
          <div className="text-center">
            <img src="/fresh-to-home-logo.png" alt="Logo" className="mx-auto mb-4" />
            <h2 className="text-lg font-bold">LRTS.com</h2>
            <p className={clsx("text-sm", darkMode ? "text-gray-400" : "text-gray-600")}>
              JoyeshPay Trusted Business
            </p>
          </div>
          <div className="mt-8">
            <h3 className="text-md font-semibold">Price Summary</h3>
            <p className="text-2xl font-bold mt-2">₹152</p>
          </div>
          <div className="mt-6">
            <p className="text-sm">Using as +91 86605 83883</p>
            <p
              className={clsx(
                "text-sm mt-2 cursor-pointer",
                darkMode ? "text-blue-400" : "text-green-700"
              )}
            >
              Offers on UPI and Cards
            </p>
          </div>
          <div className="absolute bottom-6 left-6">
            <p className={clsx("text-xs", darkMode ? "text-gray-500" : "text-gray-500")}>
              Secured by JoyeshPay
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Payment Options</h2>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={clsx(
                "py-2 px-4 rounded-md font-medium",
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              )}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          <div className="flex">
            <div className="w-1/3">
              <MenuOption
                label="UPI"
                active={activeScreen === "UPI"}
                onClick={() => setActiveScreen("UPI")}
                isDarkMode={darkMode}
              />
              <MenuOption
                label="Cards"
                active={activeScreen === "Cards"}
                onClick={() => setActiveScreen("Cards")}
                isDarkMode={darkMode}
              />
              <MenuOption
                label="Wallets"
                active={activeScreen === "Wallets"}
                onClick={() => setActiveScreen("Wallets")}
                isDarkMode={darkMode}
              />
            </div>
            <div className="w-2/3">{renderScreen()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuOption = ({ label, active, onClick, isDarkMode }: any) => (
  <div
    onClick={onClick}
    className={clsx(
      "py-2 px-4 cursor-pointer rounded-md transition-colors duration-300",
      active
        ? isDarkMode
          ? "bg-blue-700 text-white"
          : "bg-green-100 font-bold"
        : isDarkMode
        ? "hover:bg-gray-600 text-gray-300"
        : "hover:bg-green-50 text-gray-700"
    )}
  >
    {label}
  </div>
);

const UPIScreen = () => {
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");

  const validateUPI = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/;
    if (!upiId || !regex.test(upiId)) {
      setError("Please enter a valid UPI ID (example@bank)");
    } else {
      setError("");
      alert("UPI ID Verified Successfully");
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-4">Enter your UPI ID</h3>
      <input
        type="text"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        placeholder="example@okhdfcbank"
        className={clsx(
          "w-full border p-2 rounded-md",
          error ? "border-red-500" : "border-gray-300"
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <button
        onClick={validateUPI}
        className={clsx(
          "mt-4 w-full py-2 rounded-md transition-colors",
          "bg-black text-white hover:bg-gray-800"
        )}
      >
        Verify and Pay
      </button>
    </div>
  );
};

const CardsScreen = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const validateCard = () => {
    const cardRegex = /^[0-9]{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^[0-9]{3}$/;

    if (!cardRegex.test(cardNumber)) {
      setError("Invalid card number (16 digits required)");
    } else if (!expiryRegex.test(expiry)) {
      setError("Invalid expiry date (MM/YY format)");
    } else if (!cvvRegex.test(cvv)) {
      setError("Invalid CVV (3 digits required)");
    } else {
      setError("");
      alert("Card Verified Successfully");
    }
  };

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
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <button
        onClick={validateCard}
        className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
      >
        Continue
      </button>
    </div>
  );
};

const WalletsScreen = () => (
  <div>
    <h3 className="font-semibold mb-4">All Wallet Options</h3>
    <ul className="space-y-2">
      {[
        "Amazon Pay",
        "PhonePe",
        "Mobikwik",
        "Airtel Payments Bank",
        "Ola Money (Postpaid + Wallet)",
        "JioMoney",
        "Freecharge",
        "Payzapp",
      ].map((wallet, index) => (
        <li
          key={index}
          className="cursor-pointer border p-2 rounded-md hover:bg-gray-50"
        >
          {wallet}
        </li>
      ))}
    </ul>
  </div>
);

export default PaymentGateway;