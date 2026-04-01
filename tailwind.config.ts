import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
        },
        accent: {
          blue: "var(--accent-blue)",
          cyan: "var(--accent-cyan)",
        },
        text: {
          primary: "var(--text-primary)",
          muted: "var(--text-muted)",
        },
        glass: {
          bg: "var(--glass-bg)",
          border: "var(--glass-border)",
        },
      },
      fontFamily: {
        heading: [
          "var(--font-space-grotesk)",
          "Space Grotesk",
          "sans-serif",
        ],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: [
          "var(--font-space-grotesk)",
          "Space Grotesk",
          "monospace",
        ],
      },
    },
  },
} satisfies Config;
