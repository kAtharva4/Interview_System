import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button 
      onClick={toggleDarkMode}
      className="p-2 rounded-full focus:outline-none"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <span className="text-yellow-400">☀️</span>
      ) : (
        <span className="text-gray-600">🌙</span>
      )}
    </button>
  );
}