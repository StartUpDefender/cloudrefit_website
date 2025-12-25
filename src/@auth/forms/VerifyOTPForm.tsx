import React from "react";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Controller, useForm } from "react-hook-form";
import { Alert, Box, FormHelperText } from "@mui/material";
import { useAuthStore } from "@/stores/auth.store";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";

const VerifyOTPForm = () => {
  const { isLoading, verifyOtp } = useAuthStore();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const prev = searchParams.get("prev") || "";
  const router = useRouter();
  const { control, formState, handleSubmit, setError } = useForm({
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });
  const { isValid, dirtyFields, errors } = formState;
  const onSubmit = async (data) => {
    try {
      await verifyOtp({ email, otp: data.otp });
      if (prev.split("/").pop() == "sign-up") router.push(`/sign-in`);
      else router.push(`/reset-password`);
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error?.response?.data?.message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors?.root?.message && (
        <Alert
          className="mb-8"
          severity="error"
          sx={(theme) => ({
            backgroundColor: "bg-red",
            color: theme.palette.error.dark,
          })}
        >
          {errors?.root?.message}
        </Alert>
      )}
      <Controller
        name="otp"
        control={control}
        rules={{ validate: (value) => value.length === 4 }}
        render={({ field, fieldState }) => (
          <Box>
            <MuiOtpInput sx={{ gap: 1 }} {...field} length={4} />
            {fieldState.invalid ? (
              <FormHelperText error>OTP invalid</FormHelperText>
            ) : null}
          </Box>
        )}
      />

      <div>
        <Button
          variant="contained"
          color="secondary"
          className="mt-4 w-full"
          aria-label="Sign in"
          disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
          type="submit"
          size="large"
        >
          {isLoading ? "Loading..." : "Verify"}
        </Button>
      </div>
    </form>
  );
};
export default VerifyOTPForm;
