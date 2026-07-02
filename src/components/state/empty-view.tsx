import { Button } from '@/components/button';
import { StateLayout } from '@/components/state/state-layout';

interface EmptyViewProps {
  variant: 'search' | 'empty-data' | 'favourites';
  query?: string;
  onClear?: () => void;
}

/** Empty states: no search matches, an empty catalogue, or no favourites yet. */
export function EmptyView({ variant, query, onClear }: EmptyViewProps) {
  if (variant === 'search') {
    return (
      <StateLayout
        emoji="🔍"
        title="No products found"
        message={query ? `Nothing matched “${query}”. Try a different search.` : 'Try a different search.'}>
        {onClear ? <Button label="Clear search" variant="secondary" onPress={onClear} /> : null}
      </StateLayout>
    );
  }

  if (variant === 'favourites') {
    return (
      <StateLayout
        emoji="🤍"
        title="No favourites yet"
        message="Tap the heart on any product to save it here."
      />
    );
  }

  return (
    <StateLayout emoji="📦" title="No products available" message="Please check back later." />
  );
}
