import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import _ from "lodash";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@fuse/core/Link";
import Button from "@mui/material/Button";
import { signIn } from "next-auth/react";
import { Alert } from "@mui/material";
import signinErrors from "./signinErrors";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Form Validation Schema
 */
const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password is too short - must be at least 8 chars.")
      .nonempty("Please enter your password.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol."),
    passwordConfirm: z.string().nonempty("Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"],
  });

type FormType = z.infer<typeof schema>;

const defaultValues = {
  password: "",
  confirmPassword: "",
};

function ResetPasswordForm() {
  const router = useRouter();
  const { isLoading, resetPassword } = useAuthStore();
  const { control, formState, handleSubmit, setValue, setError } =
    useForm<FormType>({
      mode: "onChange",
      defaultValues,
      resolver: zodResolver(schema),
    });

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit(formData: FormType) {
    try {
      await resetPassword({ password: formData.password });
      router.push(`/sign-in`);
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error?.response?.data?.message,
      });
    }
  }

  return (
    <form
      name="loginForm"
      noValidate
      className="flex w-full flex-col justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
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
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors?.password?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />

      <Controller
        name="passwordConfirm"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Confirm Password"
            type="password"
            error={!!errors.passwordConfirm}
            helperText={errors?.passwordConfirm?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />

      <Button
        variant="contained"
        color="secondary"
        className="mt-4 w-full"
        aria-label="Reset Password"
        disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
        type="submit"
        size="large"
      >
        {isLoading ? "Loading..." : "Reset Password"}
      </Button>
    </form>
  );
}

export default ResetPasswordForm;
