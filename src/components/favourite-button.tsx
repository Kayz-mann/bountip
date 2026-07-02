import { Platform, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/hooks/use-theme';
import { selectIsFavourite, toggleFavourite } from '@/store/favourites-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const ACTIVE = '#FF3B30';

export function FavouriteButton({ productId, size = 22 }: { productId: number; size?: number }) {
  const dispatch = useAppDispatch();
  const isFavourite = useAppSelector(selectIsFavourite(productId));
  const haptics = useHaptics();
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => {
        dispatch(toggleFavourite(productId));
        haptics.impact();
      }}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityState={{ selected: isFavourite }}
      accessibilityLabel={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
      style={({ pressed }) => [Platform.OS === 'ios' && pressed ? styles.pressed : null]}>
      <ThemedText
        style={{
          fontSize: size,
          lineHeight: size + 2,
          color: isFavourite ? ACTIVE : theme.textSecondary,
        }}>
        {isFavourite ? '♥' : '♡'}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
});
