import React, { createContext, useContext } from 'react';

// Create the Theme Context
export const ThemeContext = createContext();

// Create a custom hook for easy consumption of the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Throw an error if useTheme is called outside of a ThemeProvider
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
