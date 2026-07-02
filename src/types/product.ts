/**
 * Domain types for the fakestoreapi product catalogue.
 * See https://fakestoreapi.com/products for the response shape.
 */

/** Nested rating object. May be absent or partial on some products. */
export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  /** Not guaranteed by the API — always treat as optional. */
  rating?: Rating;
}

/**
 * Runtime type guard. The API is a public mock that occasionally returns
 * malformed rows; we drop anything missing the fields the UI depends on
 * rather than crashing the whole list.
 */
export function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === 'number' &&
    typeof p.title === 'string' &&
    typeof p.price === 'number' &&
    typeof p.category === 'string' &&
    typeof p.image === 'string'
  );
}
