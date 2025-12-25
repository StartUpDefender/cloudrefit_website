"use client";

import authRoles from "@auth/authRoles";
import AuthGuardRedirect from "@auth/AuthGuardRedirect";
import VerifyOTPView from "../../components/views/VerifyOTPView";

function Page() {
  return (
    <AuthGuardRedirect auth={authRoles.onlyGuest}>
      <VerifyOTPView />
    </AuthGuardRedirect>
  );
}

export default Page;
