import React, { useEffect } from "react";
import { SignIn, useAuth, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext"; // Assuming you have this context

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { darkMode } = useDarkMode(); // Access dark mode state
  const { clerk } = useClerk(); // Access Clerk directly to check initialization

  // Redirect to the account page if signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate("/account");
    }
  }, [isSignedIn, navigate]);

  // Ensure Clerk is loaded before rendering
  if (!clerk) {
    return <div>Loading Clerk...</div>; // Wait for Clerk to load
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Sign In
        </h2>
        <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Please sign in using one of the following methods:
        </p>
        <div className="mt-6">
          <SignIn
            path="/signin"
            routing="path"
            redirectUrl="/account" // Avoid automatic redirect
            afterSignInUrl="/account" // Stay on the current page
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;