import { FlashList, type FlashListProps } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { RefreshControl, StyleSheet, View } from 'react-native';

import { ProductCard } from '@/components/product/product-card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  contentContainerStyle?: FlashListProps<Product>['contentContainerStyle'];
  onRefresh?: () => void;
  refreshing?: boolean;
}

/**
 * Scrollable list of product cards with tap-to-details navigation. Uses FlashList
 * for recycling-based performance. Shared by the catalogue and favourites screens
 * so the row layout and navigation stay in sync.
 */
export function ProductList({ products, contentContainerStyle, onRefresh, refreshing = false }: ProductListProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.fill}>
      <FlashList
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
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  separator: {
    height: Spacing.three,
  },
});
