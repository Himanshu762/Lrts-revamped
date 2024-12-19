import React from "react";
import { SignUp, ClerkProvider, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext"; // Assuming you have this context

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { darkMode } = useDarkMode(); // Access dark mode state

  // Redirect to account page if already signed in
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
          Sign Up
        </h2>
        <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Create a new account.
        </p>
        <div className="mt-6">
          {/* Clerk's SignUp Component with dynamic appearance based on dark mode */}
          <SignUp
            path="/signup"
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

// Wrap your app in the ClerkProvider
const SignUpWrapper: React.FC = () => {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <SignUpPage />
    </ClerkProvider>
  );
};

export default SignUpWrapper;