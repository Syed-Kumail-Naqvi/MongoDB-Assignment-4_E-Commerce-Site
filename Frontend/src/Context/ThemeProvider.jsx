import React, { useState, useEffect } from 'react';
import { ThemeContext } from './themeContextDefinition'; // Import ThemeContext from the new definition file

// Theme Provider Component: Manages theme state and applies/removes 'dark' class
export const ThemeProvider = ({ children }) => {
  // Initialize theme state by trying to load from localStorage.
  // Defaults to 'light' if no preference is saved.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Ensure the saved theme is either 'light' or 'dark' to prevent invalid values
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    // Fallback to system preference if no saved theme, otherwise 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // useEffect to apply/remove the 'dark' class on the <html> element
  // and save the current theme to localStorage whenever 'theme' state changes.
  useEffect(() => {
    const root = window.document.documentElement; // Targets the <html> element
    if (theme === 'dark') {
      root.classList.add('dark'); // Add 'dark' class for Tailwind CSS dark mode
    } else {
      root.classList.remove('dark'); // Remove 'dark' class for light mode
    }
    localStorage.setItem('theme', theme); // Persist user's theme preference
  }, [theme]); // Dependency array: runs when 'theme' state changes

  // Function to toggle between 'light' and 'dark' themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};