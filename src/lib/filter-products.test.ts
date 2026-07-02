import { filterProducts } from '@/lib/filter-products';
import { PRODUCT_FIXTURES } from '@/test-utils/fixtures';

describe('filterProducts', () => {
  it('returns everything when unfiltered', () => {
    expect(filterProducts(PRODUCT_FIXTURES, '', null)).toHaveLength(3);
  });

  it('matches titles case-insensitively and trims whitespace', () => {
    expect(filterProducts(PRODUCT_FIXTURES, '  BACKpack ', null).map((p) => p.id)).toEqual([1]);
  });

  it('filters by the raw category key', () => {
    expect(filterProducts(PRODUCT_FIXTURES, '', 'jewelery').map((p) => p.id)).toEqual([3]);
  });

  it('combines search and category', () => {
    expect(filterProducts(PRODUCT_FIXTURES, 'shirt', "men's clothing").map((p) => p.id)).toEqual([2]);
  });

  it('returns nothing when nothing matches', () => {
    expect(filterProducts(PRODUCT_FIXTURES, 'zzzzz', null)).toHaveLength(0);
  });
});
