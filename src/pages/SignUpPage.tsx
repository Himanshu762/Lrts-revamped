import React, { useEffect } from "react";
import { SignUp, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const darkMode = true; // Assuming dark mode is true

  // Redirect to account page if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate("/account");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white">Sign Up</h2>
        <p className="mt-4 text-gray-300">Create an account to get started with our service.</p>
        <div className="mt-6">
          <SignUp
            path="/signup"
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

export default SignUpPage;
