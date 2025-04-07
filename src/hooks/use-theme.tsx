
import * as React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeProviderState {
  setTheme: () => void;
}

const initialState: ThemeProviderState = {
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // Set up light theme by default
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
  }, []);

  const value = React.useMemo(
    () => ({
      setTheme: () => {
        // No-op function since we're removing theming
      },
    }),
    []
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};
