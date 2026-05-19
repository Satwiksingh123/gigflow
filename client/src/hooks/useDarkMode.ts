import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/constants";

export function useDarkMode(): [boolean, () => void] {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  }, [dark]);

  return [dark, () => setDark((d) => !d)];
}