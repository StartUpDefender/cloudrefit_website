"use client";

import { useTranslation } from "@/context/LanguageContext";
import Link from "next/link";
import { Button, Input, Alert } from "@/components/ui";
import { useState, useEffect } from "react";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { verifyUser } from "@/lib/services/auth";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyPage() {
  const t = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [email, setEmail] = useState("");

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
    setLoading(true);

    // Use email from state (which is synced with the input)
    const emailValue = email.trim();

    if (!emailValue) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      // Call POST /api/user/verify with email
      const response = await verifyUser({ email: emailValue });
      // Treat non-2xx as error
      if (response.status >= 400) {
        const errorMessage =
          extractErrorMessage(response) ||
          "Verification failed. Please try again.";
        setError(errorMessage);
        setSuccessMessage(null);
        setCountdown(null);
      } else {
        // Successful verification – extract success message and start countdown
        const message =
          extractSuccessMessage(response) || t.auth.verify.successMessage;
        setSuccessMessage(message);
        setError(null);
        setCountdown(5); // Start 5‑second countdown, then redirect to login
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setSuccessMessage(null);
      setCountdown(null);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer and auto-redirect
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
              {t.auth.verify.successTitle}
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
                {t.auth.verify.redirecting || "Redirecting to login page in"} {countdown} {t.auth.verify.seconds || "seconds"}...
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
            {t.auth.verify.title}
          </h1>
          <p className="text-sm text-slate-600">
            {t.auth.verify.subtitle}
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--brand-strong)] hover:text-[var(--brand)] transition"
          >
            <FiArrowLeft className="text-sm" />
            {t.common.backToHome}
          </Link>
        </div>

        {/* Verify Form */}
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
              message={t.auth.verify.infoMessage || "Enter your email address to verify your account"}
              className="mb-4"
            />
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="relative">
              <FiMail className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
              <Input
                type="email"
                id="email"
                name="email"
                label={t.auth.verify.email}
                required
                placeholder={t.auth.verify.emailPlaceholder}
                className="pr-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? t.common.loading : t.auth.verify.verifyButton}
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

