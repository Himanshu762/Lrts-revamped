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
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Account Details
        </h1>
        {/* Clerk's UserProfile Component */}
        <UserProfile
          appearance={{
            variables: {
              colorPrimary: "#6366f1", // Custom primary color
              colorText: "#374151", // Custom text color
              colorBackground: "#f9fafb", // Background color
              colorTextSecondary: "#9ca3af", // Secondary text color
              colorBackgroundDark: "#1f2937", // Dark mode background color
              colorTextDark: "#d1d5db", // Text color for dark mode
            },
            elements: {
              card: "shadow-lg rounded-lg", // Styling for the card
              buttonPrimary:
                "bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2",
              buttonSecondary:
                "bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg px-4 py-2",
            },
          }}
        />
      </div>
    </div>
  );
};

export default AccountPage;