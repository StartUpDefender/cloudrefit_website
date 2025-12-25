"use client";

import authRoles from "@auth/authRoles";
import AuthGuardRedirect from "@auth/AuthGuardRedirect";
import SignInPageView from "../../components/views/SignInPageView";
import ForgetPasswordView from "../../components/views/ForgetPasswordView";

function Page() {
  return (
    <AuthGuardRedirect auth={authRoles.onlyGuest}>
      <ForgetPasswordView />
    </AuthGuardRedirect>
  );
}

export default Page;
