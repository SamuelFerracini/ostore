# Rename header and footer wordmark to Nonlapan Pre Order

- Branch: `bugfix/header-footer-nonlapan-wordmark`
- Target: `main`
- Source: prompt

## Plan

## Problem

The Nuxt storefront in `app/` was renamed from "Pandora with Nonlapan" to "Nonlapan Pre Order". `siteName` in `app/app.config.ts`, the aria labels and `app/components/Logos/PandoraLogo.vue` were updated. But the header and footer wordmarks are hard-coded text and still show "Pandora" / "with Nonlapan".

## Goal

The header and footer show "Nonlapan" with "Pre Order", matching `app/components/Logos/PandoraLogo.vue`.

## Details

- `app/components/AppHeader.vue` (around lines 127-134): the big span reads `Pandora`. Change it to `Nonlapan`. The small italic span reads `with Nonlapan`. Change it to `Pre Order`. Keep the classes and the tiara SVG as they are.

- `app/components/AppFooter.vue` (around lines 74-77): `Pandora <em ...>with Nonlapan</em>`. Change it to `Nonlapan <em ...>Pre Order</em>`. Keep the classes.

- Do not touch `docs/omn/plans/**`. Those are historical plans.

- Afterwards, run `grep -rn "with Nonlapan" app` and make sure no customer-facing text is left. Fix any hit in `app/` the same way.

## Done when

- [x] Header and footer show "Nonlapan" / "Pre Order".

- [x] `grep -rn "with Nonlapan" app` finds nothing.

- [x] Build or typecheck passes.

- [x] Changes are committed on this branch.
