import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return 'dark'; // Always default to premium grand midnight cyber theme
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    document.body.classList.add('bg-[#080C18]', 'text-slate-100');
    localStorage.setItem('mailguard_theme', 'dark');
  }, [theme]);

  const toggleTheme = () => {
    // Retain dark cyber theme as primary grand style
    setThemeState('dark');
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
