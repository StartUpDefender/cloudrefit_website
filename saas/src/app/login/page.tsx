"use client";

import { useTranslation, useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { Button, Input, Checkbox, Alert } from "@/components/ui";
import { FiMail, FiLock, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { login, type LoginRequest } from "@/lib/services/auth";
import { extractErrorMessage } from "@/lib/utils";

export default function LoginPage() {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[var(--brand-soft)]/20 via-slate-50 to-slate-100 flex items-center justify-center px-4 py-12 font-sans"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)] text-2xl font-bold text-white shadow-lg mb-4 transition hover:scale-105 cursor-pointer">
              LF
            </div>
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            {t.auth.login.title}
          </h1>
          <p className="text-sm text-slate-600">{t.auth.login.subtitle}</p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--brand-strong)] hover:text-[var(--brand)] transition"
          >
            <FiArrowLeft className="text-sm" />
            {t.common.backToHome}
          </Link>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl border border-[var(--brand)]/20 bg-white/90 p-6 shadow-lg backdrop-blur">
          {error && (
            <Alert
              variant="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-4"
            />
          )}
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              
              const formData = new FormData(e.currentTarget);
              const loginData: LoginRequest = {
                email: formData.get("email") as string,
                password: formData.get("password") as string,
                remember: formData.get("remember") === "on",
              };

              try {
                const response = await login(loginData);
                const errorMessage = extractErrorMessage(response);
                
                if (errorMessage || response.status >= 400) {
                  // Check if error is about account verification
                  const lowerErrorMessage = errorMessage?.toLowerCase() || "";
                  if (
                    lowerErrorMessage.includes("verify") ||
                    lowerErrorMessage.includes("verification") ||
                    lowerErrorMessage.includes("please verify your account")
                  ) {
                    // Redirect to verify page with email
                    globalThis.window.location.href = `/verify?email=${encodeURIComponent(loginData.email)}`;
                    return;
                  }
                  setError(errorMessage || t.common.error);
                } else {
                  // Redirect to dashboard on success
                  globalThis.window.location.href = "/dashboard";
                }
              } catch (err) {
                setError(err instanceof Error ? err.message : t.common.error);
              } finally {
                setLoading(false);
              }
            }} 
            className="space-y-5"
          >
            {/* Email Field */}
            <div className="relative">
              <FiMail className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
              <Input
                type="email"
                id="email"
                name="email"
                label={t.auth.login.email}
                required
                placeholder={t.auth.login.emailPlaceholder}
                className="pr-10"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  {t.auth.login.password}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[var(--brand-strong)] hover:text-[var(--brand)] transition"
                >
                  {t.auth.login.forgot}
                </Link>
              </div>
              <div className="relative">
                <FiLock className={`absolute ${isRTL ? "left-12" : "right-12"} top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition z-10`}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  placeholder={t.auth.login.passwordPlaceholder}
                  className={isRTL ? "pl-20" : "pr-20"}
                />
              </div>
            </div>

            {/* Remember Me */}
            <Checkbox
              id="remember"
              name="remember"
              label={t.auth.login.remember}
            />

            {/* Login Button */}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? t.auth.login.loggingIn : t.auth.login.loginButton}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-3 text-xs text-slate-500">{t.common.or}</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

    
          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {t.auth.login.noAccount}{" "}
              <Link
                href="/register"
                className="font-semibold text-[var(--brand-strong)] hover:text-[var(--brand)] transition"
              >
                {t.auth.login.register}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

