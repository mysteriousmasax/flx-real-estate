import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="btn-theme-toggle"
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg border transition-all duration-200 flex items-center justify-center ${
        theme === 'dark'
          ? 'bg-black/60 border-white/10 text-amber-400 hover:bg-zinc-900 hover:text-amber-300 shadow-inner'
          : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100 hover:text-black shadow-sm'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};
