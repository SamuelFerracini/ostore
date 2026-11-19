// Admin mode toggled by ?admin=1 / ?admin=0, persisted in a cookie so it
// survives navigation and matches between SSR and client. UI toggle only.
export const useAdmin = () => {
  const route = useRoute();
  const cookie = useCookie("ostore_admin", {
    default: () => "0",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const apply = (raw) => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (v === "1") cookie.value = "1";
    else if (v === "0") cookie.value = "0";
  };

  apply(route.query.admin);
  watch(() => route.query.admin, apply);

  // useCookie JSON-parses "1" into the number 1, so compare as string.
  const isAdmin = computed(() => String(cookie.value) === "1");
  return { isAdmin };
};

// Pandora Thailand link for a product: the matched pandora.co.th product URL
// the scraper writes as `th_link`. Empty when TH does not sell that SKU.
export const pandoraThLink = (product) => product?.th_link || "";
