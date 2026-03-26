"use client";

import { FormEvent, useState } from "react";

type Props = {
  onLoggedIn: (token: string) => void;
};

export default function LoginForm({ onLoggedIn }: Props) {
  const [username, setUsername] = useState("user_1");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
      const response = await fetch(`${base}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        setError("Invalid credentials");
        return;
      }
      const data = await response.json();
      onLoggedIn(data.access_token);
    } catch {
      setError("Could not login");
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="row">
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
