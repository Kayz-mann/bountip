import * as Network from 'expo-network';
import { useRouter } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryTabs } from '@/components/filters/category-tabs';
import { SearchBar } from '@/components/filters/search-bar';
import { ProductCard } from '@/components/product/product-card';
import { EmptyView } from '@/components/state/empty-view';
import { ErrorView } from '@/components/state/error-view';
import { LoadingView } from '@/components/state/loading-view';
import { OfflineBanner } from '@/components/state/offline-banner';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/queries/use-products';
import { useFilteredProducts } from '@/hooks/use-filtered-products';
import { useTheme } from '@/hooks/use-theme';
import { selectActiveCategory, selectSearch, setCategory, setSearch } from '@/store/filters-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function ProductListScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const search = useAppSelector(selectSearch);
  const activeCategory = useAppSelector(selectActiveCategory);
  const categoriesQuery = useCategories();
  const { products, isLoading, isError, error, refetch, isRefetching, dataUpdatedAt, hasData, isFiltering } =
    useFilteredProducts();

  const network = Network.useNetworkState();
  const isOffline = network.isConnected === false;

  const clearFilters = () => {
    dispatch(setSearch(''));
    dispatch(setCategory(null));
  };

  const header = (
    <View style={styles.header}>
      <View style={styles.searchWrap}>
        <SearchBar
          value={search}
          onChangeText={(text) => dispatch(setSearch(text))}
          onClear={() => dispatch(setSearch(''))}
        />
      </View>
      <CategoryTabs
        categories={categoriesQuery.data ?? []}
        active={activeCategory}
        onSelect={(category) => dispatch(setCategory(category))}
        loading={categoriesQuery.isLoading}
      />
    </View>
  );

  const renderBody = () => {
    if (isLoading) return <LoadingView />;
    if (isError && !hasData) return <ErrorView error={error} onRetry={() => refetch()} />;
    if (products.length === 0) {
      return (
        <EmptyView
          variant={isFiltering ? 'search' : 'empty-data'}
          query={search}
          onClear={isFiltering ? clearFilters : undefined}
        />
      );
    }

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
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={theme.text}
            colors={[theme.text]}
          />
        }
      />
    );
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {isOffline && hasData ? <OfflineBanner updatedAt={dataUpdatedAt} /> : null}
      {header}
      {renderBody()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing.two,
    gap: Spacing.two,
  },
  searchWrap: {
    paddingHorizontal: Spacing.three,
  },
  listContent: {
    padding: Spacing.three,
  },
  separator: {
    height: Spacing.three,
  },
});
