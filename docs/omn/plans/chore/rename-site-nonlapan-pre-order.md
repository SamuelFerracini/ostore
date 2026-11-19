# Rename site to Nonlapan Pre Order

- Branch: `chore/rename-site-nonlapan-pre-order`
- Target: `main`
- Source: prompt

## Plan

## Problem

The Nuxt storefront in `app/` is branded "Pandora with Nonlapan". The owner wants the shop name to be "Nonlapan Pre Order".

## Goal

Replace the site name "Pandora with Nonlapan" with "Nonlapan Pre Order" everywhere it shows in the app.

## Details

Known spots:

- `app/app.config.ts:2` — `siteName: "Pandora with Nonlapan"` → `siteName: "Nonlapan Pre Order"`

- `app/locales/en.js:145` — `"header.homeAria": "Pandora with Nonlapan home"` → `"Nonlapan Pre Order home"`

- `app/locales/th.js:145` — `"header.homeAria": "หน้าแรก Pandora with Nonlapan"` → `"หน้าแรก Nonlapan Pre Order"`

Grep `app/` once more (case-insensitive, `pandora with nonlapan`, excluding `node_modules`, `.nuxt`, `.output`) to catch anything else, such as page titles or meta tags. Do not change files under `docs/`. Do not change the Facebook URLs (`nonlapan.ssw`). Do not change other "Pandora" mentions (product/brand names).

## Done when

- [x] No "Pandora with Nonlapan" left in `app/` source.

- [ ] The app builds and existing tests pass.

- [ ] Changes committed on this branch.
