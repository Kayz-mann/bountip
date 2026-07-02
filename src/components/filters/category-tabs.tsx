import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/hooks/use-theme';
import { titleCase } from '@/lib/format';

interface CategoryTabsProps {
  categories: string[];
  /** null = "All". */
  active: string | null;
  onSelect: (category: string | null) => void;
  loading?: boolean;
}

export function CategoryTabs({ categories, active, onSelect, loading }: CategoryTabsProps) {
  const theme = useTheme();
  const haptics = useHaptics();

  if (loading && categories.length === 0) {
    return (
      <View style={styles.content}>
        {Array.from({ length: 4 }, (_, index) => (
          <View
            key={index}
            style={[styles.placeholder, { backgroundColor: theme.backgroundElement }]}
          />
        ))}
      </View>
    );
  }

  // null key = "All"; raw lowercase category is kept as the filter value (so the
  // upstream "jewelery" spelling still matches), only the label is title-cased.
  const items: { key: string | null; label: string }[] = [
    { key: null, label: 'All' },
    ...categories.map((category) => ({ key: category, label: titleCase(category) })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {items.map((item) => {
        const selected = item.key === active;
        return (
          <Pressable
            key={item.key ?? '__all__'}
            onPress={() => {
              onSelect(item.key);
              haptics.selection();
            }}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`Filter by ${item.label}`}
            android_ripple={{ color: theme.backgroundSelected }}
            style={[
              styles.chip,
              { backgroundColor: selected ? theme.text : theme.backgroundElement },
              Platform.OS === 'ios' && styles.chipShadow,
            ]}>
            <ThemedText type="small" style={{ color: selected ? theme.background : theme.text }}>
              {item.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.four,
  },
  chipShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  placeholder: {
    width: 72,
    height: 32,
    borderRadius: Spacing.four,
  },
});
