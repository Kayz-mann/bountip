import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Placeholder that matches the ProductCard footprint so the list doesn't jump
 * when real data arrives. Uses the built-in Animated API (no reanimated) for a
 * gentle opacity pulse that works cleanly in tests.
 */
export function SkeletonCard() {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const block = { backgroundColor: theme.backgroundSelected } as const;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <Animated.View style={[styles.image, block, { opacity }]} />
      <View style={styles.body}>
        <Animated.View style={[styles.line, styles.lineWide, block, { opacity }]} />
        <Animated.View style={[styles.line, styles.lineMid, block, { opacity }]} />
        <Animated.View style={[styles.line, styles.lineNarrow, block, { opacity }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: Spacing.two,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.two,
  },
  line: {
    height: 12,
    borderRadius: Spacing.half,
  },
  lineWide: { width: '90%' },
  lineMid: { width: '70%' },
  lineNarrow: { width: '40%' },
});
