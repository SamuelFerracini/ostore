import th from "~/locales/th";
import en from "~/locales/en";

const MESSAGES = { th, en };

// Replace {name} placeholders. A value like "1 item | {n} items" picks the
// singular or plural form from params.n.
const format = (template, params) => {
  let text = template;
  if (params && params.n !== undefined && text.includes(" | ")) {
    const [one, many] = text.split(" | ");
    text = Number(params.n) === 1 ? one : many;
  }
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, key) =>
    params[key] === undefined
      ? match
      : typeof params[key] === "number"
        ? params[key].toLocaleString("en-US")
        : String(params[key]),
  );
};

export const useLocale = () => {
  const lang = useCookie("lang", {
    default: () => "th",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const locale = computed({
    get: () => (lang.value === "en" ? "en" : "th"),
    set: (v) => {
      lang.value = v === "en" ? "en" : "th";
    },
  });

  // Missing EN key falls back to TH, then to the key itself.
  const tIn = (lang, key, params) => {
    const template = MESSAGES[lang]?.[key] ?? MESSAGES.th[key] ?? key;
    return format(template, params);
  };

  const t = (key, params) => tIn(locale.value, key, params);

  const toggleLocale = () => {
    locale.value = locale.value === "th" ? "en" : "th";
  };

  return { locale, t, tIn, toggleLocale };
};
