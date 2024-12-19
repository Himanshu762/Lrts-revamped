import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth, UserButton } from "@clerk/clerk-react";

const AccountPage: React.FC = () => {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const darkMode = true; // Simulated toggle for dark mode

  // Redirect to sign-in page if the user is not signed in
  React.useEffect(() => {
    if (!isSignedIn) {
      navigate("/signin");
    }
  }, [isSignedIn, navigate]);

  if (!isSignedIn || !user) {
    return null; // Prevent rendering if not authenticated or user is null
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="text-center">
        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Welcome, {user.firstName || "User"}!
        </h1>
        <div className="mt-4">
          <UserButton afterSignOutUrl="/signin" />
        </div>
        <button
          onClick={() => signOut().then(() => navigate("/signin"))}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountPage;