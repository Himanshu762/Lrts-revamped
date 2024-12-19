import React, { useState, useEffect } from "react";
import { SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const SignInPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true); // Dark mode state
  const [isSignUp, setIsSignUp] = useState<boolean>(false); // State to toggle between SignIn and SignUp screens
  const { isSignedIn } = useAuth(); // Clerk hook for authentication
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
        <h2 className={`text-2xl font-bold ${textColor}`}>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <p className={`mt-4 ${descriptionColor}`}>
          {isSignUp
            ? "Create an account to get started with our service."
            : "Please sign in to continue."}
        </p>
        <div className="mt-6">
          {/* Conditionally render SignIn or SignUp based on isSignUp state */}
          {isSignUp ? (
            <SignUp
              path="/signup"
              routing="path"
              redirectUrl="/account"
              appearance={{
                variables: {
                  colorPrimary: darkMode ? "#1a202c" : "#3182ce", // Primary color change for dark/light mode
                },
              }}
            />
          ) : (
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
          )}
        </div>

        {/* Switch between Sign In and Sign Up */}
        <div className="mt-4 text-center">
          <button
            className="text-sm text-blue-500 hover:text-blue-700"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;