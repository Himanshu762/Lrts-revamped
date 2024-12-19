import React, { useEffect, useState } from "react";
import { SignIn, ClerkProvider, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

// SignInPage Component
const SignInPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true); // Dark mode state
  const { isSignedIn, user } = useAuth(); // Clerk hook for authentication
  const navigate = useNavigate();

  // Redirect user if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate("/account");
    }
  }, [isSignedIn, navigate]);

  // Adjust theme based on darkMode state
  const themeClass = darkMode ? "bg-gray-900" : "bg-gray-100";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const descriptionColor = darkMode ? "text-gray-300" : "text-gray-700";

  return (
    <div className={`min-h-screen flex items-center justify-center ${themeClass}`}>
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className={`text-2xl font-bold ${textColor}`}>Sign In</h2>
        <p className={`mt-4 ${descriptionColor}`}>
          Please sign in using one of the following methods:
        </p>
        <div className="mt-6">
          {/* Clerk SignIn Component */}
          <SignIn
            path="/signin"
            routing="path"
            redirectUrl="/account"
            appearance={{
              variables: {
                colorPrimary: darkMode ? "#1a202c" : "#3182ce", // Primary color change for dark/light mode
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

// SignInWrapper Component (Wrapper for ClerkProvider)
const SignInWrapper: React.FC = () => {
  // Make sure to replace with your actual Clerk Publishable Key
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPublishableKey) {
    return <div>Error: Clerk Publishable Key is missing!</div>;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <SignInPage />
    </ClerkProvider>
  );
};

export default SignInWrapper;