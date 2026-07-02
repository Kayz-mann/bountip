import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/product/product-card';
import { EmptyView } from '@/components/state/empty-view';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useProducts } from '@/hooks/queries/use-products';
import { selectFavouriteIds } from '@/store/favourites-slice';
import { useAppSelector } from '@/store/hooks';

export function FavouritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const favouriteIds = useAppSelector(selectFavouriteIds);
  const { data } = useProducts();

  // Cache-miss safe: only show favourites still present in the catalogue cache.
  const products = (data ?? []).filter((product) => favouriteIds.includes(product.id));

  if (products.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <EmptyView variant="favourites" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={(id) => router.push({ pathname: '/product/[id]', params: { id: String(id) } })}
          />
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + Spacing.four }]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.three,
  },
  separator: {
    height: Spacing.three,
  },
});
