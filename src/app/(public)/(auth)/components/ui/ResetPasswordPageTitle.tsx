import Typography from "@mui/material/Typography";

function ResetPasswordPageTitle() {
  return (
    <div className="w-full">
      <img className="w-40" src="/assets/images/logo/logo.svg" alt="logo" />

      <Typography className="mt-8 text-4xl leading-[1.25] font-extrabold tracking-tight">
        Reset Your Password
      </Typography>
      <div className="mt-0.5 flex items-baseline font-medium">
        <Typography>Enter a new password for your account</Typography>
      </div>
    </div>
  );
}

export default ResetPasswordPageTitle;
