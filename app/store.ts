import { create } from "zustand";

interface StoreState {
  title: string;
  theme: "light" | "dark" | "system";
  userToken: string | null;
  userdata: Record<string, unknown> | null;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setUserToken: (token: string | null) => void;
  setUserdata: (data: Record<string, unknown> | null) => void;
  setTitle: (title: string) => void;
}

// Utility functions to get initial states
const getInitialTheme = (): "light" | "dark" | "system" => {
  if (typeof window !== "undefined") {
    return (
      (localStorage.getItem("theme") as "light" | "dark" | "system") || "system"
    );
  }
  return "system";
};

const getInitialUserToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userToken");
  }
  return null;
};

const useStore = create<StoreState>((set) => ({
  title: "Aptinova",
  theme: getInitialTheme(),
  userToken: getInitialUserToken(),
  userdata: null,

  setTitle: (title: string) => {
    set({ title });
  },

  setTheme: (theme: "light" | "dark" | "system") => {
    if (typeof window !== "undefined") {
      let appliedTheme = theme;

      // Handle system theme
      if (theme === "system") {
        appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }

      // Update DOM and localStorage
      document.body.classList.toggle("dark", appliedTheme === "dark");
      localStorage.setItem("theme", theme);
      set({ theme: appliedTheme });
    }
  },

  setUserToken: (token: string | null) => {
    if (typeof window !== "undefined") {
      if (token === null) {
        localStorage.removeItem("userToken");
      } else {
        localStorage.setItem("userToken", token);
      }
    }
    set({ userToken: token });
  },

  setUserdata: (data: Record<string, unknown> | null) => {
    set({ userdata: data });
  },
}));

export default useStore;
