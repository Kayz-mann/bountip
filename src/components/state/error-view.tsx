import { ApiError } from '@/api/client';
import { Button } from '@/components/button';
import { StateLayout } from '@/components/state/state-layout';

interface ErrorViewProps {
  error: unknown;
  onRetry?: () => void;
}

/** Maps the typed error to human copy so "offline" reads differently from "server down". */
function describe(error: unknown): { emoji: string; title: string; message: string } {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case 'network':
        return {
          emoji: '📡',
          title: 'No internet connection',
          message: 'Check your connection and try again.',
        };
      case 'http':
        return {
          emoji: '🛠️',
          title: 'Something went wrong',
          message: `We couldn’t reach the store${error.status ? ` (${error.status})` : ''}. Please try again.`,
        };
      case 'parse':
        return {
          emoji: '🛠️',
          title: 'Unexpected response',
          message: 'The store sent something we couldn’t read. Please try again.',
        };
      case 'notfound':
        return {
          emoji: '🔍',
          title: 'Not found',
          message: 'We couldn’t find what you were looking for.',
        };
    }
  }
  return { emoji: '🛠️', title: 'Something went wrong', message: 'Please try again.' };
}

export function ErrorView({ error, onRetry }: ErrorViewProps) {
  const { emoji, title, message } = describe(error);
  return (
    <StateLayout emoji={emoji} title={title} message={message}>
      {onRetry ? <Button label="Try again" onPress={onRetry} /> : null}
    </StateLayout>
  );
}
