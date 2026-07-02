import type { Product } from '@/types/product';

/**
 * Filters products by (debounced) search text and category. Search is
 * case-insensitive and trimmed; a null category means "All".
 */
export function filterProducts(
  products: Product[],
  search: string,
  category: string | null,
): Product[] {
  const query = search.trim().toLowerCase();
  return products.filter((product) => {
    const matchesCategory = !category || product.category === category;
    const matchesSearch = !query || product.title.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
}
