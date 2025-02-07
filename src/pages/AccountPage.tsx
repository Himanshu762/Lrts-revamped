import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserProfile, ClerkLoaded } from "@clerk/clerk-react";

const AccountPage: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth(); // Include isLoaded to check if Clerk has finished loading
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // If Clerk hasn't finished loading, show a loading state
  useEffect(() => {
    if (!isLoaded) {
      setLoading(true);
      return;
    }
    setLoading(false); // Set loading to false once Clerk is loaded
    if (!isSignedIn) {
      navigate("/signin");
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
        <div className="text-xl text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Prevent rendering if not authenticated
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <div
        className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6"
        style={{
          maxWidth: "1000px",
          width: "100%",
          padding: "20px",
        }}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Manage Your Account
        </h1>
        {/* Clerk's UserProfile Component */}
        <div className="overflow-hidden">
          <UserProfile
            appearance={{
              variables: {
                colorPrimary: "#6366f1", // Indigo for primary buttons
                colorText: "#374151", // Neutral text color
                colorBackground: "#f9fafb", // Light background
                colorTextSecondary: "#6b7280", // Secondary text color
              },
              layout: {
                width: "100%", // Full width for UserProfile content
                height: "auto", // Let content adjust height dynamically
              },
              elements: {
                card: "w-full", // Remove size constraints on card
                buttonPrimary:
                  "bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2",
                buttonSecondary:
                  "bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg px-4 py-2",
                tabsListButton:
                  "text-gray-700 hover:text-black font-medium px-3 py-2 transition-colors",
                tabsListButtonActive:
                  "text-black border-b-2 border-indigo-500 font-medium px-3 py-2",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;