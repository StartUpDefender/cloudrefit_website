"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function HomeNavbar() {
  const { language, toggleLanguage } = useLanguage();
  const isArabic = language === "ar";

  const navItems = {
    features: isArabic ? "المزايا" : "Features",
    solutions: isArabic ? "الحلول" : "Solutions",
    integrations: isArabic ? "التكاملات" : "Integrations",
  };

  const loginText = isArabic ? "تسجيل الدخول" : "Login";
  const registerText = isArabic ? "إنشاء حساب للمكتب" : "Register Office";

  return (
    <header className="border-b border-[color:var(--brand-soft)] bg-white/90 backdrop-blur shadow-sm">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:h-16 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)] text-xs font-semibold text-white shadow-sm">
            LF
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-slate-900">
              {isArabic ? "مكتب المحاماة الذكي" : "Smart Law Firm"}
            </p>
            <p className="text-[11px] text-slate-500">
              {isArabic ? "نظام إدارة المكاتب القانونية" : "Law Firm Management System"}
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-6 text-[12px] text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-[color:var(--brand-strong)]">
            {navItems.features}
          </a>
          <a href="#solutions" className="transition hover:text-[color:var(--brand-strong)]">
            {navItems.solutions}
          </a>
          <a href="#integrations" className="transition hover:text-[color:var(--brand-strong)]">
            {navItems.integrations}
          </a>
        </div>

        <div className="flex items-center gap-2 text-[12px]">
          <button
            onClick={toggleLanguage}
            className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 md:inline-flex"
          >
            {isArabic ? "EN" : "AR"}
          </button>
          <a
            href="/login"
            className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 md:inline-flex"
          >
            {loginText}
          </a>
          <a
            href="/register"
            className="inline-flex rounded-full bg-gradient-to-r from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)] px-3.5 py-1.5 font-semibold text-white shadow-sm transition hover:from-[var(--brand-strong)] hover:via-[var(--brand)] hover:to-[var(--brand-strong)]"
          >
            {registerText}
          </a>
        </div>
      </nav>
    </header>
  );
}


