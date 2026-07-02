import { render, screen } from '@testing-library/react-native';

import { RatingStars, starFills } from '@/components/product/rating-stars';

describe('starFills', () => {
  it('rounds to the nearest half star', () => {
    expect(starFills(3.9)).toEqual([1, 1, 1, 1, 0]);
    expect(starFills(3.7)).toEqual([1, 1, 1, 0.5, 0]);
    expect(starFills(0)).toEqual([0, 0, 0, 0, 0]);
    expect(starFills(5)).toEqual([1, 1, 1, 1, 1]);
  });
});

describe('RatingStars', () => {
  it('renders the numeric rating and count', async () => {
    await render(<RatingStars rate={3.9} count={120} />);
    expect(screen.getByText('3.9 (120)')).toBeTruthy();
  });

  it('renders nothing when the rating is absent', async () => {
    const { toJSON } = await render(<RatingStars rate={undefined} />);
    expect(toJSON()).toBeNull();
  });
});
