import { fireEvent, screen } from '@testing-library/react-native';

import { ProductCard } from '@/components/product/product-card';
import { PRODUCT_FIXTURES } from '@/test-utils/fixtures';
import { renderWithProviders } from '@/test-utils/render-with-providers';

describe('ProductCard', () => {
  const product = PRODUCT_FIXTURES[0];

  it('renders the title, price and title-cased category', async () => {
    await renderWithProviders(<ProductCard product={product} onPress={jest.fn()} />);
    expect(screen.getByText(product.title)).toBeTruthy();
    expect(screen.getByText('$109.95')).toBeTruthy();
    expect(screen.getByText("Men's Clothing")).toBeTruthy();
  });

  it('calls onPress with the product id when tapped', async () => {
    const onPress = jest.fn();
    await renderWithProviders(<ProductCard product={product} onPress={onPress} />);
    await fireEvent.press(screen.getByLabelText(new RegExp(product.title)));
    expect(onPress).toHaveBeenCalledWith(product.id);
  });
});
