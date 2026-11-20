/**
 * Storefront toggles — edit here instead of environment variables.
 */
export default {
  /** When true, visitors only see the “no promotions” page (no shop UI). */
  promotionsPaused: false,
  /**
   * Salted SHA-256 hash of the admin password. Empty = admin mode cannot be
   * turned on. Make one with `npm run admin:hash`; never commit the password.
   */
  adminPasswordHash: "f0297f4ddc1a882b193f37424b0c92e1e8c0fab4d32e6bfb5ed3249c47739d1a",
};
