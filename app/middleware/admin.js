// Admin-only pages: send everyone else to the home page. Admin only when the
// ostore_admin cookie holds the password (see useAdmin); ?admin=0 forces off.
import { isAdminValue } from "~/composables/adminAuth";

export default defineNuxtRouteMiddleware((to) => {
  const raw = to.query.admin;
  const q = Array.isArray(raw) ? raw[0] : raw;
  const cookie = useAdminCookie();
  const hash = useRuntimeConfig().public.adminPasswordHash;
  const isAdmin = q !== "0" && isAdminValue(cookie.value, hash);
  if (!isAdmin) return navigateTo("/");
});
