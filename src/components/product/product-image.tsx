import { Image, type ImageContentFit } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, type StyleProp, type ImageStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

interface ProductImageProps {
  uri: string;
  /** Stable key so recycled FlatList rows never flash the previous image. */
  recyclingKey?: string;
  contentFit?: ImageContentFit;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
}

/**
 * expo-image wrapper with persistent disk caching. fakestore serves static
 * public URLs, so `memory-disk` (no re-download on scroll/revisit) is all the
 * caching this app needs — no filesystem layer, no blurhash (the API has none).
 */
export function ProductImage({
  uri,
  recyclingKey,
  contentFit = 'contain',
  style,
  accessibilityLabel,
}: ProductImageProps) {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);

  return (
    <Image
      source={failed ? undefined : { uri }}
      style={[styles.base, { backgroundColor: theme.backgroundElement }, style]}
      contentFit={contentFit}
      cachePolicy="memory-disk"
      transition={200}
      recyclingKey={recyclingKey ?? uri}
      onError={() => setFailed(true)}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
