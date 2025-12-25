"use client";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";

function VerifyOTPPageTitle() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="w-full">
      <img className="w-40" src="/assets/images/logo/logo.svg" alt="logo" />

      <Typography className="mt-8 text-4xl leading-[1.25] font-extrabold tracking-tight">
        Verify Your Account
      </Typography>
      <div className="mt-0.5 flex items-baseline font-medium">
        <Typography>
          {`We’ve sent a 6-digit code to your email ${email} Please enter
          it below`}
        </Typography>
      </div>
    </div>
  );
}

export default VerifyOTPPageTitle;
