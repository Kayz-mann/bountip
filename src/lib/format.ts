/** Presentation helpers kept out of components for reuse and testability. */

// Reused across every price render; locale-aware grouping (e.g. "$1,234.50").
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Formats a price as USD currency, tolerant of missing/NaN values. */
export function formatPrice(price: number | null | undefined): string {
  if (typeof price !== 'number' || Number.isNaN(price)) return '—';
  return currencyFormatter.format(price);
}

/**
 * Title-cases a raw category string for display (e.g. "men's clothing" ->
 * "Men's Clothing"). Filtering still uses the raw lowercase key so the
 * upstream "jewelery" spelling is preserved.
 */
export function titleCase(value: string): string {
  // Capitalize the first letter of each whitespace-separated word only, so
  // apostrophes stay lowercase ("men's clothing" -> "Men's Clothing").
  return value.replace(/(^|\s)(\w)/g, (_, separator, char) => separator + char.toUpperCase());
}
