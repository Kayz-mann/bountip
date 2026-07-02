import { useProducts } from '@/hooks/queries/use-products';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { selectActiveCategory, selectSearch } from '@/store/filters-slice';
import { useAppSelector } from '@/store/hooks';

/**
 * Single source of truth for the list screen: joins server data (react-query)
 * with client filters (redux) and returns the visible products plus the flags
 * the screen needs to pick a view state.
 *
 * Search is client-side and debounced — fakestoreapi has no title-search
 * endpoint, and at ~20 items filtering in memory is the right call.
 */
export function useFilteredProducts() {
  const query = useProducts();
  const search = useAppSelector(selectSearch);
  const activeCategory = useAppSelector(selectActiveCategory);

  const normalizedSearch = useDebouncedValue(search.trim().toLowerCase(), 300);

  const all = query.data ?? [];
  const products = all.filter((product) => {
    const matchesCategory = !activeCategory || product.category === activeCategory;
    const matchesSearch = !normalizedSearch || product.title.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  return {
    products,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    dataUpdatedAt: query.dataUpdatedAt,
    hasData: all.length > 0,
    isFiltering: normalizedSearch.length > 0 || activeCategory != null,
    /** Raw (un-normalized) search text, for display in the empty state. */
    search,
  };
}
