import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { UserProfile } from "@clerk/clerk-react";

const AccountPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

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
    <div
      className={`min-h-screen flex justify-center items-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-3xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg rounded-lg p-4 sm:p-6 overflow-hidden`}
      >
        <h1
          className={`text-xl sm:text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          } mb-4 text-center`}
        >
          Manage Your Account
        </h1>
        {/* Clerk's UserProfile Component */}
        <div className="flex justify-center">
          <UserProfile
            appearance={{
              variables: {
                colorPrimary: "#6366f1",
                colorText: isDarkMode ? "#d1d5db" : "#374151",
                colorBackground: isDarkMode ? "#1f2937" : "#f9fafb",
                colorTextSecondary: isDarkMode ? "#9ca3af" : "#6b7280",
                colorBackgroundDark: "#1f2937",
                colorTextDark: "#d1d5db",
              },
              layout: {
                width: "100%",
                minHeight: "auto",
              },
              elements: {
                card: "shadow-md rounded-lg w-full max-w-xl mx-auto",
                buttonPrimary: `${
                  isDarkMode
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-indigo-500 hover:bg-indigo-600 text-white"
                } font-medium rounded-lg px-4 py-2`,
                buttonSecondary: `${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                } font-medium rounded-lg px-4 py-2`,
                tabsListButton: `${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-black"
                } font-medium px-3 py-2 transition-colors`,
                tabsListButtonActive: `${
                  isDarkMode
                    ? "text-white border-b-2 border-indigo-600"
                    : "text-black border-b-2 border-indigo-500"
                } font-medium px-3 py-2`,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;