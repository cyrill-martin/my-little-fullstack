// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/i18n"],
  i18n: {
    locales: [
      {
        code: "de",
        iso: "de-DE",
        name: "Deutsch",
      },
      {
        code: "en",
        iso: "en-US",
        name: "English",
      },
    ],
    defaultLocale: "de",
    strategy: "prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_lang",
      redirectOn: "root",
    },
  },
  runtimeConfig: {
    // The env variables are set in the docker-compose.yml
    // The localhost URLs are fallbacks in case the environment variables are not set
    directusUrl: process.env.NUXT_DIRECTUS_URL || "http://localhost:8055",
    public: {
      directusUrl:
        process.env.NUXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055",
    },
  },
  build: {
    transpile: [
      "naive-ui",
      "vueuc",
      "@css-render/vue3-ssr",
      "css-render",
      "@juggle/resize-observer",
    ],
  },
  // Allow x-frame options for Directus preview
  nitro: {
    routeRules: {
      "/**": {
        headers: {
          "X-Frame-Options": "ALLOWALL",
          "Content-Security-Policy":
            "frame-ancestors 'self' http://localhost:8055",
        },
      },
    },
  },
});
