import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const DarkModeToggle: React.FC = () => {
  const [isDark, toggleDarkMode] = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full transition-colors duration-200 bg-gray-200 dark:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-400" />}
    </button>
  );
};

export default DarkModeToggle;