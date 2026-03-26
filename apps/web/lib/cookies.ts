"use client";

import Cookies from "js-cookie";

const FILTERS_KEY = "dashboard_filters";
const TOKEN_KEY = "dashboard_token";

export type StoredFilters = {
  startDate: string;
  endDate: string;
  ageGroup: string;
  gender: string;
};

export const saveFilters = (filters: StoredFilters) => {
  Cookies.set(FILTERS_KEY, JSON.stringify(filters), { expires: 7 });
};

export const loadFilters = (): StoredFilters | null => {
  const value = Cookies.get(FILTERS_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as StoredFilters;
  } catch {
    return null;
  }
};

export const saveToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1 });
};

export const loadToken = () => Cookies.get(TOKEN_KEY) ?? "";
