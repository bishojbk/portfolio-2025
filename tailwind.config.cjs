/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        fg: token("fg"),
        muted: token("muted"),
        line: token("line"),
        panel: token("panel"),
        link: token("link"),
        good: token("good"),
        warn: token("warn"),
        bad: token("bad"),
      },
      fontFamily: {
        sans: ['"Atkinson Hyperlegible Next Variable"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ['"Atkinson Hyperlegible Mono Variable"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: {
        text: "44rem",
        wide: "64rem",
      },
    },
  },
  plugins: [],
};
