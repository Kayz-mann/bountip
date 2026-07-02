import { Platform, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const BRAND = '#208AEF';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onPress, variant = 'primary' }: ButtonProps) {
  const theme = useTheme();
  const backgroundColor = variant === 'primary' ? BRAND : theme.backgroundSelected;
  const color = variant === 'primary' ? '#ffffff' : theme.text;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{ color: theme.backgroundSelected }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        Platform.OS === 'ios' && pressed && styles.pressed,
      ]}>
      <ThemedText type="smallBold" style={{ color }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
