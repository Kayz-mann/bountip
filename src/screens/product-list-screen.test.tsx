import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { installFetch, jsonResponse } from '@/test-utils/api-mock';
import { CATEGORY_FIXTURES, PRODUCT_FIXTURES } from '@/test-utils/fixtures';
import { renderWithProviders } from '@/test-utils/render-with-providers';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn(), canGoBack: () => true, replace: jest.fn() }),
}));

// Imported after the mock so the screen picks up the mocked router.
import { ProductListScreen } from '@/screens/product-list-screen';

describe('ProductListScreen', () => {
  beforeEach(() => mockPush.mockClear());

  it('walks the full loop: network error -> retry -> recover -> empty search', async () => {
    let productsFail = true;
    installFetch((url) => {
      if (url.endsWith('/products/categories')) return jsonResponse(CATEGORY_FIXTURES);
      if (url.endsWith('/products')) {
        if (productsFail) return Promise.reject(new TypeError('Network request failed'));
        return jsonResponse(PRODUCT_FIXTURES);
      }
      return jsonResponse([]);
    });

    await renderWithProviders(<ProductListScreen />);

    // 1. The initial fetch fails -> offline error state.
    expect(await screen.findByText('No internet connection')).toBeTruthy();

    // 2. Retry, this time the fetch succeeds -> products render.
    productsFail = false;
    await fireEvent.press(screen.getByLabelText('Try again'));
    expect(await screen.findByText(PRODUCT_FIXTURES[0].title)).toBeTruthy();

    // 3. A search with no matches -> empty state (debounced).
    await fireEvent.changeText(screen.getByLabelText('Search products by title'), 'zzzzz');
    expect(await screen.findByText('No products found')).toBeTruthy();
  });

  it('navigates to the product details route when a card is tapped', async () => {
    installFetch((url) => {
      if (url.endsWith('/products/categories')) return jsonResponse(CATEGORY_FIXTURES);
      if (url.endsWith('/products')) return jsonResponse(PRODUCT_FIXTURES);
      return jsonResponse([]);
    });

    await renderWithProviders(<ProductListScreen />);

    const card = await screen.findByLabelText(new RegExp(PRODUCT_FIXTURES[0].title));
    await fireEvent.press(card);

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith({ pathname: '/product/[id]', params: { id: '1' } }),
    );
  });
});
