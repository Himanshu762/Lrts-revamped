import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import clsx from 'clsx';
import { useDarkMode } from '../../context/DarkModeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();

  const [authDropdownOpen, setAuthDropdownOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    signOut();
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://img.freepik.com/premium-vector/modern-l-letter-logo-vector_724449-55.jpg"
            className="h-8"
            alt="LRTS Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            LRTS दिल्ली
          </span>
          <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">DEMO</span>
        </Link>
        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className={`w-full md:block md:w-auto ${isOpen ? 'block' : 'hidden'}`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/zones" isActive={isActive('/zones')}>Zones</NavLink>
            </li>
            <li>
              <NavLink to="/planner" isActive={isActive('/planner')}>Trip Planner</NavLink>
            </li>
            <li>
              <NavLink to="/passes" isActive={isActive('/passes')}>Passes</NavLink>
            </li>
            {isSignedIn ? (
              <>
                <li>
                  <NavLink to="/account" isActive={isActive('/account')}>Account</NavLink>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="relative">
                <button
                  onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-primary-500 text-white hover:bg-primary-600"
                >
                  Login / Sign Up
                </button>
                {authDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50">
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/signin"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setAuthDropdownOpen(false)}
                        >
                          Sign In
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/signup"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setAuthDropdownOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            )}
            <li>
              <button
                onClick={toggleDarkMode}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 flex items-center"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, isActive }: { to: string; children: React.ReactNode; isActive: boolean }) => (
  <Link
    to={to}
    className={clsx(
      'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
      isActive
        ? 'bg-primary-700 dark:bg-primary-900 text-white'
        : 'text-primary-black hover:text-white hover:bg-primary-500 dark:hover:bg-primary-700'
    )}
  >
    {children}
  </Link>
);

export default Navbar;