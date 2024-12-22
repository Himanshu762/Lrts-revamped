import React, { useEffect, useState } from "react";
import { SignUp, useAuth, ClerkLoaded } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext"; // Assuming you have this context

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { darkMode } = useDarkMode(); // Access dark mode state
  const [loading, setLoading] = useState(true);

  // Redirect to account page if signed in
  useEffect(() => {
    if (!isLoaded) {
      setLoading(true);
      return;
    }
    setLoading(false); // Set loading to false once Clerk is loaded
    if (isSignedIn) {
      navigate("/account");
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
        <div className="text-xl text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2
          className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          Sign Up
        </h2>
        <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Create a new account.
        </p>
        <div className="mt-6">
          <SignUp
            path="/signup"
            routing="path"
            redirectUrl="/account"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;