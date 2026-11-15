// Thai labels for the category ids used in products.json and stores/website.ts.
export const CATEGORY_LABELS_TH = {
  "all-sale": "ลดราคา",
  clearance: "เคลียร์สต็อก",
  charms: "ชาร์ม",
  charm: "ชาร์ม",
  bracelets: "กำไล & สร้อยข้อมือ",
  "basic-bracelets": "กำไลเบสิก",
  "charms-and-bracelets": "ชาร์มและกำไล",
  rings: "แหวน",
  necklaces: "สร้อยคอ",
  earrings: "ต่างหู",
};

// Order of the category pills in the header. "" means all products.
export const CATEGORY_PILLS = [
  { id: "", label: "ทั้งหมด" },
  { id: "rings", label: "แหวน" },
  { id: "charms", label: "ชาร์ม" },
  { id: "bracelets", label: "กำไล & สร้อยข้อมือ" },
  { id: "necklaces", label: "สร้อยคอ" },
  { id: "earrings", label: "ต่างหู" },
  { id: "all-sale", label: "ลดราคา", sale: true },
];

const SALE_CATEGORIES = ["all-sale", "clearance"];

export const categoryLabelTh = (id) =>
  CATEGORY_LABELS_TH[id] ?? getCategoryName(id);

// The product type (ring, charm…) of a product, ignoring sale buckets.
export const productTypeLabelTh = (product) => {
  const categories = product?.categories ?? [];
  const type = categories.find((c) => !SALE_CATEGORIES.includes(c));
  if (type) return categoryLabelTh(type);
  if (categories.length) return categoryLabelTh(categories[0]);
  return product?.category ? categoryLabelTh(product.category) : "";
};
