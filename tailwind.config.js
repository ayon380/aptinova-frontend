/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Gold color palette
        gold: {
          50: "#FFF9E5",
          100: "#FFF3CC",
          200: "#FFE799",
          300: "#FFDB66",
          400: "#FFD033",
          500: "#FFC400",
          600: "#CC9D00",
          700: "#997600",
          800: "#664E00",
          900: "#332700",
        },
        // Original primary color definition (keep if needed)
        primary: {
          50: "rgb(var(--color-primary-50) / <alpha-value>)",
          100: "rgb(var(--color-primary-100) / <alpha-value>)",
          200: "rgb(var(--color-primary-200) / <alpha-value>)",
          300: "rgb(var(--color-primary-300) / <alpha-value>)",
          400: "rgb(var(--color-primary-400) / <alpha-value>)",
          500: "rgb(var(--color-primary-500) / <alpha-value>)",
          600: "rgb(var(--color-primary-600) / <alpha-value>)",
          700: "rgb(var(--color-primary-700) / <alpha-value>)",
          800: "rgb(var(--color-primary-800) / <alpha-value>)",
          900: "rgb(var(--color-primary-900) / <alpha-value>)",
        },
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        "gray-850": "#1a1d2b",

        // Material Design system colors
        md: {
          primary: "var(--md-sys-color-primary)",
          "on-primary": "var(--md-sys-color-on-primary)",
          "primary-container": "var(--md-sys-color-primary-container)",
          "on-primary-container": "var(--md-sys-color-on-primary-container)",
          secondary: "var(--md-sys-color-secondary)",
          "on-secondary": "var(--md-sys-color-on-secondary)",
          "secondary-container": "var(--md-sys-color-secondary-container)",
          "on-secondary-container":
            "var(--md-sys-color-on-secondary-container)",
          tertiary: "var(--md-sys-color-tertiary)",
          "on-tertiary": "var(--md-sys-color-on-tertiary)",
          "tertiary-container": "var(--md-sys-color-tertiary-container)",
          "on-tertiary-container": "var(--md-sys-color-on-tertiary-container)",
          error: "var(--md-sys-color-error)",
          "on-error": "var(--md-sys-color-on-error)",
          "error-container": "var(--md-sys-color-error-container)",
          "on-error-container": "var(--md-sys-color-on-error-container)",
          background: "var(--md-sys-color-background)",
          "on-background": "var(--md-sys-color-on-background)",
          surface: "var(--md-sys-color-surface)",
          "on-surface": "var(--md-sys-color-on-surface)",
          "surface-variant": "var(--md-sys-color-surface-variant)",
          "on-surface-variant": "var(--md-sys-color-on-surface-variant)",
          outline: "var(--md-sys-color-outline)",
          "outline-variant": "var(--md-sys-color-outline-variant)",
          shadow: "var(--md-sys-color-shadow)",
          scrim: "var(--md-sys-color-scrim)",
          "inverse-surface": "var(--md-sys-color-inverse-surface)",
          "inverse-on-surface": "var(--md-sys-color-inverse-on-surface)",
          "inverse-primary": "var(--md-sys-color-inverse-primary)",
          "primary-fixed": "var(--md-sys-color-primary-fixed)",
          "on-primary-fixed": "var(--md-sys-color-on-primary-fixed)",
          "primary-fixed-dim": "var(--md-sys-color-primary-fixed-dim)",
          "on-primary-fixed-variant":
            "var(--md-sys-color-on-primary-fixed-variant)",
          "secondary-fixed": "var(--md-sys-color-secondary-fixed)",
          "on-secondary-fixed": "var(--md-sys-color-on-secondary-fixed)",
          "secondary-fixed-dim": "var(--md-sys-color-secondary-fixed-dim)",
          "on-secondary-fixed-variant":
            "var(--md-sys-color-on-secondary-fixed-variant)",
          "tertiary-fixed": "var(--md-sys-color-tertiary-fixed)",
          "on-tertiary-fixed": "var(--md-sys-color-on-tertiary-fixed)",
          "tertiary-fixed-dim": "var(--md-sys-color-tertiary-fixed-dim)",
          "on-tertiary-fixed-variant":
            "var(--md-sys-color-on-tertiary-fixed-variant)",
          "surface-dim": "var(--md-sys-color-surface-dim)",
          "surface-bright": "var(--md-sys-color-surface-bright)",
          "surface-container-lowest":
            "var(--md-sys-color-surface-container-lowest)",
          "surface-container-low": "var(--md-sys-color-surface-container-low)",
          "surface-container": "var(--md-sys-color-surface-container)",
          "surface-container-high":
            "var(--md-sys-color-surface-container-high)",
          "surface-container-highest":
            "var(--md-sys-color-surface-container-highest)",
          "surface-tint": "var(--md-sys-color-surface-tint)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        google: ["var(--font-google)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        glow: "0 0 15px rgba(66, 153, 225, 0.5)",
      },
    },
    keyframes: {
      "accordion-down": {
        from: { height: "0" },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: "0" },
      },
      "fade-in": {
        from: { opacity: "0", transform: "translateY(20px)" },
        to: { opacity: "1", transform: "translateY(0)" },
      },
      "fade-in-up": {
        from: { opacity: "0", transform: "translateY(40px)" },
        to: { opacity: "1", transform: "translateY(0)" },
      },
      scan: {
        "0%": { transform: "translateY(0) translateX(-100%)" },
        "100%": { transform: "translateY(0) translateX(200%)" },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "fade-in": "fade-in 0.7s ease-out forwards",
      "fade-in-up": "fade-in-up 0.7s ease-out forwards",
      scan: "scan 3s ease-in-out infinite",
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};
