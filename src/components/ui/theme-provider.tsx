
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export const useTheme = () => {
  // Add proper type assertion for the context values
  const context = React.useContext((NextThemesProvider as any)._context) || { 
    theme: undefined, 
    setTheme: (theme: string) => {} 
  };
  
  return { 
    theme: context.theme as string | undefined, 
    setTheme: context.setTheme as (theme: string) => void 
  };
};
