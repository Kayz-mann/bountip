/** Presentation helpers kept out of components for reuse and testability. */

/** Formats a price as USD currency, tolerant of missing/NaN values. */
export function formatPrice(price: number | null | undefined): string {
  if (typeof price !== 'number' || Number.isNaN(price)) return '—';
  return `$${price.toFixed(2)}`;
}

/**
 * Title-cases a raw category string for display (e.g. "men's clothing" ->
 * "Men's Clothing"). Filtering still uses the raw lowercase key so the
 * upstream "jewelery" spelling is preserved.
 */
export function titleCase(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}
