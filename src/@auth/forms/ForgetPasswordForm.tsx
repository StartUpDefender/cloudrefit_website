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
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Form Validation Schema
 */
const schema = z.object({
  email: z
    .string()
    .email("You must enter a valid email")
    .nonempty("You must enter an email"),
});

type FormType = z.infer<typeof schema>;

const defaultValues = {
  email: "",
};

function ForgetPasswordForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, forgetPassword } = useAuthStore();
  const { control, formState, handleSubmit, setValue, setError } =
    useForm<FormType>({
      mode: "onChange",
      defaultValues,
      resolver: zodResolver(schema),
    });

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit(formData: FormType) {
    try {
      const { email } = formData;
      await forgetPassword({ email });
      router.push(`/verify-otp?email=${email}&prev=${pathname}`);
    } catch (error) {
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
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.dark,
          })}
        >
          {errors?.root?.message}
        </Alert>
      )}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Email"
            autoFocus
            type="email"
            error={!!errors.email}
            helperText={errors?.email?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />

      <div className="flex flex-col items-end justify-center sm:flex-row sm:justify-between">
        <Link className="text-md font-medium" to="/sign-in">
          Back to Login
        </Link>
      </div>
      <Button
        variant="contained"
        color="secondary"
        className="mt-4 w-full"
        aria-label="Send"
        disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
        type="submit"
        size="large"
      >
        {isLoading ? "Loading..." : "send"}
      </Button>
    </form>
  );
}

export default ForgetPasswordForm;
