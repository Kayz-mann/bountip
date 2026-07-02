import { formatPrice, titleCase } from '@/lib/format';

describe('formatPrice', () => {
  it('formats a number as USD currency', () => {
    expect(formatPrice(109.95)).toBe('$109.95');
  });

  it('pads whole numbers to two decimals', () => {
    expect(formatPrice(168)).toBe('$168.00');
  });

  it('falls back to a dash for missing or invalid values', () => {
    expect(formatPrice(undefined)).toBe('—');
    expect(formatPrice(null)).toBe('—');
    expect(formatPrice(Number.NaN)).toBe('—');
  });
});

describe('titleCase', () => {
  it('title-cases each word', () => {
    expect(titleCase("men's clothing")).toBe("Men's Clothing");
  });

  it('leaves the upstream "jewelery" spelling intact', () => {
    expect(titleCase('jewelery')).toBe('Jewelery');
  });
});
