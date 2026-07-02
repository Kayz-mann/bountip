import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FavouriteButton } from '@/components/favourite-button';
import { CategoryChip } from '@/components/product/category-chip';
import { ProductImage } from '@/components/product/product-image';
import { RatingStars } from '@/components/product/rating-stars';
import { ErrorView } from '@/components/state/error-view';
import { NotFoundView } from '@/components/state/not-found-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useProduct } from '@/hooks/queries/use-products';
import { useTheme } from '@/hooks/use-theme';
import { formatPrice } from '@/lib/format';

export function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { data: product, isLoading, isError, error, refetch } = useProduct(productId);

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator color={theme.text} />
      </ThemedView>
    );
  }

  if (isError) {
    return <ErrorView error={error} onRetry={() => refetch()} />;
  }

  if (!product) {
    return <NotFoundView onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))} />;
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: product.title }} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: theme.backgroundElement }]}>
          <ProductImage
            uri={product.image}
            contentFit="contain"
            accessibilityLabel={product.title}
            style={styles.image}
          />
        </View>

        <View style={styles.topRow}>
          <CategoryChip category={product.category} />
          <FavouriteButton productId={product.id} size={28} />
        </View>

        <ThemedText type="subtitle">{product.title}</ThemedText>

        <View style={styles.priceRow}>
          <ThemedText style={styles.price}>{formatPrice(product.price)}</ThemedText>
          {product.rating ? (
            <RatingStars rate={product.rating.rate} count={product.rating.count} size={18} />
          ) : null}
        </View>

        <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
          {product.description}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  hero: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 260,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    lineHeight: 22,
  },
});
