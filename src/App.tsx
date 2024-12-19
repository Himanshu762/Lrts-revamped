import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { ClerkProvider, RedirectToSignIn, SignedIn } from '@clerk/clerk-react';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import Benefits from './components/features/Benefits';
import PassCard from './components/passes/PassCard';
import ExploreZones from './pages/ExploreZones';
import TripPlanner from './pages/TripPlanner';
import PassesPage from './pages/PassesPage';
import Footer from './components/layout/Footer';
import SignInPage from './pages/SignInPage';
import AccountPage from './pages/AccountPage';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

// Create a DarkModeContext
const DarkModeContext = createContext();

// DarkModeProvider component
const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook to use the dark mode context
export const useDarkMode = () => useContext(DarkModeContext);

function HomePage() {
  const passes = [
    {
      title: 'Basic',
      price: '999',
      duration: 'month',
      features: [
        { text: 'Unlimited rides in one zone', included: true },
        { text: 'Peak hour access', included: true },
        { text: 'Multi-zone access', included: false },
        { text: 'Priority booking', included: false },
      ],
    },
    {
      title: 'Standard',
      price: '1499',
      duration: 'month',
      features: [
        { text: 'Unlimited rides in Multiple Zones', included: true },
        { text: 'Peak hour access', included: true },
        { text: 'Multi-zone access', included: true },
        { text: 'Priority booking', included: true },
      ],
      popular: true,
    },
  ];

  return (
    <>
      <Hero />
      <Benefits />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Choose Your Pass
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
            Select the perfect pass that suits your travel needs
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {passes.map((pass, index) => (
            <PassCard key={index} {...pass} />
          ))}
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <DarkModeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route
                  path="/account"
                  element={
                    <SignedIn>
                      <AccountPage />
                    </SignedIn>
                  }
                />
                <Route path="/zones" element={<ExploreZones />} />
                <Route path="/planner" element={<TripPlanner />} />
                <Route path="/passes" element={<PassesPage />} />
                <Route path="*" element={<RedirectToSignIn />} />
              </Routes>
            </AnimatePresence>
            <Toaster position="top-right" />
          </div>
          <Footer />
        </Router>
      </DarkModeProvider>
    </ClerkProvider>
  );
}

export default App;
