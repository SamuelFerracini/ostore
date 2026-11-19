// Same-origin image proxy for the admin poster builder. Product images live on
// other hosts without CORS headers, which taints the canvas on PNG export.
// Only hosts that appear in public/products.json are allowed: this is not an
// open proxy.
const ALLOWED_HOSTS = new Set(["au.pandora.net"]);

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_REDIRECTS = 3;

// au.pandora.net sits behind Cloudflare and rejects requests without
// browser-like headers.
const UPSTREAM_HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
};

const parseAllowed = (raw: string, base?: URL): URL | null => {
  let url: URL;
  try {
    url = new URL(raw, base);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (url.port && url.port !== "443") return null;
  if (!ALLOWED_HOSTS.has(url.hostname)) return null;
  return url;
};

export default defineEventHandler(async (event) => {
  const raw = getQuery(event).url;
  if (typeof raw !== "string" || !raw) {
    throw createError({ statusCode: 400, statusMessage: "Missing url" });
  }

  let url = parseAllowed(raw);
  if (!url) {
    throw createError({ statusCode: 403, statusMessage: "Host not allowed" });
  }

  // Follow redirects by hand so every hop is checked against the allowlist.
  let res: Response | null = null;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    res = await fetch(url, { headers: UPSTREAM_HEADERS, redirect: "manual" });
    if (res.status < 300 || res.status >= 400) break;
    const next = parseAllowed(res.headers.get("location") || "", url);
    if (!next) {
      throw createError({ statusCode: 403, statusMessage: "Redirect not allowed" });
    }
    url = next;
    res = null;
  }

  if (!res || !res.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: `Upstream error ${res?.status ?? "redirect loop"}`,
    });
  }

  const type = res.headers.get("content-type") || "";
  // SVG can carry script; served from our origin that would be an XSS vector.
  if (!type.startsWith("image/") || type.includes("svg")) {
    throw createError({ statusCode: 502, statusMessage: "Upstream is not an image" });
  }
  const length = Number(res.headers.get("content-length") || 0);
  if (length > MAX_BYTES) {
    throw createError({ statusCode: 502, statusMessage: "Image too large" });
  }

  const body = Buffer.from(await res.arrayBuffer());
  if (body.byteLength > MAX_BYTES) {
    throw createError({ statusCode: 502, statusMessage: "Image too large" });
  }

  setResponseHeaders(event, {
    "content-type": type,
    "cache-control": "public, max-age=86400, immutable",
    "x-content-type-options": "nosniff",
  });
  return body;
});
