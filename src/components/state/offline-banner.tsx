import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

/** Slim, dismissible banner shown when offline but cached data is on screen. */
export function OfflineBanner({ updatedAt }: { updatedAt?: number }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const suffix = updatedAt ? ` · updated ${formatAge(updatedAt)}` : '';

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <ThemedText type="small" style={styles.text} numberOfLines={1}>
        Offline — showing saved catalogue{suffix}
      </ThemedText>
      <Pressable
        onPress={() => setDismissed(true)}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Dismiss offline notice">
        <ThemedText type="small" style={styles.text}>
          ✕
        </ThemedText>
      </Pressable>
    </View>
  );
}

function formatAge(timestamp: number): string {
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#B25E02',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  text: {
    color: '#ffffff',
  },
});
