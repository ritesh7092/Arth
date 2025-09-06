import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../src/theme/ThemeProvider';

const ThemeToggle = ({ 
  size = 'default', 
  variant = 'default',
  className = '',
  showLabel = false 
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const sizeClasses = {
    small: 'w-8 h-8 p-1.5',
    default: 'w-10 h-10 p-2',
    large: 'w-12 h-12 p-3'
  };

  const variantClasses = {
    default: isDarkMode 
      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600' 
      : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border border-gray-200',
    minimal: isDarkMode 
      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100',
    ghost: isDarkMode 
      ? 'text-gray-400 hover:text-white hover:bg-gray-800/50' 
      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    default: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        rounded-lg transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
        ${className}
      `}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="flex items-center justify-center">
        {isDarkMode ? (
          <Sun className={`${iconSizes[size]} transition-transform duration-200`} />
        ) : (
          <Moon className={`${iconSizes[size]} transition-transform duration-200`} />
        )}
        {showLabel && (
          <span className="ml-2 text-sm font-medium">
            {isDarkMode ? 'Light' : 'Dark'}
          </span>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
