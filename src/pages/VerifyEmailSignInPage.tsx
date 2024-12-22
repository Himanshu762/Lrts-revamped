import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { useDarkMode } from "../context/DarkModeContext"; // Assuming you have this context

const VerifyEmailSignInPage: React.FC = () => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Verify Your Email
        </h2>
        <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Enter the verification code sent to your email to complete signing in.
        </p>
        <div className="mt-6">
          <SignIn
            path="/signin/verify-email-address"
            routing="path"
            redirectUrl="/account"
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailSignInPage;