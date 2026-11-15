# Confirm dialog before removing from cart / favorites

- Branch: `feature/confirm-remove-cart-favorites`
- Target: `main`
- Source: prompt

## Plan

## Problem

Removing an item from the cart or un-favoriting a product (wishlist) happens instantly on one tap. Users remove items by accident. Only "clear cart" (ล้างตะกร้า) on `app/pages/cart.vue` has a confirm today (inline ยืนยัน / ยกเลิก swap, around line 317).

Nuxt 3 app, Nuxt UI v2 (`@nuxt/ui ^2.18.7`), Pinia-style/vuex-like `stores/cart.ts`, composables in `app/composables/` (`useCart.js`, `useWishlist.js`). UI copy is Thai.

## Goal

Show one shared small confirm modal before any removal from the cart or the favorites list. Adding (to cart / to favorites) stays instant, with no confirm.

## Details

- Build one reusable confirm dialog on Nuxt UI `UModal` (v2 API). Expose it through a composable, e.g. `useConfirm()` returning `confirm({ title, message, confirmLabel, cancelLabel }): Promise<boolean>`, with a single `<ConfirmDialog />` mounted once (e.g. in `app/app.vue`). Match the existing look: navy/gold tokens, dark mode classes, `min-h-[44px]` buttons, same focus ring style as cart.vue.

- Thai copy:
  - Cart: title "ลบสินค้าออกจากตะกร้า?", buttons "ลบออก" / "ยกเลิก". Include the product name in the message if easy.
  - Favorites: title "ลบออกจากรายการโปรด?", buttons "ลบออก" / "ยกเลิก".

- Wire it into every removal path:
  - `app/pages/cart.vue` trash button (~line 213, `removeFromCart`).
  - `app/components/Cart.vue` drawer trash button (~line 76).
  - `app/components/ProductCard.vue` cart toggle when item already in cart (~line 100).
  - `app/components/ProductModal.vue` cart remove (~line 127) and its own heart `onWish` (~line 140) when currently wishlisted.
  - `app/components/ButtonWishlist.vue` `toggle` when currently wishlisted (used on product cards, favorites page, product page). Emit `change` only after the action actually happened; cancel must leave state untouched and emit nothing.

- Keep "clear cart" as is (already has its own confirm). Do not change store logic in `stores/cart.ts` or `useWishlist.js` beyond what is needed.

- Dialog opened from inside ProductModal must layer above it and be usable (focus, Esc = cancel, backdrop click = cancel).

- Accessibility: focus lands on the dialog, Esc cancels, buttons have clear labels.

## Tools

- Claude in Chrome: run the dev server and verify each removal path in the browser (confirm removes, cancel keeps item), in light and dark mode and at phone width.

## Done when

- [ ] Every cart removal and every un-favorite path above shows the confirm; confirm removes, cancel keeps the item.

- [ ] Adding to cart / favorites shows no confirm.

- [ ] Dialog works inside ProductModal, on mobile width, and in dark mode.

- [ ] Build / typecheck passes; changes committed on the branch.
