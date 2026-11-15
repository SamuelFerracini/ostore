# Follow phone color scheme, keep light/dark toggle

- Branch: `bugfix/color-mode-system-default`
- Target: `main`
- Source: prompt

## Plan

## Problem

The Nuxt storefront has full light (ivory/white/navy/gold) and dark (`midnight`) styles via Tailwind `dark:` variants, but users always see dark. `app/components/AppHeader.vue` (~line 86) runs `colorMode.preference = "dark";` on every load, overriding the visitor's choice and their OS setting. The light/dark toggle in `app/components/AppFooter.vue` (desktop footer and mobile phone bar) only works until reload.

## Goal

- First visit: follow the phone/OS setting (`prefers-color-scheme`).

- The toggle button is visible on desktop and mobile, switches light/dark, and the choice persists across reloads.

## Details

- Delete the forced `colorMode.preference = "dark";` line in `AppHeader.vue`, and the `useColorMode()` call there if nothing else uses it. Keep the comment pointing to AppFooter only if still accurate.

- In `nuxt.config.ts` set color mode to `preference: 'system'`, `fallback: 'light'` (check whether config goes under `colorMode` for the installed Nuxt UI / @nuxtjs/color-mode version).

- In `AppFooter.vue`, with preference `system`, icon and label must reflect the actual mode: base `colorModeIcon` and `colorModeLabel` on `colorMode.value`, not `colorMode.preference`. `toggleDark` should set an explicit `'light'`/`'dark'` from `colorMode.value`.

- Avoid hydration mismatch on the icon (e.g. wrap in `<ClientOnly>` or guard with `colorMode.unknown`).

- Confirm the toggle button shows on both the desktop footer and the mobile phone bar, in both modes, with enough contrast on the navy bar. Don't change the light palette.

## Verify

Use Claude in Chrome to open the dev server: check light pages look right (header, product list, product modal, cart, footer), toggle works, choice persists after reload, and with no saved choice the site follows the OS scheme. Check at phone width too.

## Done when

- [ ] No forced dark mode; default follows OS.

- [ ] Toggle visible and working on desktop and mobile, persists on reload.

- [ ] Build passes; commit on the branch.
