// Pandora serves product photos through Salesforce Commerce Cloud
// (demandware) dynamic imaging: /dw/image/v2/... URLs accept sw / sh (scale
// width / height) query params. The originals are 1500x2000, far larger than
// any card, so ask the CDN for the size we show. Other URLs pass through.
const DW_IMAGE = /\/dw\/image\/v2\//;

// Width only: with both sw and sh the CDN fits the photo into that exact box
// and pads it, which would change how object-cover crops off-ratio photos.
export const CARD_IMAGE = { w: 400 };
export const MODAL_IMAGE = { w: 1000 };
export const MODAL_THUMB_IMAGE = { w: 240 };

export const resizeImage = (src, { w, h } = {}) => {
  if (typeof src !== "string" || !DW_IMAGE.test(src)) return src;
  let url;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  if (w) url.searchParams.set("sw", String(Math.round(w)));
  if (h) url.searchParams.set("sh", String(Math.round(h)));
  return url.toString();
};
