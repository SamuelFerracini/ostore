# Floating Facebook chat button on desktop

- Branch: `feature/desktop-floating-facebook-chat`
- Target: `main`
- Source: prompt

## Plan

## Problem

On desktop (`lg` and up), the "ทักแชท Facebook" (message us on Facebook) button only lives in the desktop footer in `app/components/AppFooter.vue`. The footer sits at the end of the page, so users only see it after scrolling all the way down. This button is the shop's main contact channel, so most desktop visitors never find it.

On phone this is already solved: the `lg:hidden fixed` bottom bar in `AppFooter.vue` always shows a round Facebook button. Do not change the phone bar.

## Goal

On desktop, show a floating Facebook chat button that is always visible in the bottom-right corner, like a chat bubble. Keep the full desktop footer at the bottom of the page unchanged.

## Details

- Add the button in `AppFooter.vue` (or a small new component used there). Show it only on desktop (`max-lg:hidden`), with `position: fixed`, bottom-right.

- Use the same link as the footer: `facebookUrl` (`https://www.facebook.com/nonlapan.ssw`), `target="_blank" rel="noopener noreferrer"`.

- Style it as a pill with the Facebook icon in a gold circle plus the label "ทักแชท Facebook", matching the footer CTA. Use the existing tokens (`bg-navy`/`gold`/`gold-light`, plus the `dark:` variants used elsewhere). Give it a soft shadow so it stands out over page content. It must look right in light and dark mode.

- Touch target at least 48px tall. Give it an `aria-label`, a visible `:focus-visible` style (the global outline already applies) and `active:scale-95`.

- The scroll-to-top button in `app/app.vue` is `fixed bottom-24 lg:bottom-8 right-4 lg:right-6 z-50`. On desktop the two buttons must not overlap. Stack them: the chat button at the bottom-right, and the scroll-to-top button moved up above it (change its `lg:bottom-*` to clear the chat button with a gap). Phone positions stay as they are.

- When the user reaches the bottom, the floating button must not cover the footer's own Facebook CTA. Simplest acceptable approach: it may overlap the footer's navy area, as long as it does not cover the footer CTA or the dark mode toggle. If it does cover them, hide the floating button while the footer is in view (an IntersectionObserver on the `<footer>`, with a fade transition).

- Respect `prefers-reduced-motion` (the global rule in `app.vue` already handles transitions).

- Do not touch the shop note text or the phone bar.

## Done when

- [ ] At 1280px and 1440px widths, on the home page and a product list page, the floating chat button stays visible at every scroll position, does not overlap the scroll-to-top button, and does not cover the footer CTA at the bottom.

- [ ] Clicking it opens the Facebook page in a new tab.

- [ ] The phone layout (375px) looks the same as before.

- [ ] Checked in both light and dark mode with Claude in Chrome (use it to open the running app, resize, scroll and screenshot). Screenshots attached to the final report.

- [ ] The build and lint pass.
