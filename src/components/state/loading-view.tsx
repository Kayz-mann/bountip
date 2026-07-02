import { StyleSheet, View } from 'react-native';

import { SkeletonCard } from '@/components/product/skeleton-card';
import { Spacing } from '@/constants/theme';

/** Initial-load placeholder: a column of skeleton cards matching the real list. */
export function LoadingView({ count = 7 }: { count?: number }) {
  return (
    <View style={styles.container} accessibilityLabel="Loading products">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
});
