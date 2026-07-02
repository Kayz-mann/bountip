import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { type ReactNode } from 'react';

import { useProduct } from '@/hooks/queries/use-products';
import { emptyResponse, installFetch, jsonResponse } from '@/test-utils/api-mock';
import { PRODUCT_FIXTURES } from '@/test-utils/fixtures';
import { makeTestQueryClient } from '@/test-utils/render-with-providers';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = makeTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useProduct', () => {
  it('resolves null for an unknown id (200 with an empty body)', async () => {
    installFetch(() => emptyResponse());
    const { result } = await renderHook(() => useProduct(9999), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it('resolves the product for a valid id', async () => {
    installFetch(() => jsonResponse(PRODUCT_FIXTURES[0]));
    const { result } = await renderHook(() => useProduct(1), { wrapper });
    await waitFor(() => expect(result.current.data?.id).toBe(1));
  });
});
