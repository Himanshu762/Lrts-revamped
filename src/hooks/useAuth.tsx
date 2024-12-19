import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";

const useAuth = () => {
  const { isSignedIn, signOut, signIn, signUp } = useClerkAuth();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return { isLoading: true, user: null, isSignedIn: false };
  }

  return {
    user,
    isSignedIn,
    signIn,
    signUp,
    signOut,
    isLoading: false,
  };
};

export default useAuth;