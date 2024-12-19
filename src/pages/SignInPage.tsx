import React from "react";
import { SignInButton, ClerkProvider, useAuth } from "@clerk/clerk-react";
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
          Please sign in using one of the following providers:
        </p>
        <div className="space-y-4 mt-6">
          {/* Google Sign-In */}
          <SignInButton
            redirectUrl="/account"
            provider="google"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Sign in with Google
          </SignInButton>

          {/* Microsoft Sign-In */}
          <SignInButton
            redirectUrl="/account"
            provider="microsoft"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
          >
            Sign in with Microsoft
          </SignInButton>
        </div>
      </div>
    </div>
  );
};

// Wrap your app in the ClerkProvider
const App: React.FC = () => {
  return (
    <ClerkProvider frontendApi={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <SignInPage />
    </ClerkProvider>
  );
};

export default SignInPage;
