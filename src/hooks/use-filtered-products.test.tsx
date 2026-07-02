import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { type ReactNode } from 'react';
import { Provider } from 'react-redux';

import { useFilteredProducts } from '@/hooks/use-filtered-products';
import { emptyResponse, installFetch, jsonResponse } from '@/test-utils/api-mock';
import { CATEGORY_FIXTURES, makeProducts, PRODUCT_FIXTURES } from '@/test-utils/fixtures';
import { makeTestQueryClient, makeTestStore } from '@/test-utils/render-with-providers';

function installCatalogue(products = PRODUCT_FIXTURES) {
  installFetch((url) => {
    if (url.endsWith('/products/categories')) return jsonResponse(CATEGORY_FIXTURES);
    if (url.endsWith('/products')) return jsonResponse(products);
    return emptyResponse();
  });
}

function wrapperFor(store: ReturnType<typeof makeTestStore>) {
  const queryClient = makeTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </Provider>
    );
  };
}

describe('useFilteredProducts', () => {
  it('returns the first page of products when unfiltered', async () => {
    installCatalogue();
    const { result } = await renderHook(() => useFilteredProducts(), { wrapper: wrapperFor(makeTestStore()) });
    await waitFor(() => expect(result.current.products).toHaveLength(3));
  });

  it('filters by title, case-insensitively and trimmed', async () => {
    installCatalogue();
    const store = makeTestStore({ filters: { search: '  BACKpack ', activeCategory: null } });
    const { result } = await renderHook(() => useFilteredProducts(), { wrapper: wrapperFor(store) });
    await waitFor(() => expect(result.current.products.map((p) => p.id)).toEqual([1]));
  });

  it('filters by category on the raw lowercase key', async () => {
    installCatalogue();
    const store = makeTestStore({ filters: { search: '', activeCategory: 'jewelery' } });
    const { result } = await renderHook(() => useFilteredProducts(), { wrapper: wrapperFor(store) });
    await waitFor(() => expect(result.current.products.map((p) => p.id)).toEqual([3]));
  });

  it('reports no products but flags filtering when a filter matches nothing', async () => {
    installCatalogue();
    const store = makeTestStore({ filters: { search: 'zzzzz', activeCategory: null } });
    const { result } = await renderHook(() => useFilteredProducts(), { wrapper: wrapperFor(store) });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.products).toHaveLength(0);
    expect(result.current.isFiltering).toBe(true);
  });

  it('paginates client-side: first page, then load more', async () => {
    installCatalogue(makeProducts(15));
    const { result } = await renderHook(() => useFilteredProducts(), { wrapper: wrapperFor(makeTestStore()) });

    await waitFor(() => expect(result.current.products).toHaveLength(6));
    expect(result.current.hasNextPage).toBe(true);

    await act(async () => {
      await result.current.fetchNextPage();
    });
    await waitFor(() => expect(result.current.products).toHaveLength(12));

    await act(async () => {
      await result.current.fetchNextPage();
    });
    await waitFor(() => expect(result.current.products).toHaveLength(15));
    expect(result.current.hasNextPage).toBe(false);
  });
});
