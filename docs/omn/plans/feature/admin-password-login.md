# Admin mode behind a password only the owner knows

- Branch: `feature/admin-password-login`
- Target: `main`
- Source: prompt

## Plan

## Problem

Admin mode in this Nuxt storefront (client-side only, no backend auth) turns on with `?admin=1`. It is stored as `"1"` in the `ostore_admin` cookie. Anyone can guess the param or set the cookie by hand.

Relevant code:

- `app/composables/useAdmin.js`: reads `?admin`, sets the cookie, exposes `isAdmin` and `exit()`.

- `app/middleware/admin.js`: guards admin-only pages, for example `app/pages/admin/poster.vue`.

- `storefront.config.js`, exposed through `runtimeConfig.public` in `nuxt.config.ts`.

## Goal

Admin mode turns on only with a password that only the owner knows. The password is **never in the code or the repo**. The code stores only a salted SHA-256 hash of it.

## Details

- **Hash, not password:** add `adminPasswordHash` to `storefront.config.js` and expose it through `runtimeConfig.public`.
  - Hash input: a fixed salt prefix plus the password, for example `"ostore-admin:" + password`, as SHA-256 hex.
  - Commit an **empty** value. While it is empty, admin mode cannot be turned on.

- **Hash script:** add `scripts/admin-hash.mjs`. It reads the password from a hidden prompt or stdin, not from argv, so it stays out of shell history. It prints the hash to paste into the config. Add an npm script such as `admin:hash`.

- **Login form at `/admin`:** add `app/pages/admin/index.vue` with one password field and a submit button.
  - Correct password: store the password in the `ostore_admin` cookie, then go to `/products`.
  - Wrong password: show a short error.
  - Already admin: show that admin mode is on, plus the exit action.
  - The page itself is not guarded by the admin middleware.
  - Match the existing Nuxt UI style, light and dark mode, and work at 375px. Use i18n keys like the rest of the app.

- **Checking:** `isAdmin` is true only when hash(cookie value) equals `adminPasswordHash`, and the hash is not empty. A hand-made `ostore_admin=1` cookie must fail.
  - Use a **synchronous** SHA-256 so SSR and client agree on the first render. A small dependency such as `js-sha256` or a tiny inline implementation is fine. `crypto.subtle` is async.
  - Put the check in one shared helper that both `useAdmin` and `middleware/admin.js` use.

- **URL param:**
  - `?admin=1` no longer turns admin mode on.
  - `?admin=0` still turns admin mode off: clear the cookie.
  - `exit()` keeps working: clear the cookie and leave `/admin/*` pages.
  - The admin bar and its exit button stay as they are.

- **README:** add a short note on how to set or rotate the password with the hash script. Rotating the password logs out every old admin cookie.

- **Testing locally:** use a throwaway password and its hash only in the working copy. Do not leave a real hash in the committed config.

- Update the comments in `useAdmin.js` and `middleware/admin.js` that mention `?admin=1`.

- Add unit tests under `tests/` (`node --test`) for the hash helper and the admin check:
  - right password: admin
  - wrong password: not admin
  - cookie `"1"`: not admin
  - empty configured hash: never admin

## Verify

Start the app with `npm run dev` in this worktree. Use Claude in Chrome to check:

1. `/products?admin=1` shows no admin UI.

2. Setting the cookie `ostore_admin=1` by hand shows no admin UI.

3. `/admin` with a wrong password shows the error.

4. The right password turns on admin mode, and it survives a reload.

5. `/admin/poster` opens.

6. `?admin=0` and the exit button both turn admin mode off.

Check the login page at 375px and at desktop width, in light and dark mode.

## Done when

- [ ] The password exists nowhere in the repo. Only an empty `adminPasswordHash` is committed.

- [ ] All checks in Verify pass, and `npm test` passes.

- [ ] The README explains `npm run admin:hash` and where to paste the hash.
