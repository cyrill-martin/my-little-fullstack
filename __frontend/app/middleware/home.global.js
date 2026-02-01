// Middleware handling redirects from root or /de or /en to ../home
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/" || to.path === "/de" || to.path === "/en") {
    const locale = useNuxtApp().$i18n.locale.value;
    return navigateTo(`/${locale}/home`, { redirectCode: 301 });
  }
});
