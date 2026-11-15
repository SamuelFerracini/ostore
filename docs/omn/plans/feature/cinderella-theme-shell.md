# Cinderella theme: tokens, shell, product cards, dark mode

- Branch: `feature/cinderella-theme-shell`
- Target: `main`
- Source: prompt

## Plan

# Cinderella theme: tokens, shell, product cards, dark mode

## Problem

The Nuxt 3 storefront in `app/` (Pandora with Nonlapan, a Thai shop reselling Pandora jewelry from Australia) has a generic purple/black look: `app/app.config.ts` sets `ui.primary: "purple"`, and components hard-code `bg-purple-600`, `bg-blue-600`, `bg-red-600`. The copy is mostly English, but the customers are Thai. A redesign was agreed: Cinderella-inspired, blue / white / gold, Thai-first. Mockups: https://claude.ai/artifact/4opiLkf65NkYV6sZaaPkxh (you may not be able to open it; the spec below is complete).

This is 1 of 3 parallel units. **You own the theme foundation, the app shell and the product list.** Other units own the product modal (`feature/product-modal`) and the cart (`feature/cart-redesign`). Don't touch their files: `app/components/ProductModal.vue`, `stores/cart.ts`, `app/pages/cart.vue`, `app/components/Cart.vue`, `app/components/EmptyCart.vue`, `app/components/Checkout.vue`, `app/components/PaymentSuccessful.vue`.

## Goal

Apply the new design system app-wide and rebuild the header, the footer, the category/filter controls and the product cards to match the spec.

## Details

### Shared tokens (the other units add this exact block too, so it must stay byte-identical)

In `tailwind.config.ts`, inside `theme.extend.colors`, add this right after the existing `'alizarin-crimson'` entry, verbatim:

```ts
        ivory: '#FCFAF5',
        mist: '#E9EFFA',
        field: '#F1F5FC',
        photo: '#F7F7F7',
        sky: '#C9D7EF',
        periwinkle: '#8FA9DC',
        royal: '#2B4C7E',
        navy: '#1D2B45',
        muted: '#5A6782',
        gold: { DEFAULT: '#C5A253', text: '#8C6B1F', soft: '#FBF4E2', line: '#E8DDC2', arch: '#E3D3A6', light: '#E2C783' },
        midnight: { DEFAULT: '#0E1729', surface: '#16223A', line: '#2A3A57' },
```

And inside `theme.extend`, add `fontFamily: { display: ['"Cormorant Garamond"', 'serif'], 'display-th': ['"Noto Serif Thai"', 'serif'], sans: ['"IBM Plex Sans Thai"', 'system-ui', 'sans-serif'] },`.

### Shared composable (the modal unit creates the same file, so keep it byte-identical)

Create `app/composables/useProductModal.js` with exactly:

```js
export const useProductModal = () => {
  const product = useState("productModal", () => null);
  const open = (p) => {
    product.value = p;
  };
  const close = () => {
    product.value = null;
  };
  const isOpen = computed(() => product.value !== null);
  return { product, isOpen, open, close };
};
```

Clicking a product card (image or name) calls `useProductModal().open(product)`. The modal unit builds the modal itself.

### Your scope

- **Fonts:** load Cormorant Garamond (500/600, plus italic 500), IBM Plex Sans Thai (400/500/600) and Noto Serif Thai (500/600) from Google Fonts in `nuxt.config.ts`. Body text is `font-sans`. Latin brand text and product names use `font-display`. Thai headings use `font-display-th`.

- **Nuxt UI / app config:** remove the purple primary and map it to royal blue. Replace every hard-coded purple, blue and red across the components and pages you own.

- **Light theme:** page background `ivory`, surfaces white, borders `gold-line`, text `navy`, secondary text `muted`, prices `royal`, small gold text `gold-text` (plain `gold` fails contrast on white for small text), gold buttons have `navy` text.

- **Dark theme** (the app already uses `dark:` classes and has a toggle in `AppFooter.vue`): background `midnight`, surfaces `midnight-surface`, borders `midnight-line`, text `#EEF2F8`, muted `#A4B1C8`, accent gold `#D8B868`, prices `#B9CCEE`. Product photos keep their light `photo` background.

- **Header (`AppHeader.vue`):**
  - 4px gold top bar.
  - Logo: a gold line-art tiara SVG next to "Pandora" (`font-display`, 600) with "with Nonlapan" underneath in italic `gold-text`.
  - Rounded search field (bg `field`, border `sky`) with placeholder "ค้นหาแหวน ชาร์ม กำไล…".
  - Pill buttons "รายการโปรด" (outline) and "ตะกร้า" (royal fill, gold count badge).
  - A category pill row under it: ทั้งหมด / แหวน / ชาร์ม / กำไล & สร้อยข้อมือ / สร้อยคอ / ต่างหู / ลดราคา. Active pill is navy fill; "ลดราคา" uses gold-soft with gold-text. On phones the pills scroll horizontally.
  - Keep all existing search, suggestion, cart-count and animation logic.

- **Trust strip** under the header on the product list: a `mist` band with 3 items, each with a gold line icon: "ของแท้ ช็อปจากออสเตรเลีย", "ราคารวมกล่องและถุงแล้ว", "ต้องการใบเสร็จ ทักสอบถามได้". On phones, show one line: "ของแท้จากออสเตรเลีย · ราคารวมกล่องและถุงแล้ว".

- **List header:** an H1 in Thai (for example "เครื่องประดับทั้งหมด", or the category name) plus "N ชิ้น". Restyle `ButtonSortBy`, `ButtonSelectCategory`, `PriceFilter`, `CarouselCategories`, `ButtonWishlist` and `ButtonBack` as white pills with a `sky` border, minimum height 44px, and Thai labels.

- **Product card (`ProductCard.vue`):**
  - Grid of `repeat(auto-fill, minmax(250px,1fr))` on desktop, 2 columns on phones.
  - **Arched photo frame:** an outer wrapper (white bg, 1px `gold-arch` border, 6px padding, `border-radius: 50% 50% 18px 18px / 26% 26% 18px 18px`) and an inner image box (`photo` bg, aspect 3/4, `border-radius: 50% 50% 14px 14px / 25% 25% 14px 14px`, overflow hidden).
  - Keep the hover swap from `primaryImage` to `hoverImage`. Add 2 small 4-point star sparkles (gold and periwinkle) that fade in on hover.
  - **Discount badge,** bottom-left of the photo: gold pill with navy text "−NN%". Compute NN against `market_thb` when it's above the price, otherwise against `originalPrice_normalised`. Hide it when there's no saving.
  - Wishlist heart: 44px white circle, bottom-right of the photo.
  - **Below the photo:**
    - Name in `font-display` 21px, `line-clamp-2` with `min-height: 2.4em`, so every card in a row lines up.
    - Price "1,170 ฿" in royal 600, plus "ช็อปไทย ~~3,465 ฿~~" (when `market_thb` is set) or "ปกติ ~~2,220 ฿~~", muted 13px.
    - A meta line in `gold-text`: for rings "แหวน · N ไซส์" (N = available sizes); otherwise the Thai category name.
  - **Full-width 46px CTA pinned to the card bottom** (`margin-top:auto`):
    - Ring (in the `rings` category or the name contains "Ring"): outline navy "เลือกไซส์". It opens the modal and does **not** add to the cart, because a ring needs a size.
    - Other products: gold "ใส่ตะกร้า". It calls the existing add-to-cart logic.
    - Already in the cart: royal fill "ในตะกร้าแล้ว" with a check icon; a tap removes it, as today.
  - Remove the external-link button from the card (it moves to the modal).
  - Keep the `?download=true` download button and the Thai text "คลิกที่รูปเพื่อดูรูปเพิ่มเติม" behavior. Keep the add/remove pulse animation, recoloured to gold/royal.
  - Format prices with thousands separators. Drop decimals.

- **Footer (`AppFooter.vue`):**
  - Desktop: a full navy footer. On the left, "Pandora *with Nonlapan*" plus the existing two Thai lines, unchanged: "ช็อปออสเตรเลีย ราคารวมทุกอย่างพร้อมกล่องและถุง 💖" and "อาจเปลี่ยนแปลงตามโปรช่วงนั้นนะคะ ถ้าต้องการใบเสร็จทักสอบถามได้นะคะ 🙏🏼". On the right, a "ติดตามคำสั่งซื้อ" link (to `/tracking`) and a gold-outlined pill "ทักแชท Facebook" with a gold circle FB icon, linking to `https://www.facebook.com/nonlapan.ssw`. Left block `flex: 1 1 420px; min-width: 0`, right block `flex: none`, `flex-wrap`, so nothing overflows.
  - Phones: keep the current fixed bottom bar, restyled navy, with the two lines at 12px and a 48px gold circle FB button.
  - Keep the gnoce-shop message and the dark-mode toggle.

- **Other pages you own:** restyle `index.vue`, `products.vue`, `categories.vue`, `favorites.vue`, `product/[id].vue`, `tracking/index.vue`, `ProductsEmpty.vue`, `ProductSkeleton.vue`, `ProductsSkeleton.vue` and `PromotionsPaused.vue` with the same tokens. Skeletons use arched frames.

- **Accessibility:** add a global `:focus-visible` outline of 3px `periwinkle` with offset 2px. Icon-only buttons get Thai `aria-label`s. Touch targets are at least 44px. Use `lang="th"` on the html element.

- Don't change product data, scripts or store logic.

## Done when

- [ ] No purple, red or default-blue UI colours remain in the files you own; the tokens and fonts above are in place.

- [ ] The cards match the spec, and prices and CTAs line up across each row.

- [ ] Ring CTAs open the modal through `useProductModal().open`, without adding to the cart.

- [ ] `npm run build` passes.

- [ ] Checked with **Claude in Chrome** against `npm run dev` in this worktree: home and products at 1440px and 390px, light and dark. Results and screenshots saved with save_note.

- [ ] Use the **frontend-design** plugin for visual quality decisions.
