import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ProductCard } from '@/components/product/product-card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Called near the end of the list to load the next page. */
  onEndReached?: () => void;
  /** Shows a footer spinner while the next page loads. */
  loadingMore?: boolean;
}

/**
 * Scrollable list of product cards with tap-to-details navigation and infinite
 * paging. Shared by the catalogue and favourites screens so the row layout and
 * navigation stay in sync.
 */
export function ProductList({
  products,
  contentContainerStyle,
  onRefresh,
  refreshing = false,
  onEndReached,
  loadingMore = false,
}: ProductListProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={(id) => router.push({ pathname: '/product/[id]', params: { id: String(id) } })}
        />
      )}
      contentContainerStyle={contentContainerStyle}
      ItemSeparatorComponent={Separator}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator color={theme.text} />
          </View>
        ) : null
      }
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.text}
            colors={[theme.text]}
          />
        ) : undefined
      }
    />
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    height: Spacing.three,
  },
  footer: {
    paddingVertical: Spacing.four,
  },
});
