import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getCategories, getProduct, getProducts } from '@/api/products';
import { queryKeys } from '@/hooks/queries/query-keys';
import type { Product } from '@/types/product';

/** All products. Server state — owns loading/error/refetch. */
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.list(),
    queryFn: ({ signal }) => getProducts(signal),
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
