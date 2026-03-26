"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { bootstrapAuth, loginWithToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = bootstrapAuth();
    if (token) {
      router.replace("/");
    }
  }, [router]);

  return (
    <main className="auth-page">
      <LoginForm
        onLoggedIn={(token) => {
          loginWithToken(token);
          router.replace("/");
        }}
      />
    </main>
  );
}
