/** Centralized query-key factory so keys stay consistent and typo-proof. */
export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: () => [...queryKeys.products.all, 'list'] as const,
    infinite: (search: string, category: string | null) =>
      [...queryKeys.products.all, 'infinite', { search, category }] as const,
    detail: (id: number) => [...queryKeys.products.all, 'detail', id] as const,
  },
  categories: () => ['categories'] as const,
};
