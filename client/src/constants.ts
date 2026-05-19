/**
 * Application-wide constants.
 * Centralised here so magic numbers never appear inline in components.
 */

/** Default number of leads per page in the leads table */
export const DEFAULT_PAGE_SIZE = 10;

/** Maximum number of leads to include in a CSV export */
export const CSV_EXPORT_LIMIT = 1000;

/** Debounce delay in ms for the search input */
export const DEBOUNCE_DELAY_MS = 400;

/** localStorage key for the persisted Zustand auth store */
export const TOKEN_STORAGE_KEY = "gigflow-auth" as const;

/** localStorage key for the dark-mode preference */
export const THEME_STORAGE_KEY = "gigflow-theme" as const;
