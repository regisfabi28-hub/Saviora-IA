import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

export interface ColorPalette {
  name: string;
  primaryBg: string;
  cardBg: string;
  cardBgMuted: string;
  cardBorder: string;
  borderMuted: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  goldAccent: string;
  goldHover: string;
  goldMutedBg: string;
  statusVerified: string;
  surfaceHeader: string;
  surfaceFooter: string;
}

export const PALETTES: Record<Theme, ColorPalette> = {
  dark: {
    name: 'Bleu Nuit (Sombre)',
    primaryBg: '#081226',
    cardBg: '#0B1B3A',
    cardBgMuted: '#12305F',
    cardBorder: '#12305F',
    borderMuted: 'rgba(18, 48, 95, 0.6)',
    textPrimary: '#F8F5EC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    goldAccent: '#D4AF37',
    goldHover: '#E4BE42',
    goldMutedBg: 'rgba(212, 175, 55, 0.15)',
    statusVerified: '#10B981',
    surfaceHeader: 'rgba(11, 27, 58, 0.95)',
    surfaceFooter: '#0B1B3A',
  },
  light: {
    name: 'Ivoire & Or (Clair)',
    primaryBg: '#F8F5EC',
    cardBg: '#FFFFFF',
    cardBgMuted: '#EFECE3',
    cardBorder: '#E2D9C8',
    borderMuted: 'rgba(226, 217, 200, 0.7)',
    textPrimary: '#0B1B3A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    goldAccent: '#D4AF37',
    goldHover: '#B59226',
    goldMutedBg: 'rgba(212, 175, 55, 0.18)',
    statusVerified: '#059669',
    surfaceHeader: 'rgba(255, 255, 255, 0.95)',
    surfaceFooter: '#FFFFFF',
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  palette: ColorPalette;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'saviora_ia_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (e) {
      // Fallback
    }
    return 'dark'; // Default to Saviora IA iconic midnight blue theme
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // Ignore
    }

    const root = document.documentElement;
    const currentPalette = PALETTES[theme];

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Set dynamic CSS properties for easy reference across standard styles
    root.style.setProperty('--saviora-bg-primary', currentPalette.primaryBg);
    root.style.setProperty('--saviora-bg-card', currentPalette.cardBg);
    root.style.setProperty('--saviora-border', currentPalette.cardBorder);
    root.style.setProperty('--saviora-text-primary', currentPalette.textPrimary);
    root.style.setProperty('--saviora-text-secondary', currentPalette.textSecondary);
    root.style.setProperty('--saviora-gold', currentPalette.goldAccent);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const isDark = theme === 'dark';
  const palette = PALETTES[theme];

  return (
    <ThemeContext.Provider value={{ theme, isDark, palette, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
