import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import alpinejs from "@astrojs/alpinejs";
//import vercel from "@astrojs/vercel/serverless";

//import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  //adapter: vercel(),
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
});