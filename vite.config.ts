import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { APP_DESCRIPTION, APP_NAME } from "./src/lib/const";

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [
      sveltekit(),
      SvelteKitPWA({
        manifest: {
          name: APP_NAME,
          short_name: APP_NAME,
          description: APP_DESCRIPTION,
          theme_color: "#ffffff",
          icons: [
            {
              src: process.env.VITE_PWA_ICON_192_PATH,
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: process.env.VITE_PWA_ICON_512_PATH,
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],
  };
});
