// Admin mode: on only while the ostore_admin cookie holds the admin password
// (set by the /admin login form). The code stores just a salted SHA-256 hash
// of it (adminPasswordHash). ?admin=0 turns admin mode off. UI toggle only.
import { isAdminValue } from "./adminAuth";

// Raw string cookie (no JSON parsing, so a password like 1234 stays text).
export const useAdminCookie = () =>
  useCookie("ostore_admin", {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    encode: (v) => encodeURIComponent(String(v)),
    decode: (v) => decodeURIComponent(v),
  });

export const useAdmin = () => {
  const route = useRoute();
  const router = useRouter();
  const cookie = useAdminCookie();
  const hash = useRuntimeConfig().public.adminPasswordHash;

  const apply = (raw) => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (v === "0") cookie.value = null;
  };

  apply(route.query.admin);
  watch(() => route.query.admin, apply);

  const isAdmin = computed(() => isAdminValue(cookie.value, hash));

  // Turn admin mode on if the password is right. Returns whether it worked.
  const login = (password) => {
    if (!isAdminValue(password, hash)) return false;
    cookie.value = String(password);
    return true;
  };

  // Leave admin mode: cookie off, drop ?admin from the URL, and leave
  // /admin/* pages.
  const exit = async () => {
    cookie.value = null;
    if (route.path.startsWith("/admin")) {
      await navigateTo({ path: "/", replace: true });
      return;
    }
    if (route.query.admin !== undefined) {
      const { admin, ...query } = route.query;
      await router.replace({ path: route.path, query, hash: route.hash });
    }
  };

  return { isAdmin, login, exit };
};

// Pandora Thailand link for a product: the matched pandora.co.th product URL
// the scraper writes as `th_link`. Empty when TH does not sell that SKU.
export const pandoraThLink = (product) => product?.th_link || "";
