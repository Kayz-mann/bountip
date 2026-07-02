import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import { Platform } from 'react-native';

/**
 * Thin haptics wrapper. No-ops on web and never rejects, so callers can fire
 * feedback without guarding every call site.
 */
export function useHaptics() {
  return useMemo(
    () => ({
      selection() {
        if (Platform.OS === 'web') return;
        Haptics.selectionAsync().catch(() => {});
      },
      impact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
        if (Platform.OS === 'web') return;
        Haptics.impactAsync(style).catch(() => {});
      },
    }),
    [],
  );
}
