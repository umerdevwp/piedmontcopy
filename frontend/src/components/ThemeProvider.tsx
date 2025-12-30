
import React, { createContext, useContext, useEffect } from 'react';

type ThemeContextType = {
    refreshTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const applyTheme = (settings: any[]) => {
        const root = document.documentElement;

        const primary = settings.find(s => s.key === 'theme_primary')?.value || '180 100% 25%';
        const accent = settings.find(s => s.key === 'theme_accent')?.value || '25 100% 50%';
        const background = settings.find(s => s.key === 'theme_background')?.value || '210 40% 98%';

        root.style.setProperty('--primary', primary);
        root.style.setProperty('--accent', accent);
        root.style.setProperty('--background', background);
    };

    const fetchTheme = async () => {
        try {
            const response = await fetch('/api/settings');
            const settings = await response.json();
            applyTheme(settings);
        } catch (error) {
            console.error('Failed to fetch theme settings:', error);
        }
    };

    useEffect(() => {
        fetchTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ refreshTheme: fetchTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
