import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme } from '../types/music';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-3 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 
                 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-600/50"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}