// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    "vuetify-nuxt-module",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@pinia/nuxt"
  
  ],
  supabase:{
    redirect: false,
  },
  imports : {
    dirs : ['stores']
  },
  css: ['vuetify/lib/styles/main.sass', "@mdi/font/css/materialdesignicons.min.css"],
  build : {
    transpile : ['vuetify']
  }
})
