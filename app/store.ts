import { create } from "zustand";

interface StoreState {
  theme: "light" | "dark" | "system";
  userToken: string | null;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setUserToken: (token: string | null) => void;
}

const useStore = create<StoreState>((set) => ({
  theme:
    (localStorage.getItem("theme") as "light" | "dark" | "system") || "system",
  userToken: localStorage.getItem("userToken"),
  setTheme: (theme: "light" | "dark" | "system") => {
    let appliedTheme = theme;
    if (theme === "system") {
      appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    if (appliedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", appliedTheme);
    set({ theme: appliedTheme });
  },
  setUserToken: (token: string | null) => {
    if (token === null) {
      localStorage.removeItem("userToken");
    } else {
      localStorage.setItem("userToken", token);
    }
    set({ userToken: token });
  },
}));

export default useStore;
