"use client";

import { useTranslation } from "@/context/LanguageContext";
import Link from "next/link";
import { Button, Input, Checkbox, Alert } from "@/components/ui";
import { FiBriefcase, FiUser, FiMail, FiPhone, FiLock, FiArrowLeft, FiGlobe, FiImage, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { register, type RegisterRequest } from "@/lib/services/auth";
import {
  validateRegisterForm,
  extractPasswordError,
  type RegisterFormErrors,
} from "@/lib/validation";
import { extractErrorMessage } from "@/lib/utils";

export default function RegisterPage() {
  const t = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    
    // Prepare form data
    const formDataObj = {
      companyName: formData.get("companyName") as string,
      companyType: formData.get("companyType") as string,
      country: formData.get("country") as string,
      logo: (formData.get("logo") as string) || undefined,
      userName: formData.get("userName") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    // Validate form
    const validation = validateRegisterForm(formDataObj);
    
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Prepare request data matching Postman format
    const registerData: RegisterRequest = {
      companyName: formDataObj.companyName,
      companyType: formDataObj.companyType,
      country: formDataObj.country,
      logo: formDataObj.logo,
      userName: formDataObj.userName,
      phone: formDataObj.phone,
      email: formDataObj.email,
      password: formDataObj.password,
    };

    try {
      const response = await register(registerData);
      const errorMessage = extractErrorMessage(response);
      
      if (errorMessage || response.status >= 400) {
        // Check if error is related to password validation
        const passwordErrorMsg = extractPasswordError(errorMessage);
        if (passwordErrorMsg) {
          setFieldErrors({ password: passwordErrorMsg });
          setError(null);
        } else {
          setError(errorMessage || t.auth.register.error);
          setFieldErrors({});
        }
      } else {
        setSuccess(true);
        setFieldErrors({});
        setError(null);
        // Optionally redirect to login or dashboard
        setTimeout(() => {
          globalThis.window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.auth.register.unexpectedError;
      setError(errorMessage);
      setFieldErrors({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brand-soft)]/20 via-slate-50 to-slate-100 flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)] text-2xl font-bold text-white shadow-lg mb-4 transition hover:scale-105 cursor-pointer">
              LF
            </div>
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            {t.auth.register.title}
          </h1>
          <p className="text-sm text-slate-600">{t.auth.register.subtitle}</p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--brand-strong)] hover:text-[var(--brand)] transition"
          >
            <FiArrowLeft className="text-sm" />
            {t.common.backToHome}
          </Link>
        </div>

        {/* Register Form */}
        <div className="rounded-2xl border border-[var(--brand)]/20 bg-white/90 p-6 shadow-lg backdrop-blur">
          {error && (
            <Alert
              variant="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-4"
            />
          )}
          {success && (
            <Alert
              variant="success"
              message={t.auth.register.success}
              className="mb-4"
            />
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name Field */}
            <div className="relative">
              <FiBriefcase className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
              <Input
                type="text"
                id="companyName"
                name="companyName"
                label={t.auth.register.companyName}
                required
                placeholder={t.auth.register.companyNamePlaceholder}
                className="pr-10"
                error={fieldErrors.companyName}
                onChange={() => {
                  if (fieldErrors.companyName) {
                    setFieldErrors((prev) => ({ ...prev, companyName: undefined }));
                  }
                }}
              />
            </div>

            {/* Company Type Field */}
            <div className="relative">
              <FiBriefcase className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
              <Input
                type="text"
                id="companyType"
                name="companyType"
                label={t.auth.register.companyType}
                required
                placeholder={t.auth.register.companyTypePlaceholder}
                className="pr-10"
                error={fieldErrors.companyType}
                onChange={() => {
                  if (fieldErrors.companyType) {
                    setFieldErrors((prev) => ({ ...prev, companyType: undefined }));
                  }
                }}
              />
            </div>

            {/* Country Field */}
            <div className="relative">
              <FiGlobe className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
              <Input
                type="text"
                id="country"
                name="country"
                label={t.auth.register.country}
                required
                placeholder={t.auth.register.countryPlaceholder}
                className="pr-10"
                error={fieldErrors.country}
                onChange={() => {
                  if (fieldErrors.country) {
                    setFieldErrors((prev) => ({ ...prev, country: undefined }));
                  }
                }}
              />
            </div>

            {/* Logo URL Field (Optional) */}
            <div className="relative">
              <FiImage className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
              <Input
                type="url"
                id="logo"
                name="logo"
                label={t.auth.register.logo}
                placeholder={t.auth.register.logoPlaceholder}
                className="pr-10"
                error={fieldErrors.logo}
                onChange={() => {
                  if (fieldErrors.logo) {
                    setFieldErrors((prev) => ({ ...prev, logo: undefined }));
                  }
                }}
              />
            </div>

            {/* User Name Field */}
            <div className="relative">
              <FiUser className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
              <Input
                type="text"
                id="userName"
                name="userName"
                label={t.auth.register.userName}
                required
                placeholder={t.auth.register.userNamePlaceholder}
                className="pr-10"
                error={fieldErrors.userName}
                onChange={() => {
                  if (fieldErrors.userName) {
                    setFieldErrors((prev) => ({ ...prev, userName: undefined }));
                  }
                }}
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <FiMail className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
              <Input
                type="email"
                id="email"
                name="email"
                label={t.auth.register.email}
                required
                placeholder={t.auth.register.emailPlaceholder}
                className="pr-10"
                error={fieldErrors.email}
                onChange={() => {
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
              />
            </div>

            {/* Phone Field */}
            <div className="relative">
              <FiPhone className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
              <Input
                type="tel"
                id="phone"
                name="phone"
                label={t.auth.register.phone}
                required
                placeholder={t.auth.register.phonePlaceholder}
                className="pr-10"
                error={fieldErrors.phone}
                onChange={() => {
                  if (fieldErrors.phone) {
                    setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                  }
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                {t.auth.register.password}
              </label>
              <div className="relative">
                <FiLock className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition z-10"
                  tabIndex={-1}
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
                  placeholder={t.auth.register.passwordPlaceholder}
                  className="pr-20"
                  error={fieldErrors.password}
                  onChange={() => {
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                {t.auth.register.confirmPassword}
              </label>
              <div className="relative">
                <FiLock className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition z-10"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  placeholder={t.auth.register.passwordPlaceholder}
                  className="pr-20"
                  error={fieldErrors.confirmPassword}
                  onChange={() => {
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <Checkbox
              id="agree"
              name="agree"
              label={t.auth.register.agree}
              required
            />

            {/* Register Button */}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? t.auth.register.registering : t.auth.register.registerButton}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-3 text-xs text-slate-500">{t.common.or}</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

    

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {t.auth.register.haveAccount}{" "}
              <Link
                href="/login"
                className="font-semibold text-[var(--brand-strong)] hover:text-[var(--brand)] transition"
              >
                {t.auth.register.login}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

