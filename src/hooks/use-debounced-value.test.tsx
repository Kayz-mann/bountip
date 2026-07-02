import { act, renderHook } from '@testing-library/react-native';

import { useDebouncedValue } from '@/hooks/use-debounced-value';

describe('useDebouncedValue', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('updates only once after several rapid changes', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'a' } },
    );

    expect(result.current).toBe('a');

    await rerender({ value: 'ab' });
    await rerender({ value: 'abc' });
    await rerender({ value: 'abcd' });

    // Still the original value until the debounce window elapses.
    expect(result.current).toBe('a');

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('abcd');
  });
});
