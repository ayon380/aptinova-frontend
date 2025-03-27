import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface StoreState {
  title: string;
  token: string | null;
  theme: "light" | "dark" | "system";
  userdata: Record<string, unknown> | null;
  userType: "HR" | "HRManager" | "candidate";
  setTheme: (theme: "light" | "dark" | "system") => void;
  setuserType: (userType: "HR" | "HRManager" | "candidate") => void;
  setToken: (token: string | null) => void;
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

const applyTheme = (theme: "light" | "dark" | "system") => {
  const appliedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(appliedTheme);

  // Update theme-color meta tag or create if it doesn't exist
  let themeColorMeta = document.querySelector("meta[name='theme-color']");
  if (!themeColorMeta) {
    themeColorMeta = document.createElement("meta");
    themeColorMeta.setAttribute("name", "theme-color");
    document.head.appendChild(themeColorMeta);
  }

  // Set the meta tag color to match the background
  const bgColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--md-sys-color-background")
    .trim();
  themeColorMeta.setAttribute("content", bgColor);

  return appliedTheme;
};

// Create a separate initialization function for client-side only
export function initializeTheme() {
  if (typeof window === "undefined") return;

  const storedTheme =
    (localStorage.getItem("theme") as "light" | "dark" | "system") || "system";
  console.log("Initializing theme:", storedTheme);

  const appliedTheme = applyTheme(storedTheme);
  console.log("Applied theme:", appliedTheme);

  // Set up system theme listener
  if (storedTheme === "system") {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        const newTheme = e.matches ? "dark" : "light";

        // Update the document's class for the new theme
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);

        // Check if the 'theme-color' meta tag exists
        let themeColorMeta = document.querySelector("meta[name='theme-color']");
        if (!themeColorMeta) {
          console.log("Creating 'theme-color' meta tag...");
          themeColorMeta = document.createElement("meta");
          themeColorMeta.setAttribute("name", "theme-color");
          document.head.appendChild(themeColorMeta);
        } else {
          console.log("'theme-color' meta tag already exists.");
        }

        // Update the 'theme-color' meta tag content based on the new theme
        const bgColor = getComputedStyle(document.documentElement)
          .getPropertyValue("--md-sys-color-background")
          .trim();
        themeColorMeta.setAttribute("content", bgColor);

        console.log("System theme changed to:", newTheme);
      });
  }
}

const useStore = create<StoreState>()(
  persist(
    (set) => ({
      title: "Aptinova",
      theme: getInitialTheme(),
      token: getInitialUserToken(),
      userdata: null,
      userType: "candidate",
      setuserType: (userType: "HR" | "HRManager" | "candidate") =>
        set({ userType }),
      setToken: (token: string | null) => set({ token }),
      setTitle: (title: string) => set({ title }),
      setTheme: (theme: "light" | "dark" | "system") => {
        if (typeof window !== "undefined") {
          applyTheme(theme);
          set({ theme });
        }
      },
      setUserdata: (data: Record<string, unknown> | null) =>
        set({ userdata: data }),
    }),
    {
      name: "aptinova-storage", // Key for localStorage
      storage: createJSONStorage(() => localStorage), // Persist storage in localStorage
      partialize: (state) => ({
        theme: state.theme,
        token: state.token,
        userType: state.userType,
        userdata: state.userdata,
      }),
    }
  )
);

export default useStore;
