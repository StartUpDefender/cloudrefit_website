import MainLayout from "src/components/MainLayout";
import AuthGuardRedirect from "@auth/AuthGuardRedirect";

function Layout({ children }) {
  return (
    <AuthGuardRedirect auth={["superAdmin", "accountOwner"]}>
      <MainLayout footer={false}>{children}</MainLayout>
    </AuthGuardRedirect>
  );
}

export default Layout;
