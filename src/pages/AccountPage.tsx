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
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div
        className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-4 sm:p-6 flex flex-col items-center"
        style={{
          minHeight: "80vh", // Ensures enough space for the embedding
        }}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">
          Manage Your Account
        </h1>
        {/* Clerk's UserProfile Component */}
        <div
          className="w-full flex-grow flex justify-center items-center"
          style={{
            maxHeight: "100%", // Ensures embedding doesn't overflow
            overflowY: "auto", // Allows scrolling if content is larger
          }}
        >
          <UserProfile
            appearance={{
              variables: {
                colorPrimary: "#6366f1",
                colorText: "#374151",
                colorBackground: "#f9fafb",
                colorTextSecondary: "#6b7280",
              },
              layout: {
                width: "100%",
                minHeight: "auto",
              },
              elements: {
                card: "shadow-md rounded-lg w-full max-w-3xl mx-auto",
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