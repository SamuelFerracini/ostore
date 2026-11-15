# Cart redesign: Thai-first bag, order steps, empty state

- Branch: `feature/cart-redesign`
- Target: `main`
- Source: prompt

## Plan

# Cart redesign: Thai-first bag, order steps, empty state

## Problem

The cart page (`app/pages/cart.vue`) of the Nuxt 3 storefront (a Thai shop reselling Pandora jewelry) uses a black/purple look with English labels: "Shopping Cart", "Order Summary", a purple "Copy to Clipboard" button, a big "Clear Cart" button. The real ordering flow is only hinted at by "แคปหน้าจอแล้วทักแม่ค้าได้เลยยยย" and a bare "Facebook" link. A Cinderella-themed, Thai-first redesign was agreed (blue / white / gold). Mockups: https://claude.ai/artifact/4opiLkf65NkYV6sZaaPkxh (you may not be able to open it; the spec below is complete).

This is 1 of 3 parallel units:

- `feature/cinderella-theme-shell` owns the tokens, fonts, header, footer and product cards.

- `feature/product-modal` owns `ProductModal.vue` and adds ring sizes to `stores/cart.ts`.

- **You own** `app/pages/cart.vue`, `app/components/Cart.vue` (the header mini cart), `app/components/EmptyCart.vue`, `app/components/Checkout.vue` and `app/components/PaymentSuccessful.vue`.

Don't edit `stores/cart.ts`, the header, the footer or the product cards.

## Goal

Restyle the cart, mini cart, empty cart and payment screens to the new design, with Thai copy and a clear 3-step ordering flow.

## Details

### Shared tokens (other units add the same block, so keep it byte-identical)

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

### Ring sizes (coming from the modal unit)

Cart items may get `size` and `key` fields. Write the code so it works both with and without them:

- Call `updateQuantity` and `removeFromCart` with `item.key ?? item.id`.

- Show a size chip when `item.size` is set.

- Use `item.key ?? item.id` as the `v-for` key.

### Cart page (`cart.vue`)

Max width 1200px, `ivory` background. Light and dark (dark: `midnight` bg, `midnight-surface` cards, `midnight-line` borders, text `#EEF2F8`, gold `#D8B868`).

- **Top row:** "← เลือกซื้อต่อ" back link (44px min height), the H1 "ตะกร้าของฉัน" in `font-display-th` 32px, and "N ชิ้น".

- **Item list** (left, `flex: 999 1 520px`): each item is a white card with 1px `gold-line` border, `rounded-[20px]` and 14px padding.
  - A 96×124 arched thumbnail: outer 1px `gold-arch` border, 3px padding, `border-radius: 50% 50% 12px 12px / 30% 30% 12px 12px`; inner `photo` bg showing `primaryImage`.
  - Name in `font-display` 21px. The line total, right-aligned, in royal 18px.
  - A meta row:
    - A size chip "ไซส์ 52" (`mist` bg) when the item has a size.
    - "1,005 ฿ / ชิ้น".
    - A reference price: "ช็อปไทย ~~X ฿~~" when `market_thb` is set, or "ปกติ ~~X ฿~~" from `originalPrice_normalised` when it's above the price.
  - Bottom row: a quantity stepper (pill with `sky` border, 44×40 −/+ buttons, `aria-live` count) and a text button "ลบ" with a trash icon (muted, not red).

- **Summary card** (right, `flex: 1 1 340px`; it stacks under the list on phones): white, `rounded-[24px]`, 4px gold top bar.
  - Heading "สรุปคำสั่งซื้อ".
  - A `dl` with:
    - "ราคาสินค้า (N ชิ้น)" and the subtotal.
    - "กล่องและถุง" with "รวมแล้ว".
    - "ยอดรวม" with the total in royal 26px.
  - A savings note "ประหยัดไป X ฿ เทียบราคาปกติ" (gold-soft bg, `#6E5418` text, a small gold star). X sums the per-unit reference minus price, times quantity. Hide it when X is 0.
  - **Numbered steps** (navy circles):
    1. "คัดลอกรายการ หรือแคปหน้าจอนี้"
    2. "ทักแม่ค้าทาง Facebook แล้ววางรายการ"
    3. "แม่ค้ายืนยันยอดและวิธีชำระเงิน"
  - **Primary 54px gold pill, navy text: "คัดลอกรายการสั่งซื้อ"** with a copy icon. It keeps the existing clipboard logic, with the copied text changed to Thai labels and the ring size added per line. After copying it shows "คัดลอกแล้ว วางในแชทได้เลย" with a check icon for 2.5s (`mist` bg), announced through `aria-live`. On failure, show an inline Thai error, not `alert()`.
  - **Secondary 54px royal pill: "ทักแม่ค้าทาง Facebook"** with the FB icon. It keeps the current link target (`https://www.facebook.com/share/1AmvwsRi18/?mibextid=wwXIfr`) and opens in a new tab.
  - "ล้างตะกร้า" as a small underlined muted text button. Replace `confirm()` with an inline confirm: the first tap changes it to "ยืนยันล้างตะกร้า?" with ยืนยัน / ยกเลิก.
  - Footnote: "ราคาอาจเปลี่ยนแปลงตามโปรช่วงนั้น · ต้องการใบเสร็จทักสอบถามได้นะคะ".

- **Prices:** use thousands separators everywhere, as "1,005 ฿".

### Other components

- **Empty cart (`EmptyCart.vue` and the empty branch of the page):** a centered 220px `mist` circle with a line-art glass-slipper SVG (navy stroke, periwinkle and gold accents) and 2 sparkle stars. Under it:
  - H2 "ตะกร้ายังว่างอยู่".
  - Text "ยังมีเวลาก่อนเที่ยงคืน / มาหาชิ้นที่ใช่กันเถอะ".
  - A gold pill "เลือกซื้อสินค้า" linking to `/products`.
  - Category pills แหวน / ชาร์ม / ลดราคา.

- **Mini cart (`Cart.vue`):** the same tokens, compact rows (thumbnail, name, size, price), a total, a gold "ดูตะกร้า" button, and Thai labels.

- **`Checkout.vue` and `PaymentSuccessful.vue`:** replace the green/purple with gold/royal and translate the visible copy to Thai. For success, a small midnight-clock or sparkle motif is fine. Don't change the payment logic.

- **Accessibility:** buttons at least 44px, a `:focus-visible` ring (3px `periwinkle`), Thai `aria-label`s on icon buttons.

## Done when

- [ ] The cart, empty cart, mini cart, checkout and success screens match the spec in light and dark, at 1440px and 390px.

- [ ] Copy, the Facebook link, quantity, remove and inline clear all work. A cart with and without `size` fields renders correctly; test by putting a `size` on a localStorage item.

- [ ] `npm run build` passes.

- [ ] Checked with **Claude in Chrome** against `npm run dev` in this worktree. Results and screenshots saved with save_note.

- [ ] Use the **frontend-design** plugin for visual quality decisions.
