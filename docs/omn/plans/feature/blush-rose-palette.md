# Swap storefront palette to blush pink with rose gold

- Branch: `feature/blush-rose-palette`
- Target: `main`
- Source: prompt

## Plan

## Problem

The storefront uses a navy/royal blue palette with gold accents. The owner wants a pink look like Pandora's. They picked "Blush with rose gold" from a mockup.

## Goal

Change the whole storefront, light and dark mode, to blush/dusty rose with warm charcoal text. Gold accents stay and should read as rose gold next to the pink. Dark mode turns from midnight navy to a warm plum/charcoal.

## Details

Where the colors live:

- `tailwind.config.ts` holds the `colors` tokens: `ivory`, `mist`, `field`, `photo`, `sky`, `periwinkle`, `royal`, `navy`, `muted`, `gold.*`, `midnight.*`.

- `nuxt.config.ts` (around line 46) holds a `night` color set, used as `dark:text-night-*`.

- About 69 hex colors are typed directly into components and pages. Files include `Cart.vue`, `Checkout.vue`, `ProductCard.vue`, `ProductModal.vue`, `PaymentSuccessful.vue`, `PosterCanvas.vue`, `EmptyCart.vue`, `AdminBar.vue`, `ConfirmDialog.vue` and `pages/cart.vue`. Find them with `grep -rnE "#[0-9a-fA-F]{6}" app`. Also check `rgba(29,43,69,…)` shadows, which are navy.

Target palette (from the approved mockup):

| Role | Light | Dark |
|---|---|---|
| Page background | `#FFFAFA` | `#1E161A` |
| Main text (was navy) | `#2E2428` | `#F6E7EB` |
| Secondary text (was muted) | `#7A6A70` | `#C29AA6` |
| Lines / borders (was sky) | `#F2D5DC` | `#3A2A31` |
| Header / soft surface (was mist) | `#FBE8EC` | `#2A1E24` (surface) |
| Field / photo background | `#FDF1F3` | `#2A1E24` |
| Accent: active tabs, prices, links (was royal) | `#B5546E` | `#E8A3B4` |
| Light accent (was periwinkle) | `#E8A3B4` | `#F2BFCB` |
| Primary button | `#2E2428` bg, `#FFFAFA` text | `#E8A3B4` bg, `#1E161A` text |
| Rose gold (gold DEFAULT) | `#C9A06A` | `#C9A06A` |
| Arch frame line (gold.arch) | `#E6C9A8` | `#4A3A33` |

Retune the other `gold.*` shades (text, soft, line, light) toward rose gold to match. Keep `alizarin-crimson`, the error/discount red, as it is.

Approach:

1. Change token values in place first. Keep the token names so components don't need renaming. A rename such as `navy` to `ink` is out of scope.

2. Point the dark-mode `midnight` and `night` tokens at the plum/charcoal values above.

3. Replace hardcoded hex values and navy `rgba` shadows with the matching tokens. Use the nearest new hex only where a token can't be used, for example in canvas drawing code in `PosterCanvas.vue`.

4. Check contrast. Body text and button text must stay readable (WCAG AA) on their backgrounds in both themes.

Testing: start the app with the project script that brings the stack up (`run_project_script`). Don't wait for the user to switch to this worktree. Use Claude in Chrome to open `/products` (All Sales tab), a product modal, the cart and checkout, in light and dark mode. Confirm nothing is still blue.

## Done when

- [ ] No navy/blue colors remain anywhere in the storefront UI, light or dark.

- [ ] Light mode is blush/rose with charcoal text and rose-gold badges and arch frames, as in the table.

- [ ] Dark mode is warm plum/charcoal with pink accents.

- [ ] Text and buttons pass AA contrast in both themes.

- [ ] Existing tests and the build pass.
