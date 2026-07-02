import { favouritesReducer, toggleFavourite } from '@/store/favourites-slice';
import { filtersReducer, resetFilters, setCategory, setSearch } from '@/store/filters-slice';

describe('filters slice', () => {
  const initial = filtersReducer(undefined, { type: '@@INIT' });

  it('sets the search term', () => {
    expect(filtersReducer(initial, setSearch('backpack')).search).toBe('backpack');
  });

  it('sets and clears the active category', () => {
    const withCategory = filtersReducer(initial, setCategory('jewelery'));
    expect(withCategory.activeCategory).toBe('jewelery');
    expect(filtersReducer(withCategory, setCategory(null)).activeCategory).toBeNull();
  });

  it('resets all filters', () => {
    const dirty = filtersReducer(filtersReducer(initial, setSearch('x')), setCategory('y'));
    expect(filtersReducer(dirty, resetFilters())).toEqual(initial);
  });
});

describe('favourites slice', () => {
  const initial = favouritesReducer(undefined, { type: '@@INIT' });

  it('toggles a favourite on then off (idempotent)', () => {
    const added = favouritesReducer(initial, toggleFavourite(1));
    expect(added.ids).toEqual([1]);
    expect(favouritesReducer(added, toggleFavourite(1)).ids).toEqual([]);
  });

  it('keeps multiple distinct favourites', () => {
    const one = favouritesReducer(initial, toggleFavourite(1));
    const two = favouritesReducer(one, toggleFavourite(2));
    expect(two.ids).toEqual([1, 2]);
  });
});
