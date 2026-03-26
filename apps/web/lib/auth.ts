"use client";

import { clearFilters, clearToken, loadToken, saveToken } from "@/lib/cookies";
import { clearAuthToken, setAuthToken } from "@/services/api";

export const bootstrapAuth = () => {
  const token = loadToken();
  if (token) {
    setAuthToken(token);
  }
  return token;
};

export const loginWithToken = (token: string) => {
  saveToken(token);
  setAuthToken(token);
};

export const logout = () => {
  clearToken();
  clearFilters();
  clearAuthToken();
};
