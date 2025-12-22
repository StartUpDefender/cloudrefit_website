"use client";

import { useTranslation } from "@/context/LanguageContext";
import Link from "next/link";
import { Button, Input, Alert } from "@/components/ui";
import { useState, useEffect, useRef } from "react";
import { FiArrowLeft, FiCheckCircle, FiMail } from "react-icons/fi";
import { verifyOtp } from "@/lib/services/auth";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const t = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get email from URL params if available
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Auto-focus first OTP input on mount
  useEffect(() => {
    otpInputRefs.current[0]?.focus();
  }, []);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    const numValue = value.replaceAll(/\D/g, "");
    if (numValue.length > 1) {
      // If pasting multiple digits, distribute them
      const digits = numValue.slice(0, 4).split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 4) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      // Focus on the last filled input or the next empty one
      const nextIndex = Math.min(index + digits.length, 3);
      if (otpInputRefs.current[nextIndex]) {
        otpInputRefs.current[nextIndex]?.focus();
      }
    } else {
      const newOtp = [...otp];
      newOtp[index] = numValue;
      setOtp(newOtp);
      
      // Auto-focus next input if value entered
      if (numValue && index < 3) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace to go to previous field
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replaceAll(/\D/g, "").slice(0, 4);
    const newOtp = [...otp];
    pastedData.split("").forEach((digit, i) => {
      if (i < 4) {
        newOtp[i] = digit;
      }
    });
    setOtp(newOtp);
    // Focus on the last filled input
    const lastIndex = Math.min(pastedData.length - 1, 3);
    if (otpInputRefs.current[lastIndex]) {
      otpInputRefs.current[lastIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const otpValue = otp.join("").trim();

    if (otpValue.length !== 4) {
      setError("Please enter the complete 4-digit OTP");
      setLoading(false);
      return;
    }

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      // Call POST /api/auth/verify-otp with otp and email
      const response = await verifyOtp({ otp: otpValue, email });
      const errorMessage = extractErrorMessage(response);
      const successMsg = extractSuccessMessage(response);

      if (errorMessage || response.status >= 400) {
        setError(errorMessage || "OTP verification failed. Please try again.");
        setSuccessMessage(null);
        setCountdown(null);
      } else {
        // Extract success message from response
        const message = successMsg || "OTP verified successfully";
        setSuccessMessage(message);
        setError(null);
        setCountdown(3); // Start 3 second countdown before redirecting to reset password
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setSuccessMessage(null);
      setCountdown(null);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer and auto-redirect to reset password
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Redirect to reset password page
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    }
  }, [countdown, router, email]);

  if (successMessage && countdown !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--brand-soft)]/20 via-slate-50 to-slate-100 flex items-center justify-center px-4 py-12 font-sans">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] via-[var(--brand-strong)] to-[var(--brand)] text-2xl font-bold text-white shadow-lg mb-4">
              <FiCheckCircle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              {t.auth.otp?.successTitle || "OTP Verified!"}
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
                {t.auth.otp?.redirecting || "Redirecting to reset password page in"} {countdown} {t.auth.otp?.seconds || "seconds"}...
              </p>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-[var(--brand)] to-[var(--brand-strong)] h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                />
              </div>
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
            {t.auth.otp?.title || "Verify OTP"}
          </h1>
          <p className="text-sm text-slate-600">
            {t.auth.otp?.subtitle || `Enter the OTP sent to ${email}`}
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--brand-strong)] hover:text-[var(--brand)] transition"
          >
            <FiArrowLeft className="text-sm" />
            {t.common.backToHome}
          </Link>
        </div>

        {/* OTP Form */}
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
              message={t.auth.otp?.infoMessage || `Please enter the OTP code sent to ${email}`}
              className="mb-4"
            />
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Display (read-only) */}
            <div className="relative">
              <FiMail className="absolute right-3 top-[38px] h-5 w-5 text-slate-400" />
              <Input
                type="email"
                id="email"
                name="email"
                label={t.auth.otp?.email || "Email"}
                value={email}
                readOnly
                className="pr-10 bg-slate-50"
              />
            </div>

            {/* OTP Fields - 4 separate inputs */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                {t.auth.otp?.otpLabel || "OTP Code"}
              </label>
              <div className="flex items-center justify-center gap-3" dir="ltr">
                <input
                  ref={(el) => {
                    otpInputRefs.current[0] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[0]}
                  onChange={(e) => handleOtpChange(0, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(0, e)}
                  onPaste={handleOtpPaste}
                  dir="ltr"
                  className="w-14 h-14 text-center text-2xl font-semibold rounded-xl border-2 border-slate-300 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 outline-none transition-all"
                  placeholder="0"
                />
                <input
                  ref={(el) => {
                    otpInputRefs.current[1] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[1]}
                  onChange={(e) => handleOtpChange(1, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(1, e)}
                  onPaste={handleOtpPaste}
                  dir="ltr"
                  className="w-14 h-14 text-center text-2xl font-semibold rounded-xl border-2 border-slate-300 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 outline-none transition-all"
                  placeholder="0"
                />
                <input
                  ref={(el) => {
                    otpInputRefs.current[2] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[2]}
                  onChange={(e) => handleOtpChange(2, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(2, e)}
                  onPaste={handleOtpPaste}
                  dir="ltr"
                  className="w-14 h-14 text-center text-2xl font-semibold rounded-xl border-2 border-slate-300 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 outline-none transition-all"
                  placeholder="0"
                />
                <input
                  ref={(el) => {
                    otpInputRefs.current[3] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[3]}
                  onChange={(e) => handleOtpChange(3, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(3, e)}
                  onPaste={handleOtpPaste}
                  dir="ltr"
                  className="w-14 h-14 text-center text-2xl font-semibold rounded-xl border-2 border-slate-300 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 outline-none transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? t.common.loading : t.auth.otp?.verifyButton || "Verify OTP"}
            </Button>
          </form>

          {/* Back to Forgot Password Link */}
          <div className="mt-6 text-center">
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-strong)] hover:text-[var(--brand)] transition"
            >
              <FiArrowLeft className="text-sm" />
              {t.auth.forgotPassword?.backToLogin || "Back to Forgot Password"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

