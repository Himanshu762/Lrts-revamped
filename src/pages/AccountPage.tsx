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
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
        {/* User Details Section */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <img
            src={user.profileImageUrl || "https://via.placeholder.com/150"}
            alt={`${user.firstName || "User"}'s Avatar`}
            className="h-16 w-16 rounded-full border dark:border-gray-700"
          />
          <div>
            <h1 className="text-2xl font-bold">
              {user.firstName || "User"} {user.lastName || ""}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.emailAddress}</p>
          </div>
        </div>

        {/* Account Information */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Account Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</p>
              <p className="text-lg">{user.firstName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</p>
              <p className="text-lg">{user.lastName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
              <p className="text-lg">{user.emailAddress || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
              <p className="text-lg">{user.phoneNumber || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <UserButton afterSignOutUrl="/signin" />
          <button
            onClick={() => signOut().then(() => navigate("/signin"))}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;