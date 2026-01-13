import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Controller, useForm } from "react-hook-form";
import { Alert, Box, FormHelperText, Typography } from "@mui/material";
import { useAuthStore } from "@/stores/auth.store";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";

const RESEND_INTERVAL = 60; // seconds

const VerifyOTPForm = () => {
  const { verifyOtp, resendOtp } = useAuthStore();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const prev = searchParams.get("prev") || "";
  const router = useRouter();

  const [timer, setTimer] = useState(RESEND_INTERVAL);
  const [resending, setResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, formState, handleSubmit, setError, reset } = useForm({
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  const { isValid, dirtyFields, errors } = formState;

  /* ---------------- Countdown logic ---------------- */
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ---------------- Verify OTP ---------------- */
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const token = await verifyOtp({ email, otp: data.otp });
      if (prev.split("/").pop() === "sign-up") {
        router.push(`/sign-in`);
      } else {
        router.push(`/reset-password?token=${token}`);
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error?.response?.data?.message || "Invalid OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Resend OTP ---------------- */
  const handleResendOtp = async () => {
    try {
      setResending(true);
      await resendOtp({ email });

      setTimer(RESEND_INTERVAL);
      reset({ otp: "" });
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error?.response?.data?.message || "Failed to resend OTP",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Error */}
      {errors?.root?.message && (
        <Alert severity="error" className="mb-6">
          {errors.root.message}
        </Alert>
      )}

      {/* OTP Input */}
      <Controller
        name="otp"
        control={control}
        rules={{ validate: (value) => value.length === 4 }}
        render={({ field, fieldState }) => (
          <Box>
            <MuiOtpInput {...field} length={4} sx={{ gap: 1 }} />
            {fieldState.invalid && (
              <FormHelperText error>OTP must be 4 digits</FormHelperText>
            )}
          </Box>
        )}
      />

      {/* Resend OTP */}
      <Box mt={2} textAlign="center">
        {timer > 0 ? (
          <Typography variant="body2" color="text.secondary">
            Resend code in <b>{timer}s</b>
          </Typography>
        ) : (
          <Button
            variant="text"
            onClick={handleResendOtp}
            disabled={resending}
            className="bg-transparent"
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </Button>
        )}
      </Box>

      {/* Verify Button */}
      <Button
        variant="contained"
        color="secondary"
        className="mt-4 w-full"
        disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
        type="submit"
        size="large"
      >
        {isLoading ? "Loading..." : "Verify"}
      </Button>
    </form>
  );
};

export default VerifyOTPForm;
