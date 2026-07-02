import { Button } from '@/components/button';
import { StateLayout } from '@/components/state/state-layout';

/**
 * Distinct from ErrorView: a missing product is a dead end, so we offer "go back"
 * rather than a Retry that would re-hit the same empty response forever.
 */
export function NotFoundView({ onBack }: { onBack?: () => void }) {
  return (
    <StateLayout
      emoji="🔍"
      title="Product not found"
      message="This product may have been removed.">
      {onBack ? <Button label="Back to catalogue" onPress={onBack} /> : null}
    </StateLayout>
  );
}
