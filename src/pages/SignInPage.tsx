import React from "react";
import { SignIn, ClerkProvider, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const darkMode = true; // Simulated toggle for dark mode

  // Redirect to account page if already signed in
  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/account");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Sign In</h2>
        <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Please sign in using one of the following methods:
        </p>
        <div className="mt-6">
          {/* Clerk's SignIn Component */}
          <SignIn
            path="/signin"
            routing="path"
            redirectUrl="/account"
            appearance={{
              variables: {
                colorPrimary: darkMode ? "#1a202c" : "#3182ce",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Wrap your app in the ClerkProvider
const SignInWrapper: React.FC = () => {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <SignInPage />
    </ClerkProvider>
  );
};

export default SignInWrapper;
