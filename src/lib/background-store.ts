import { useState, useEffect } from "react";

const BG_EVENT_NAME = "visezworks_bg_toggle_change";
const BG_STORAGE_KEY = "visezworks_bg_atmosphere_enabled";

export function getStoredBackgroundState(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(BG_STORAGE_KEY);
  if (stored !== null) {
    return stored === "true";
  }
  return true;
}

export function setStoredBackgroundState(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BG_STORAGE_KEY, String(enabled));
  window.dispatchEvent(new Event(BG_EVENT_NAME));
}

export function useBackgroundToggle() {
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    setEnabled(getStoredBackgroundState());

    const handleSync = () => {
      setEnabled(getStoredBackgroundState());
    };

    window.addEventListener(BG_EVENT_NAME, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener(BG_EVENT_NAME, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setStoredBackgroundState(next);
  };

  return { enabled, setEnabled, toggle };
}
