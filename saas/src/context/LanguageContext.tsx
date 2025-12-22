
"use client";

import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import enTranslations from "@/locales/en.json";
import arTranslations from "@/locales/ar.json";

type Language = "en" | "ar";

type Translations = typeof enTranslations;

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

const translations: Record<Language, Translations> = {
  en: enTranslations,
  ar: arTranslations,
};

export function LanguageProvider({ children }: { readonly children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    if (typeof globalThis.window === "undefined") return;

    const stored = globalThis.window.localStorage.getItem("app-language") as Language | null;
    if (stored === "en" || stored === "ar") {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof globalThis.window === "undefined") return;

    globalThis.window.localStorage.setItem("app-language", language);
    const dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "ar" : "en"));
  };

  const contextValue = useMemo(
    () => ({
      language,
      toggleLanguage,
      setLanguage,
      t: translations[language],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

export function useTranslation() {
  const { t } = useLanguage();
  return t;
}


