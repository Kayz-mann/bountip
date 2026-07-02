import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { getCategories, getProduct, getProducts } from '@/api/products';
import { queryKeys } from '@/hooks/queries/query-keys';
import { filterProducts } from '@/lib/filter-products';
import type { Product } from '@/types/product';

/** How many products to reveal per page in the infinite list. */
export const PRODUCTS_PAGE_SIZE = 6;

export interface ProductPage {
  items: Product[];
  nextPage: number | undefined;
}

/** All products (single fetch, cached). Used as the source for the infinite list and favourites. */
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.list(),
    queryFn: ({ signal }) => getProducts(signal),
  });
}

/**
 * Infinite, filtered product list. The Fake Store API has no server-side
 * pagination (it returns all ~20 items and ignores offset/page params), so the
 * catalogue is fetched once and paged client-side. Fetching the full list runs
 * through `fetchQuery` against the shared products cache, so it only hits the
 * network once regardless of how many pages are revealed. Filtering happens on
 * the complete set, so search results are never truncated by pagination.
 */
export function useInfiniteProducts(search: string, category: string | null) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: queryKeys.products.infinite(search, category),
    initialPageParam: 0,
    placeholderData: keepPreviousData,
    queryFn: async ({ pageParam }): Promise<ProductPage> => {
      const all = await queryClient.fetchQuery({
        queryKey: queryKeys.products.list(),
        queryFn: ({ signal }) => getProducts(signal),
      });
      const filtered = filterProducts(all, search, category);
      const start = pageParam * PRODUCTS_PAGE_SIZE;
      const items = filtered.slice(start, start + PRODUCTS_PAGE_SIZE);
      const nextPage = start + PRODUCTS_PAGE_SIZE < filtered.length ? pageParam + 1 : undefined;
      return { items, nextPage };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

/** Category strings for the filter tabs. */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: ({ signal }) => getCategories(signal),
  });
}

/**
 * A single product. Seeds `placeholderData` from the list cache so navigating
 * from a card paints instantly while the fresh fetch resolves. Resolves to
 * `null` when the product does not exist.
 */
export function useProduct(id: number) {
  const queryClient = useQueryClient();
  return useQuery<Product | null>({
    queryKey: queryKeys.products.detail(id),
    queryFn: ({ signal }) => getProduct(id, signal),
    enabled: Number.isInteger(id),
    placeholderData: () =>
      queryClient
        .getQueryData<Product[]>(queryKeys.products.list())
        ?.find((product) => product.id === id) ?? null,
  });
}
