import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Preload the two Latin font files so text renders in Atkinson Hyperlegible
// on first paint instead of swapping in later (which causes layout shift).
const preloadFonts = () => ({
  name: "preload-fonts",
  transformIndexHtml: {
    order: "post",
    handler(html, ctx) {
      if (!ctx.bundle) return html;
      const fonts = Object.keys(ctx.bundle).filter((f) =>
        /atkinson-hyperlegible-(next|mono)-latin-wght-normal-.*\.woff2$/.test(f)
      );
      const tags = fonts
        .map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin>`)
        .join("\n    ");
      return html.replace("</title>", `</title>\n    ${tags}`);
    },
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), preloadFonts()],
  // axe-core is ~160 KB gzipped, but it only loads when someone presses "Check this page".
  build: { chunkSizeWarningLimit: 600 },
});
