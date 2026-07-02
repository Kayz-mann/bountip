import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

const FILLED = '#F5A623';
const EMPTY = '#C9CDD2';

/** Fill level (0, 0.5, or 1) for each of the 5 stars, rounded to the nearest half. */
export function starFills(rate: number): (0 | 0.5 | 1)[] {
  const rounded = Math.round(rate * 2) / 2;
  return Array.from({ length: 5 }, (_, index) => {
    const position = index + 1;
    if (rounded >= position) return 1;
    if (rounded + 0.5 === position) return 0.5;
    return 0;
  });
}

interface RatingStarsProps {
  rate?: number;
  count?: number;
  size?: number;
}

/** Renders half-star ratings with a numeric label. Renders nothing if rating is absent. */
export function RatingStars({ rate, count, size = 14 }: RatingStarsProps) {
  if (rate == null || Number.isNaN(rate)) return null;

  const label =
    count != null
      ? `Rated ${rate.toFixed(1)} out of 5, ${count} ratings`
      : `Rated ${rate.toFixed(1)} out of 5`;

  return (
    <View style={styles.row} accessible accessibilityLabel={label}>
      {starFills(rate).map((fill, index) => (
        <Star key={index} fill={fill} size={size} />
      ))}
      <ThemedText type="small" themeColor="textSecondary" style={styles.count}>
        {rate.toFixed(1)}
        {count != null ? ` (${count})` : ''}
      </ThemedText>
    </View>
  );
}

function Star({ fill, size }: { fill: 0 | 0.5 | 1; size: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <ThemedText style={[styles.glyph, { fontSize: size, lineHeight: size, color: EMPTY }]}>★</ThemedText>
      {fill > 0 ? (
        <View style={[styles.overlay, { width: fill === 1 ? size : size / 2 }]}>
          <ThemedText style={[styles.glyph, { fontSize: size, lineHeight: size, color: FILLED }]}>★</ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  glyph: {
    fontSize: 14,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
  count: {
    marginLeft: Spacing.one,
  },
});
