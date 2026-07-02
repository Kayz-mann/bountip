import { memo } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { FavouriteButton } from '@/components/favourite-button';
import { CategoryChip } from '@/components/product/category-chip';
import { ProductImage } from '@/components/product/product-image';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPrice, titleCase } from '@/lib/format';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onPress: (id: number) => void;
}

function ProductCardComponent({ product, onPress }: ProductCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onPress(product.id)}
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, ${formatPrice(product.price)}, ${titleCase(product.category)}`}
      android_ripple={{ color: theme.backgroundSelected }}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected },
        Platform.OS === 'ios' && pressed && styles.pressed,
      ]}>
      <ProductImage uri={product.image} recyclingKey={String(product.id)} style={styles.image} />

      <View style={styles.body}>
        <ThemedText type="smallBold" numberOfLines={2}>
          {product.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2} style={styles.description}>
          {product.description}
        </ThemedText>

        <View style={styles.footer}>
          <CategoryChip category={product.category} />
          <ThemedText type="smallBold">{formatPrice(product.price)}</ThemedText>
        </View>
      </View>

      <View style={styles.favourite}>
        <FavouriteButton productId={product.id} />
      </View>
    </Pressable>
  );
}

export const ProductCard = memo(ProductCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    // Soft lift in light mode; the hairline border carries dark mode.
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 1 },
    }),
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: Spacing.two,
  },
  body: {
    flex: 1,
    gap: Spacing.one,
  },
  description: {
    marginTop: Spacing.half,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  favourite: {
    paddingLeft: Spacing.one,
  },
});
