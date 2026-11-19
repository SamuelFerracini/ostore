// Admin-only pages: send everyone else to the home page. Mirrors useAdmin:
// ?admin=1 / ?admin=0 win over the ostore_admin cookie.
export default defineNuxtRouteMiddleware((to) => {
  const raw = to.query.admin;
  const q = Array.isArray(raw) ? raw[0] : raw;
  const cookie = useCookie("ostore_admin");
  // useCookie decodes "1" to the number 1, so compare as a string.
  const isAdmin = q === "1" || (q !== "0" && String(cookie.value) === "1");
  if (!isAdmin) return navigateTo("/");
});
