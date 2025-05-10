
"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// Create our own Theme Context to avoid the direct dependency on next-themes internals
type ThemeContextType = {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  themes: string[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => null,
  themes: ["light", "dark", "system"]
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<string | undefined>(props.defaultTheme);

  // Handle theme changes from next-themes
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // Store the theme in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(props.storageKey || "theme", newTheme);
    }
    // Apply the theme to the document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Initialize theme from localStorage or default
  useEffect(() => {
    // Get the theme from localStorage or use the default
    const storedTheme = typeof window !== "undefined" 
      ? localStorage.getItem(props.storageKey || "theme") 
      : null;
    
    const initialTheme = storedTheme || props.defaultTheme || "light";
    setTheme(initialTheme);
    
    // Apply the initial theme
    if (initialTheme === "dark" || 
        (initialTheme === "system" && 
         window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    }
    
    setMounted(true);
  }, [props.defaultTheme, props.storageKey]);

  const contextValue = {
    theme,
    setTheme: handleThemeChange,
    themes: ["light", "dark", "system"]
  };

  return (
    <ThemeContext.Provider value={contextValue}>
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
