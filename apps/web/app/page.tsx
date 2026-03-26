"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import LoginForm from "@/components/LoginForm";
import { loadToken, saveToken } from "@/lib/cookies";
import { setAuthToken } from "@/services/api";

export default function HomePage() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const saved = loadToken();
    if (saved) {
      setAuthToken(saved);
      setToken(saved);
    }
  }, []);

  return (
    <main className="container">
      <h1>Interactive Product Analytics Dashboard</h1>
      {!token ? (
        <LoginForm
          onLoggedIn={(newToken) => {
            saveToken(newToken);
            setAuthToken(newToken);
            setToken(newToken);
          }}
        />
      ) : (
        <Dashboard token={token} />
      )}
    </main>
  );
}
