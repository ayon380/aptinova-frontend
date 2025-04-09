import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ColorTheme {
  error: string;
  scrim: string;
  shadow: string;
  onError: string;
  outline: string;
  primary: string;
  surface: string;
  tertiary: string;
  onPrimary: string;
  onSurface: string;
  secondary: string;
  background: string;
  onTertiary: string;
  onSecondary: string;
  onBackground: string;
  errorContainer: string;
  inversePrimary: string;
  inverseSurface: string;
  outlineVariant: string;
  surfaceVariant: string;
  inverseOnSurface: string;
  onErrorContainer: string;
  onSurfaceVariant: string;
  primaryContainer: string;
  tertiaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onTertiaryContainer: string;
  onSecondaryContainer: string;
}

interface CustomThemes {
  lightTheme?: ColorTheme;
  darkTheme?: ColorTheme;
}

interface StoreState {
  title: string;
  token: string | null;
  theme: "light" | "dark" | "system";
  userdata: Record<string, unknown> | null;
  userType: "HR" | "HRManager" | "candidate";
  customThemes: CustomThemes;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setuserType: (userType: "HR" | "HRManager" | "candidate") => void;
  setToken: (token: string | null) => void;
  setUserdata: (data: Record<string, unknown> | null) => void;
  setTitle: (title: string) => void;
  setCustomThemes: (themes: CustomThemes) => void;
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

// Explicit mapping from ColorTheme properties to CSS variable names
const themeVarMapping: Record<keyof ColorTheme, string> = {
  error: "--md-sys-color-error",
  scrim: "--md-sys-color-scrim",
  shadow: "--md-sys-color-shadow",
  onError: "--md-sys-color-on-error",
  outline: "--md-sys-color-outline",
  primary: "--md-sys-color-primary",
  surface: "--md-sys-color-surface-container",
  tertiary: "--md-sys-color-tertiary",
  onPrimary: "--md-sys-color-on-primary",
  onSurface: "--md-sys-color-on-surface",
  secondary: "--md-sys-color-secondary",
  background: "--md-sys-color-background",
  onTertiary: "--md-sys-color-on-tertiary",
  onSecondary: "--md-sys-color-on-secondary",
  onBackground: "--md-sys-color-on-background",
  errorContainer: "--md-sys-color-error-container",
  inversePrimary: "--md-sys-color-inverse-primary",
  inverseSurface: "--md-sys-color-inverse-surface",
  outlineVariant: "--md-sys-color-outline-variant",
  surfaceVariant: "--md-sys-color-surface-variant",
  inverseOnSurface: "--md-sys-color-inverse-on-surface",
  onErrorContainer: "--md-sys-color-on-error-container",
  onSurfaceVariant: "--md-sys-color-on-surface-variant",
  primaryContainer: "--md-sys-color-primary-container",
  tertiaryContainer: "--md-sys-color-tertiary-container",
  onPrimaryContainer: "--md-sys-color-on-primary-container",
  secondaryContainer: "--md-sys-color-secondary-container",
  onTertiaryContainer: "--md-sys-color-on-tertiary-container",
  onSecondaryContainer: "--md-sys-color-on-secondary-container",
};

// Apply custom theme colors to CSS variables using the explicit mapping
const applyCustomColors = (colors: ColorTheme) => {
  if (!colors || typeof window === "undefined") return;

  Object.entries(colors).forEach(([key, value]) => {
    const cssVarName = themeVarMapping[key as keyof ColorTheme];
    if (cssVarName) {
      document.documentElement.style.setProperty(cssVarName, value);
      console.log(`Applied color: ${cssVarName} = ${value}`);
    } else {
      console.warn(`No mapping found for theme property: ${key}`);
    }
  });
};

const applyTheme = (
  theme: "light" | "dark" | "system",
  customThemes?: CustomThemes
) => {
  const appliedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(appliedTheme);

  // Apply custom colors if available
  if (customThemes) {
    if (appliedTheme === "dark" && customThemes.darkTheme) {
      applyCustomColors(customThemes.darkTheme);
    } else if (appliedTheme === "light" && customThemes.lightTheme) {
      applyCustomColors(customThemes.lightTheme);
    }
  }

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

  // Get custom themes from storage
  let customThemes: CustomThemes = {};
  try {
    const storedData = localStorage.getItem("aptinova-storage");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.state?.userdata?.colours) {
        customThemes = parsedData.state.userdata.colours;
      }
    }
  } catch (error) {
    console.error("Error parsing stored themes:", error);
  }

  const appliedTheme = applyTheme(storedTheme, customThemes);
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
    (set, get) => ({
      title: "Aptinova",
      theme: getInitialTheme(),
      token: getInitialUserToken(),
      userdata: null,
      userType: "candidate",
      customThemes: {},
      setuserType: (userType: "HR" | "HRManager" | "candidate") =>
        set({ userType }),
      setToken: (token: string | null) => set({ token }),
      setTitle: (title: string) => set({ title }),
      setTheme: (theme: "light" | "dark" | "system") => {
        if (typeof window !== "undefined") {
          applyTheme(theme, get().customThemes);
          set({ theme });
        }
      },
      setUserdata: (data: Record<string, unknown> | null) => {
        // Extract custom themes from userdata if available
        if (data?.colours) {
          const customThemes = data.colours as CustomThemes;
          set({ customThemes });
          // Apply the current theme with new colors
          if (typeof window !== "undefined") {
            applyTheme(get().theme, customThemes);
          }
        }
        set({ userdata: data });
      },
      setCustomThemes: (themes: CustomThemes) => {
        set({ customThemes: themes });
        if (typeof window !== "undefined") {
          applyTheme(get().theme, themes);
        }
      },
    }),
    {
      name: "aptinova-storage", // Key for localStorage
      storage: createJSONStorage(() => localStorage), // Persist storage in localStorage
      partialize: (state) => ({
        theme: state.theme,
        token: state.token,
        userType: state.userType,
        userdata: state.userdata,
        customThemes: state.customThemes,
      }),
    }
  )
);

export default useStore;
