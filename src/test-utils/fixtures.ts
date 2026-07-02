import type { Product } from '@/types/product';

/** Small, deterministic product set mirroring the real fakestoreapi shape. */
export const PRODUCT_FIXTURES: Product[] = [
  {
    id: 1,
    title: 'Fjallraven Foldsack No. 1 Backpack',
    price: 109.95,
    description: 'Your perfect pack for everyday use and walks in the forest.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/1.jpg',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3,
    description: 'Slim-fitting style, contrast raglan long sleeve.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/2.jpg',
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: 'Solid Gold Petite Micropave Bracelet',
    price: 168,
    description: 'Satisfaction Guaranteed. Return or exchange any order within 30 days.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/3.jpg',
    // Intentionally no rating — exercises the optional-rating path.
  },
];

export const CATEGORY_FIXTURES: string[] = ["men's clothing", 'jewelery', 'electronics'];
