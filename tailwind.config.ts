import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        opensans: ['Open Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      colors: {
        white: "var(--white)",
        background_primary: "var(--background-primary)",
        background_secondary: "var(--background-secondary)",
        accent_blue: "var(--accent-blue)",
        accent_blue_active: "var(--accent-blue-active)",
        light_grey: "var(--light-grey)",
        light_grey_active: "var(--light-grey-active)",
        accent_yellow: "var(--accent-yellow)",
      },
      animation: {
        slide: "slide 60s linear infinite"
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-50% - 2rem))" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
