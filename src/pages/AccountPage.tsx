import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { UserProfile } from "@clerk/clerk-react";

const AccountPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect to sign-in page if the user is not signed in
  useEffect(() => {
    if (!isSignedIn) {
      navigate("/signin");
    }
  }, [isSignedIn, navigate]);

  if (!isSignedIn) {
    return null; // Prevent rendering if not authenticated
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Manage Your Account
        </h1>
        {/* Clerk's UserProfile Component */}
        <div className="overflow-hidden">
          <UserProfile
            appearance={{
              variables: {
                colorPrimary: "#6366f1", // Primary color
                colorText: "#374151", // Text color
                colorBackground: "#f9fafb", // Background color
                colorTextSecondary: "#9ca3af", // Secondary text
                colorBackgroundDark: "#1f2937", // Dark mode background
                colorTextDark: "#d1d5db", // Text color for dark mode
              },
              layout: {
                width: "auto",
                minHeight: "auto",
              },
              elements: {
                card: "shadow-md rounded-lg w-full max-w-md mx-auto", // Restrict size and center
                buttonPrimary:
                  "bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2",
                buttonSecondary:
                  "bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg px-4 py-2",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
