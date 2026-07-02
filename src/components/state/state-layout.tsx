import { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

interface StateLayoutProps {
  emoji?: string;
  title: string;
  message?: string;
  children?: ReactNode;
}

/** Shared centered layout for the full-screen loading/empty/error/not-found states. */
export function StateLayout({ emoji, title, message, children }: StateLayoutProps) {
  return (
    <ThemedView style={styles.container}>
      {emoji ? <ThemedText style={styles.emoji}>{emoji}</ThemedText> : null}
      <ThemedText style={styles.title}>{title}</ThemedText>
      {message ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.message}>
          {message}
        </ThemedText>
      ) : null}
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  emoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    maxWidth: 280,
  },
});
