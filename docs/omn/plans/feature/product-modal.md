# Product detail modal with gallery and ring sizes

- Branch: `feature/product-modal`
- Target: `main`
- Source: prompt

## Plan

# Product detail modal with gallery and ring sizes

## Problem

In the Nuxt 3 storefront (`app/`, a Thai shop reselling Pandora jewelry), clicking a product card does nothing. Customers can't see every photo of a product, and rings go into the cart without a size. A Cinderella-themed, Thai-first redesign was agreed (blue / white / gold). Mockups: https://claude.ai/artifact/4opiLkf65NkYV6sZaaPkxh (you may not be able to open it; the spec below is complete).

This is 1 of 3 parallel units:

- `feature/cinderella-theme-shell` owns the tokens, fonts, header, footer and `ProductCard.vue`. It makes the card call `useProductModal().open(product)`.

- `feature/cart-redesign` owns `app/pages/cart.vue` and the other cart components.

- **You own** `app/components/ProductModal.vue`, `app/composables/useProductModal.js`, the ring-size support in `stores/cart.ts`, and mounting the modal.

Don't restyle other files.

## Goal

A product modal that shows all of a product's images and, for rings, a size picker, with add-to-cart storing the chosen size.

## Details

### Shared tokens (another unit adds the same block, so keep it byte-identical)

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

And inside `theme.extend`, add `fontFamily: { display: ['"Cormorant Garamond"', 'serif'], 'display-th': ['"Noto Serif Thai"', 'serif'], sans: ['"IBM Plex Sans Thai"', 'system-ui', 'sans-serif'] },`. The theme unit loads the fonts.

### Shared composable (another unit creates the same file, so keep it byte-identical)

`app/composables/useProductModal.js`:

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

To test before the theme unit merges, add a temporary `@click` on the card image in `ProductCard.vue` that calls `open(product)`. **Revert it before you finish.** The theme unit owns that file.

### Cart store (`stores/cart.ts`, vuex)

- Add an optional `size?: string` to `CartItem` and a `key` field: `${id}::${size}` when there's a size, otherwise `id`.

- The same ring in 2 sizes becomes 2 lines. `addToCart` accepts `{ ...product, size }`.

- `updateQuantity`, `removeFromCart` and `isInCart` work by `key`. Keep backward compatibility: items in localStorage with no `key` get `key = id` on load. `isInCart(id)` still returns true if any line has that `id`.

- The cart unit will read `item.size` and call the actions with `item.key ?? item.id`. Don't change any other store behavior.

### The modal (`ProductModal.vue`, mounted once in `app/app.vue`; add only that one line there)

- **Images:** collect `primaryImage`, `hoverImage` and any `image2` or `images[]` fields. Dedupe and skip empty values. Shown on a `photo` (#F7F7F7) background.

- **Desktop (≥768px):** a centered dialog about 1120×740, white, `rounded-[28px]`, 4px gold top bar, navy 60% backdrop.
  - Left: a vertical thumbnail column (88×110, 2px border: gold when active, `gold-line` otherwise).
  - Then the main image in an arched frame: outer 1px `gold-arch` border, 6px padding, `border-radius: 50% 50% 22px 22px / 26% 26% 22px 22px`; inner `50% 50% 18px 18px / 25% 25% 18px 18px`.
  - Over the image: prev/next 44px white circle buttons, an "n / N" counter, and a gold "−NN%" badge. Compute NN against `market_thb` when it's above the price, otherwise against `originalPrice_normalised`; hide it when there's no saving.

- **Phone:** a bottom sheet (top offset about 40px, `rounded-t-[28px]`) with a grabber and a close button. The image is swipeable (`swiper` is installed) with dots. The CTA bar sticks to the bottom.

- **Details column:**
  - Thai category (`gold-text`).
  - Name in `font-display`, 44px desktop / 27px phone.
  - Price "2,149 ฿" (royal, 28px). Under it, "ราคาที่ช็อปไทย ~~3,465 ฿~~" when `market_thb` is set, otherwise "ปกติ ~~X ฿~~".
  - A savings pill "ประหยัด 1,316 ฿" (gold-soft bg, `#6E5418` text, a small gold star).

- **Rings** (in the `rings` category or the name contains "Ring"):
  - Fieldset with the legend "เลือกไซส์ (EU) · ไซส์ 52" (or "ยังไม่ได้เลือก" when nothing is picked) and a "วิธีวัดไซส์แหวน" link on the right. Ask the user later where it should point; use `#` for now.
  - Grid of 7 columns of 50px size buttons with `aria-pressed`:
    - Selected: royal bg, white text.
    - Available: white bg, `sky` border.
    - Unavailable (`available: false`): disabled, bg `#F2F2EF`, text `#7B8599`, line-through, aria-label "ไซส์ 50 หมด".
  - Legend: มีของ / หมด.

- **Info box** (`mist` bg): "ราคารวมกล่องและถุงแล้ว", "ราคาอาจเปลี่ยนแปลงตามโปรช่วงนั้น", "ต้องการใบเสร็จ ทักสอบถามได้นะคะ".

- **CTA row:**
  - A 56px gold pill, navy text: "ใส่ตะกร้า · ไซส์ 52". For a ring with no size picked: "เลือกไซส์ก่อน", disabled, bg `#EDE3C9`. Non-rings: "ใส่ตะกร้า".
  - If the item is already in the cart: "อยู่ในตะกร้าแล้ว" (royal) for that size.
  - A 56px wishlist heart button using the existing wishlist logic (`useWishlist`).
  - A text link "ดูบนเว็บ Pandora" to `product.link`, in a new tab.

- **Behavior:** close on Esc, backdrop click and the close button. Trap focus, return focus to the trigger, lock body scroll, `role="dialog"`, `aria-modal`, `aria-labelledby`. Respect `prefers-reduced-motion`. Dark mode: surfaces `midnight-surface`, text `#EEF2F8`, borders `midnight-line`, gold `#D8B868`.

## Done when

- [ ] The modal opens for any product with all its images. Rings show every size, sold-out sizes are disabled, and adding a ring stores its size as a separate cart line.

- [ ] Old localStorage carts still load.

- [x] The temporary `ProductCard.vue` click is reverted. `npm run build` passes.

- [ ] Checked with **Claude in Chrome** against `npm run dev` in this worktree: a ring and a non-ring, at 1440px and 390px, light and dark, plus keyboard-only use. Results saved with save_note.

- [ ] Use the **frontend-design** plugin for visual quality decisions.
