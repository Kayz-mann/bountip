/** Product catalogue service functions, one per API endpoint. */

import { apiGet, ApiError } from '@/api/client';
import { isProduct, type Product } from '@/types/product';

export function getProducts(signal?: AbortSignal): Promise<Product[]> {
  return apiGet<unknown[]>('/products', signal).then((items) =>
    Array.isArray(items) ? items.filter(isProduct) : [],
  );
}

export function getCategories(signal?: AbortSignal): Promise<string[]> {
  return apiGet<unknown[]>('/products/categories', signal).then((items) =>
    Array.isArray(items) ? items.filter((c): c is string => typeof c === 'string') : [],
  );
}

/**
 * Returns `null` (not an error) when the product does not exist, so the
 * details screen can render a dedicated "not found" state instead of an
 * error-with-retry that would loop forever against the empty-body response.
 */
export async function getProduct(id: number, signal?: AbortSignal): Promise<Product | null> {
  try {
    const data = await apiGet<unknown>(`/products/${id}`, signal);
    return isProduct(data) ? data : null;
  } catch (error) {
    if (error instanceof ApiError && error.kind === 'notfound') return null;
    throw error;
  }
}
