import { useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/hooks/queries/query-keys';
import { useInfiniteProducts } from '@/hooks/queries/use-products';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { selectActiveCategory, selectSearch } from '@/store/filters-slice';
import { useAppSelector } from '@/store/hooks';

/**
 * Single source of truth for the list screen: joins client filters (redux) with
 * the infinite, client-paged product query and exposes the visible products plus
 * the flags/handlers the screen needs (view state, pagination, refresh).
 *
 * Search is debounced so a keystroke doesn't spin up a new query per character.
 */
export function useFilteredProducts() {
  const queryClient = useQueryClient();
  const search = useAppSelector(selectSearch);
  const activeCategory = useAppSelector(selectActiveCategory);

  const normalizedSearch = useDebouncedValue(search.trim().toLowerCase(), 300);
  const query = useInfiniteProducts(normalizedSearch, activeCategory);

  const products = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    products,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    // Pull-to-refresh / retry: bust the catalogue cache so pages reload fresh.
    refetch: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
    isRefetching: query.isRefetching,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    dataUpdatedAt: query.dataUpdatedAt,
    isFiltering: normalizedSearch.length > 0 || activeCategory != null,
    /** Raw (un-normalized) search text, for display in the empty state. */
    search,
  };
}
