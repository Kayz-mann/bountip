import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { type ReactNode } from 'react';
import { Provider } from 'react-redux';

import { useFilteredProducts } from '@/hooks/use-filtered-products';
import { emptyResponse, installFetch, jsonResponse } from '@/test-utils/api-mock';
import { CATEGORY_FIXTURES, PRODUCT_FIXTURES } from '@/test-utils/fixtures';
import { makeTestQueryClient, makeTestStore } from '@/test-utils/render-with-providers';

function installCatalogue() {
  installFetch((url) => {
    if (url.endsWith('/products/categories')) return jsonResponse(CATEGORY_FIXTURES);
    if (url.endsWith('/products')) return jsonResponse(PRODUCT_FIXTURES);
    return emptyResponse();
  });
}

function wrapperFor(store: ReturnType<typeof makeTestStore>) {
  const queryClient = makeTestQueryClient();
  return ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}

describe('useFilteredProducts', () => {
  it('returns all products when unfiltered', async () => {
    installCatalogue();
    const { result } = await renderHook(() => useFilteredProducts(), { wrapper: wrapperFor(makeTestStore()) });
    await waitFor(() => expect(result.current.hasData).toBe(true));
    expect(result.current.products).toHaveLength(3);
  });

  it('filters by title, case-insensitively and trimmed', async () => {
    installCatalogue();
    const store = makeTestStore({ filters: { search: '  BACKpack ', activeCategory: null } });
    const { result } = await renderHook(() => useFilteredProducts(), { wrapper: wrapperFor(store) });
    await waitFor(() => expect(result.current.hasData).toBe(true));
    expect(result.current.products.map((p) => p.id)).toEqual([1]);
  });

  it('filters by category on the raw lowercase key', async () => {
    installCatalogue();
    const store = makeTestStore({ filters: { search: '', activeCategory: 'jewelery' } });
    const { result } = await renderHook(() => useFilteredProducts(), { wrapper: wrapperFor(store) });
    await waitFor(() => expect(result.current.hasData).toBe(true));
    expect(result.current.products.map((p) => p.id)).toEqual([3]);
  });

  it('reports no products but keeps hasData when a filter matches nothing', async () => {
    installCatalogue();
    const store = makeTestStore({ filters: { search: 'zzzzz', activeCategory: null } });
    const { result } = await renderHook(() => useFilteredProducts(), { wrapper: wrapperFor(store) });
    await waitFor(() => expect(result.current.hasData).toBe(true));
    expect(result.current.products).toHaveLength(0);
    expect(result.current.isFiltering).toBe(true);
  });
});
