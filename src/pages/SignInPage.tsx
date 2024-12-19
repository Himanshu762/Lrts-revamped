import React from "react";
import { SignIn, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext"; // Assuming you have this context

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { darkMode } = useDarkMode(); // Access dark mode state

  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/account");
    }
  }, [isSignedIn, navigate]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Sign In
        </h2>
        <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Please sign in using one of the following methods:
        </p>
        <div className="mt-6">
          <SignIn
            path="/signin"
            routing="path"
            redirectUrl="/account"
            appearance={{
              variables: {
                colorPrimary: darkMode ? "#1a202c" : "#3182ce", // Primary color
                colorBackground: darkMode ? "#2d3748" : "#f7fafc", // Background color
                colorText: darkMode ? "#f7fafc" : "#2d3748", // Text color
                colorButtonText: darkMode ? "#f7fafc" : "#2d3748", // Button text color
                colorButtonBackground: darkMode ? "#3182ce" : "#4a90e2", // Button background
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
