'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';

type SettingsContextType = {
    quality: string;
    setQuality: (q: string) => void;
    format: string;
    setFormat: (f: string) => void;
    darkMode: boolean;
    setDarkMode: (d: boolean) => void;
    language: Language;
    setLanguage: (l: Language) => void;
    t: any; // Translation function
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [quality, setQuality] = useState('high');
    const [format, setFormat] = useState('jpg');
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState<Language>('ko');

    // Load from localStorage on mount
    useEffect(() => {
        const savedQuality = localStorage.getItem('mf_quality');
        const savedFormat = localStorage.getItem('mf_format');
        const savedDarkMode = localStorage.getItem('mf_darkMode');
        const savedLanguage = localStorage.getItem('mf_language') as Language;

        if (savedQuality) setQuality(savedQuality);
        if (savedFormat) setFormat(savedFormat);
        if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
        if (savedLanguage) setLanguage(savedLanguage);
    }, []);

    // Save to localStorage when changed
    useEffect(() => {
        localStorage.setItem('mf_quality', quality);
        localStorage.setItem('mf_format', format);
        localStorage.setItem('mf_darkMode', String(darkMode));
        localStorage.setItem('mf_language', language);

        // Apply dark mode class to html element
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [quality, format, darkMode, language]);

    const t = translations[language];

    return (
        <SettingsContext.Provider value={{
            quality, setQuality,
            format, setFormat,
            darkMode, setDarkMode,
            language, setLanguage,
            t
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
