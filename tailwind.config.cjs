/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: token("paper"),
        "paper-2": token("paper-2"),
        ink: token("ink"),
        "ink-2": token("ink-2"),
        "ink-3": token("ink-3"),
        accent: token("accent"),
        rule: token("rule"),
      },
      fontFamily: {
        display: ['"Instrument Serif"', '"Tiro Devanagari Hindi"', "Georgia", "serif"],
        sans: ['"Schibsted Grotesk Variable"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
        deva: ['"Tiro Devanagari Hindi"', "serif"],
      },
      maxWidth: {
        prose: "64ch",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(0.6em)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        draw: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        rise: "rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        draw: "draw 0.9s cubic-bezier(0.6, 0, 0.2, 1) both",
        pulse: "pulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
