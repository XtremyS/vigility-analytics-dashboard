"use client";

import { useRouter } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import { loginWithToken } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <main className="auth-page">
      <RegisterForm
        onRegistered={(token) => {
          loginWithToken(token);
          router.replace("/");
        }}
      />
    </main>
  );
}
