import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import _ from "lodash";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { signIn } from "next-auth/react";
import FormHelperText from "@mui/material/FormHelperText";
import { Alert } from "@mui/material";
import signinErrors from "./signinErrors";
import { authCreateDbUser } from "@auth/authApi";
import { User } from "@auth/user";
import { use, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Form Validation Schema
 */

const schema = z
  .object({
    fullName: z.string().nonempty("You must enter your name"),
    companyName: z
      .string()
      .min(3, "Company name must be at least 3 characters")
      .nonempty("You must enter your company name"),
    email: z
      .string()
      .email("You must enter a valid email")
      .nonempty("You must enter an email"),
    phone: z.string().min(5, "You must enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password is too short - must be at least 8 chars.")
      .nonempty("Please enter your password.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol."),
    passwordConfirm: z.string().nonempty("Password confirmation is required"),
    acceptTermsConditions: z
      .boolean()
      .refine(
        (val) => val === true,
        "The terms and conditions must be accepted."
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"],
  });

const defaultValues = {
  fullName: "",
  companyName: "",
  phone: "",
  email: "",
  password: "",
  passwordConfirm: "",
  acceptTermsConditions: false,
};

export type FormType = {
  fullName: string;
  password: string;
  email: string;
  companyName: string;
  phone: string;
};

function AuthJsCredentialsSignUpForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, register } = useAuthStore();
  const { control, formState, handleSubmit, setError } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit(formData: FormType) {
    try {
      const { fullName, email, password, phone, companyName } = formData;
      await register({
        fullName,
        email,
        password,
        phone,
        companyName,
        role: "accountOwner",
      });

      router.push(`/verify-otp?email=${email}&prev=${pathname}`);
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error?.response?.data?.message,
      });
      console.log(error);
    }
  }

  return (
    <form
      name="registerForm"
      noValidate
      className="flex w-full flex-col justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* {created && (
        <Alert
          className="mb-8"
          severity="success"
          sx={(theme) => ({
            backgroundColor: theme.palette.success.light,
            color: theme.palette.success.dark,
          })}
        >
          {errors?.root?.message}
        </Alert>
      )} */}
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
        name="fullName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Display name"
            autoFocus
            type="name"
            error={!!errors.fullName}
            helperText={errors?.fullName?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="companyName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Company name"
            autoFocus
            type="name"
            error={!!errors.companyName}
            helperText={errors?.companyName?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Phone"
            autoFocus
            type="name"
            error={!!errors.phone}
            helperText={errors?.phone?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Email"
            type="email"
            error={!!errors.email}
            helperText={errors?.email?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
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
            label="Password (Confirm)"
            type="password"
            error={!!errors.passwordConfirm}
            helperText={errors?.passwordConfirm?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="acceptTermsConditions"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.acceptTermsConditions}>
            <FormControlLabel
              label="I agree with Terms and Privacy Policy"
              control={<Checkbox size="small" {...field} />}
            />
            <FormHelperText>
              {errors?.acceptTermsConditions?.message}
            </FormHelperText>
          </FormControl>
        )}
      />
      <Button
        variant="contained"
        color="secondary"
        className="mt-6 w-full"
        aria-label="Register"
        disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
        type="submit"
        size="large"
      >
        {isLoading ? "Creating...." : "Create your free account"}
      </Button>
    </form>
  );
}

export default AuthJsCredentialsSignUpForm;
