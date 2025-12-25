"use client";

import authRoles from "@auth/authRoles";
import AuthGuardRedirect from "@auth/AuthGuardRedirect";
import SignInPageView from "../../components/views/SignInPageView";
import ResetPasswordPageView from "../../components/views/ResetPasswordView";

function Page() {
  return (
    <AuthGuardRedirect auth={authRoles.onlyGuest}>
      <ResetPasswordPageView />
    </AuthGuardRedirect>
  );
}

export default Page;
