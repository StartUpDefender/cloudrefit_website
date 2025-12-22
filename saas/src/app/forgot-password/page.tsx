"use client";

import { useTranslation } from "@/context/LanguageContext";
import Link from "next/link";
import { Button, Input, Alert } from "@/components/ui";
import { useState } from "react";
import { FiMail, FiArrowLeft, FiCheckCircle, FiLock, FiKey } from "react-icons/fi";
import { forgotPassword, verifyOtp, resetPassword } from "@/lib/services/auth";
import { useRouter } from "next/navigation";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";

type Step = "email" | "otp" | "reset" | "success";

export default function ForgotPasswordPage() {
  const t = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get("email") as string;
    setEmail(emailValue);

    try {
      const response = await forgotPassword({ email: emailValue });
      
      // Check if response is successful (status 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Success response - extract message from response.data
        const message = 
          (response.data && typeof response.data === "object" && "message" in response.data
            ? (response.data as { message: string }).message
            : null) ||
          extractSuccessMessage(response) ||
          "OTP sent successfully";
        
        setSuccessMessage(message);
        setError(null);
        
        // Redirect to OTP page after showing success message (2 seconds)
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(emailValue)}`);
        }, 2000);
      } else {
        // Error response
        const errorMessage = extractErrorMessage(response) || t.common.error;
        setError(errorMessage);
        setSuccessMessage(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;

    try {
      const response = await verifyOtp({ otp, email });
      const errorMessage = extractErrorMessage(response);
      
      if (errorMessage || response.status >= 400) {
        setError(errorMessage || t.common.error);
      } else {
        setStep("reset");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    try {
      const response = await resetPassword({ password });
      const errorMessage = extractErrorMessage(response);
      
      if (errorMessage || response.status >= 400) {
        setError(errorMessage || t.common.error);
      } else {
        setStep("success");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--brand-soft)]/20 via-slate-50 to-slate-100 flex items-center justify-center px-4 py-12 font-sans">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)] text-2xl font-bold text-white shadow-lg mb-4 transition hover:scale-105 cursor-pointer">
                <FiCheckCircle className="h-8 w-8" />
              </div>
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              {t.auth.forgotPassword.successTitle}
            </h1>
            <p className="text-sm text-slate-600 mb-6">
              {t.auth.forgotPassword.successMessage}
            </p>
            <div className="space-y-3">
              <Link href="/login">
                <Button variant="ghost" fullWidth>
                  {t.auth.forgotPassword.backToLogin}
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
            {(() => {
              if (step === "email") return t.auth.forgotPassword.title;
              if (step === "otp") return "Verify OTP";
              return "Reset Password";
            })()}
          </h1>
          <p className="text-sm text-slate-600">
            {(() => {
              if (step === "email") return t.auth.forgotPassword.subtitle;
              if (step === "otp") return `Enter the OTP sent to ${email}`;
              return "Enter your new password";
            })()}
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--brand-strong)] hover:text-[var(--brand)] transition"
          >
            <FiArrowLeft className="text-sm" />
            {t.common.backToHome}
          </Link>
        </div>

        {/* Form */}
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

          {/* Email Step */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="relative">
                <FiMail className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  label={t.auth.forgotPassword.email}
                  required
                  placeholder={t.auth.forgotPassword.emailPlaceholder}
                  className="pr-10"
                />
              </div>
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? t.common.loading : t.auth.forgotPassword.sendLink}
              </Button>
            </form>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="relative">
                <FiKey className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  id="otp"
                  name="otp"
                  label="OTP Code"
                  required
                  placeholder="Enter OTP"
                  className="pr-10"
                  maxLength={6}
                />
              </div>
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? t.common.loading : "Verify OTP"}
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => setStep("email")}
              >
                Change Email
              </Button>
            </form>
          )}

          {/* Reset Password Step */}
          {step === "reset" && (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div className="relative">
                <FiLock className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  id="password"
                  name="password"
                  label="New Password"
                  required
                  placeholder="Enter new password"
                  className="pr-10"
                />
              </div>
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? t.common.loading : "Reset Password"}
              </Button>
            </form>
          )}

          {/* Back to Login Link */}
          {step === "email" && (
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-strong)] hover:text-[var(--brand)] transition"
              >
                <FiArrowLeft className="text-sm" />
                {t.auth.forgotPassword.backToLogin}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

