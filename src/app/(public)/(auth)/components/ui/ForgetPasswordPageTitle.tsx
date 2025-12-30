import Typography from "@mui/material/Typography";

function ForgotPasswordPageTitle() {
  return (
    <div className="w-full">
      <img className="w-40" src="/assets/images/logo/logo.svg" alt="logo" />

      <Typography className="mt-8 text-4xl leading-[1.25] font-extrabold tracking-tight">
        Forgot Password
      </Typography>
      <div className="mt-0.5 flex items-baseline font-medium">
        <Typography>
          No worries! Enter your email and we’ll send you a reset link
        </Typography>
      </div>
    </div>
  );
}

export default ForgotPasswordPageTitle;
