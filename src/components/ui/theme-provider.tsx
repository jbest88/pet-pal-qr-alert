
"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Define the theme context type
type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  themes: string[];
}

// Create and initialize the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => null,
  themes: ["light", "dark", "system"]
});

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<string>(defaultTheme);
  
  // Handle theme changes
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    
    // Store the theme in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newTheme);
    }
    
    // Apply the theme to the document
    if (newTheme === "dark" || 
        (newTheme === "system" && 
         window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Initialize theme from localStorage or default
  useEffect(() => {
    // Get the theme from localStorage or use the default
    const storedTheme = typeof window !== "undefined" 
      ? localStorage.getItem(storageKey) 
      : null;
    
    const initialTheme = storedTheme || defaultTheme;
    
    // Apply the initial theme
    handleThemeChange(initialTheme);
  }, [defaultTheme, storageKey]);

  const value = {
    theme,
    setTheme: handleThemeChange,
    themes: ["light", "dark", "system"]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
