"use client";

import { useLanguage, useTranslation } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { FiSun, FiMoon, FiGlobe, FiPlus, FiGrid, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";
import { logout } from "@/lib/services/auth";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isRTL = language === "ar";
  const router = useRouter();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      // Clear auth token
      api.clearAuthToken();
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear token and redirect
      api.clearAuthToken();
      router.push("/login");
    } finally {
      setLoggingOut(false);
      setMobileMenuOpen(false);
    }
  };

  const menuItems = [
 
    {
      label: t.navbar.tasks,
      hasDropdown: false,
      id: "tasks",
    },
    {
      label: t.navbar.files,
      hasDropdown: false,
      id: "files",
    },
   
    {
      label: t.navbar.cases,
      hasDropdown: false,
      id: "cases",
    },
    {
      label: t.navbar.contacts,
      hasDropdown: true,
      id: "contacts",
      dropdownItems: [
        t.navbar.contactsDropdown.people,
        
        t.navbar.contactsDropdown.lawyers,
      ],
    },
  ];

  return (
    <>
      <header 
        className="flex h-14 items-center justify-between bg-slate-900 px-3 md:px-6 border-b border-[var(--brand-strong)]/30 relative z-50"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Logo and Mobile Menu Button */}
        <div className={`flex items-center gap-2 md:gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--brand)]/30 bg-slate-800/50 text-slate-300 hover:bg-[var(--brand)]/20 hover:text-[var(--brand)] hover:border-[var(--brand)] transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FiX className="h-5 w-5" />
            ) : (
              <FiMenu className="h-5 w-5" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)] text-[10px] md:text-xs font-bold text-white shadow-sm">
              LF
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs md:text-sm font-bold text-white">{t.navbar.logo.name}</span>
              <span className="text-[9px] md:text-[10px] text-slate-400">{t.navbar.logo.subtitle}</span>
            </div>
          </div>
        </div>

        {/* Desktop Menu Container */}
        <div className="hidden lg:flex flex-1 items-center gap-4">
          {/* Desktop Menu Items */}
          <nav className={`flex items-center gap-1  flex-row-reverse `}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="relative"
              role="menuitem" 
              tabIndex={0}
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.id)}
              onMouseLeave={() => setActiveDropdown(null)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setActiveDropdown(null);
                }
              }}
            >
              {item.id === "cases" && !item.hasDropdown ? (
                <Link
                  href="/dashboard/cases"
                  className={`flex items-center gap-1 px-3 py-2 text-sm text-white hover:text-[var(--brand)] transition ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span>{item.label}</span>
                </Link>
              ) : (
                <button 
                  className={`flex items-center gap-1 px-3 py-2 text-sm text-white hover:text-[var(--brand)] transition ${isRTL ? "flex-row-reverse" : ""} ${activeDropdown === item.id ? "text-[var(--brand)]" : ""}`}
                  onClick={() => {
                    if (item.id === "cases" && !item.hasDropdown) {
                      router.push("/dashboard/cases");
                    } else if (item.hasDropdown) {
                      setActiveDropdown(activeDropdown === item.id ? null : item.id);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (item.id === "cases" && !item.hasDropdown) {
                        router.push("/dashboard/cases");
                      } else if (item.hasDropdown) {
                        setActiveDropdown(activeDropdown === item.id ? null : item.id);
                      }
                    }
                  }}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (() => {
                    const isOpen = activeDropdown === item.id;
                    let rotationClass = "";
                    if (isOpen) {
                      rotationClass = isRTL ? "rotate-0" : "rotate-180";
                    } else {
                      rotationClass = isRTL ? "rotate-180" : "rotate-0";
                    }
                    return (
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${rotationClass}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    );
                  })()}
                </button>
              )}

              {/* Dropdown Menu */}
              {item.hasDropdown && activeDropdown === item.id && (
                <div 
                  className={`absolute top-full mt-1 w-48 rounded-md border border-[var(--brand)]/30 bg-slate-800/95 backdrop-blur py-2 shadow-lg z-50 ${isRTL ? "right-0" : "left-0"}`}
                  role="menu"
                  tabIndex={-1}
                  onMouseEnter={() => setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setActiveDropdown(null);
                    }
                  }}
                >
                  {item.dropdownItems ? (
                    item.dropdownItems.map((dropdownItem, index) => {
                      let href = "#";
                      if (item.id === "contacts") {
                        if (dropdownItem === t.navbar.contactsDropdown.people) href = "/dashboard/people";
                        else if (dropdownItem === t.navbar.contactsDropdown.lawyers) href = "/dashboard/lawyers";
                      }
                      return (
                        <Link
                          key={dropdownItem}
                          href={href}
                          className={`block w-full px-4 py-2 text-sm text-slate-200 hover:bg-[var(--brand)]/20 hover:text-[var(--brand)] transition ${isRTL ? "text-right" : "text-left"}`}
                          role="menuitem"
                        >
                          {dropdownItem}
                        </Link>
                      );
                    })
                  ) : (
                    <div className={`px-4 py-2 text-sm text-slate-400 ${isRTL ? "text-right" : "text-left"}`}>
                      {t.navbar.comingSoon}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          </nav>
          
     
        </div>

      {/* Right side - Theme toggle, language toggle, grid icon */}
      <div className={`flex items-center gap-2 md:gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg border border-[var(--brand)]/30 bg-slate-800/50 text-slate-300 hover:bg-[var(--brand)]/20 hover:text-[var(--brand)] hover:border-[var(--brand)] transition"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <FiSun className="h-4 w-4" />
          ) : (
            <FiMoon className="h-4 w-4" />
          )}
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg border border-[var(--brand)]/30 bg-slate-800/50 text-slate-300 hover:bg-[var(--brand)]/20 hover:text-[var(--brand)] hover:border-[var(--brand)] transition"
          aria-label="Toggle language"
        >
          <FiGlobe className="h-4 w-4" />
        </button>

     =

        {/* Logout Button - Desktop */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 bg-slate-800/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500 transition ${isRTL ? "flex-row-reverse" : ""} ${loggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={t.navbar.logout}
        >
          <FiLogOut className="h-4 w-4" />
          <span className="text-sm font-medium">{t.navbar.logout}</span>
        </button>
      </div>
    </header>

    {/* Mobile Menu */}
    {mobileMenuOpen && (
      <>
        {/* Backdrop */}
        <button
          className="fixed inset-0 top-14 bg-slate-900/95 backdrop-blur z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setMobileMenuOpen(false);
            }
          }}
          aria-label="Close mobile menu"
        />
        {/* Menu Content */}
        <div 
          className={`fixed inset-0 top-14 z-40 overflow-y-auto md:hidden ${isRTL ? "text-right" : "text-left"}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="px-4 py-4 space-y-2">
          {/* Add Button - Mobile */}
          <button 
            className={`w-full flex items-center justify-center gap-2 rounded-lg
               bg-gradient-to-r from-[var(--brand)] via-[var(--brand-strong)]
                to-[var(--brand)] hover:from-[var(--brand-strong)]
                 hover:via-[var(--brand)] hover:to-[var(--brand-strong)]
                  px-4 py-3 text-sm font-medium text-white shadow-sm transition 
                  ${isRTL ? "flex-row-reverse" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FiPlus className="h-5 w-5" />
            <span>{t.navbar.add}</span>
          </button>

          {/* Mobile Menu Items */}
          {menuItems.map((item) => (
            <div key={item.id} className="border-b border-slate-800/50 last:border-0">
              {item.id === "cases" && !item.hasDropdown ? (
                <Link
                  href="/dashboard/cases"
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm text-white hover:text-[var(--brand)] transition ${isRTL ? "flex-row-reverse" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                </Link>
              ) : (
                <button
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm text-white
                     hover:text-[var(--brand)] transition ${isRTL ? "flex-row-reverse" : ""}
                      ${activeDropdown === item.id ? "text-[var(--brand)]" : ""}`}
                  onClick={() => {
                    if (item.id === "cases" && !item.hasDropdown) {
                      router.push("/dashboard/cases");
                      setMobileMenuOpen(false);
                    } else if (item.hasDropdown) {
                      setActiveDropdown(activeDropdown === item.id ? null : item.id);
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (() => {
                    const isOpen = activeDropdown === item.id;
                    let rotationClass = "";
                    if (isOpen) {
                      rotationClass = isRTL ? "rotate-0" : "rotate-180";
                    } else {
                      rotationClass = isRTL ? "rotate-180" : "rotate-0";
                    }
                    return (
                      <svg
                        className={`h-5 w-5 transition-transform duration-200 ${rotationClass}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    );
                  })()}
                </button>
              )}

              {/* Mobile Dropdown Items */}
              {item.hasDropdown && activeDropdown === item.id && (
                <div className="bg-slate-800/50 py-2">
                  {item.dropdownItems ? (
                    item.dropdownItems.map((dropdownItem) => {
                      let href = "#";
                      if (item.id === "contacts") {
                        if (dropdownItem === t.navbar.contactsDropdown.people) href = "/dashboard/people";
                        else if (dropdownItem === t.navbar.contactsDropdown.lawyers) href = "/dashboard/lawyers";
                      }
                      return (
                        <Link
                          key={dropdownItem}
                          href={href}
                          className={`block w-full px-6 py-2.5 text-sm text-slate-200 hover:bg-[var(--brand)]/20 hover:text-[var(--brand)] transition ${isRTL ? "text-right" : "text-left"}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {dropdownItem}
                        </Link>
                      );
                    })
                  ) : (
                    <div className={`px-6 py-2.5 text-sm text-slate-400 ${isRTL ? "text-right" : "text-left"}`}>
                      {t.navbar.comingSoon}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Logout Button - Mobile */}
          <div className="border-t border-slate-800/50 pt-2 mt-2">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg border border-red-500/30 transition ${isRTL ? "flex-row-reverse" : ""} ${loggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <FiLogOut className="h-5 w-5" />
              <span>{t.navbar.logout}</span>
            </button>
          </div>
          </div>
        </div>
      </>
    )}
    </>
  );
}
