
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export const useTheme = () => {
  try {
    // Import the context directly from next-themes
    const { useTheme } = require("next-themes")
    return useTheme()
  } catch (error) {
    // Fallback implementation if direct import fails
    return {
      theme: "light" as string | undefined,
      setTheme: (theme: string) => console.warn("Theme context not available"),
      themes: ["light", "dark", "system"]
    }
  }
}
