"use client";

import { signOut, useSession } from "next-auth/react";
import { useMemo } from "react";

export default function useUser() {
  const { data: session, status } = useSession();

  const isGuest = status !== "authenticated";

  const user = useMemo(() => {
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      name: session.user.name,
      photoURL: "",
      settings: undefined,
    };
  }, [session]);

  async function handleSignOut() {
    return signOut();
  }
  return {
    data: user,
    isGuest,
    isLoading: status === "loading",
    signOut: handleSignOut,
  };
}
