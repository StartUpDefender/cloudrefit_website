"use client";

import { useTranslation } from "@/context/LanguageContext";
import Link from "next/link";
import { Button, Input, Alert } from "@/components/ui";
import { useState, useEffect } from "react";
import { FiLock, FiArrowLeft, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { resetPassword } from "@/lib/services/auth";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const t = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get email from URL params if available
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Call POST /api/auth/resetPassword with password (uses Bearer token)
      const response = await resetPassword({ password });

      // Check if response is successful (status 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Success response - extract message from response.data
        const message = 
          (response.data && typeof response.data === "object" && "message" in response.data
            ? (response.data as { message: string }).message
            : null) ||
          extractSuccessMessage(response) ||
          "Password reset successfully";
        
        setSuccessMessage(message);
        setError(null);
        setCountdown(5); // Start 5 second countdown before redirecting to login
      } else {
        // Error response
        const errorMessage = extractErrorMessage(response) || "Password reset failed. Please try again.";
        setError(errorMessage);
        setSuccessMessage(null);
        setCountdown(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setSuccessMessage(null);
      setCountdown(null);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer and auto-redirect to login
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Redirect to login after countdown
      router.push("/login");
    }
  }, [countdown, router]);

  if (successMessage && countdown !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--brand-soft)]/20 via-slate-50 to-slate-100 flex items-center justify-center px-4 py-12 font-sans">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)] text-2xl font-bold text-white shadow-lg mb-4">
              <FiCheckCircle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              {t.auth.resetPassword?.successTitle || "Password Reset!"}
            </h1>
          </div>

          {/* Success Message Card */}
          <div className="rounded-2xl border border-[var(--brand)]/20 bg-white/90 p-6 shadow-lg backdrop-blur">
            <Alert
              variant="success"
              message={successMessage}
              className="mb-4"
            />
            
            <div className="text-center mb-6">
              <p className="text-sm text-slate-600 mb-4">
                {t.auth.resetPassword?.redirecting || "Redirecting to login page in"} {countdown} {t.auth.resetPassword?.seconds || "seconds"}...
              </p>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-[var(--brand)] to-[var(--brand-strong)] h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/login">
                <Button fullWidth>
                  {t.auth.login.loginButton}
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" fullWidth>
                  {t.common.backToHome}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {t.auth.resetPassword?.title || "Reset Password"}
          </h1>
          <p className="text-sm text-slate-600">
            {t.auth.resetPassword?.subtitle || "Enter your new password"}
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--brand-strong)] hover:text-[var(--brand)] transition"
          >
            <FiArrowLeft className="text-sm" />
            {t.common.backToHome}
          </Link>
        </div>

        {/* Reset Password Form */}
        <div className="rounded-2xl border border-[var(--brand)]/20 bg-white/90 p-6 shadow-lg backdrop-blur">
          {error && (
            <Alert
              variant="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-4"
            />
          )}
          {successMessage && !error && (
            <Alert
              variant="success"
              message={successMessage}
              className="mb-4"
            />
          )}
          {!error && !successMessage && !loading && (
            <Alert
              variant="info"
              message={t.auth.resetPassword?.infoMessage || "Please enter your new password"}
              className="mb-4"
            />
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                {t.auth.resetPassword?.password || "New Password"}
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
                  placeholder={t.auth.resetPassword?.passwordPlaceholder || "Enter new password"}
                  className="pr-20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                {t.auth.resetPassword?.confirmPassword || "Confirm Password"}
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
                  placeholder={t.auth.resetPassword?.passwordPlaceholder || "Confirm new password"}
                  className="pr-20"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? t.common.loading : t.auth.resetPassword?.resetButton || "Reset Password"}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-strong)] hover:text-[var(--brand)] transition"
            >
              <FiArrowLeft className="text-sm" />
              {t.auth.login.loginButton}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

