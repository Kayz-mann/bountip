import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductList } from '@/components/product/product-list';
import { EmptyView } from '@/components/state/empty-view';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useProducts } from '@/hooks/queries/use-products';
import { selectFavouriteIds } from '@/store/favourites-slice';
import { useAppSelector } from '@/store/hooks';

export function FavouritesScreen() {
  const insets = useSafeAreaInsets();
  const favouriteIds = useAppSelector(selectFavouriteIds);
  const { data } = useProducts();

  // Cache-miss safe: only show favourites still present in the catalogue cache.
  const products = (data ?? []).filter((product) => favouriteIds.includes(product.id));

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {products.length === 0 ? (
        <EmptyView variant="favourites" />
      ) : (
        <ProductList
          products={products}
          contentContainerStyle={{
            paddingHorizontal: Spacing.three,
            paddingTop: Spacing.three,
            paddingBottom: insets.bottom + Spacing.four,
          }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
