import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import alpinejs from "@astrojs/alpinejs";
import react from "@astrojs/react";

//import cloudflare from "@astrojs/cloudflare";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: true
    },
    fallback: {
      en: "es"
    }
  },
  integrations: [tailwind(), icon(), alpinejs(), react()],
  redirect: {}
  //adapter: cloudflare()
  ,
  adapter: vercel()
});