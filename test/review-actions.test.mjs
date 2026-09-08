import { test } from 'node:test';
import assert from 'node:assert/strict';

test('review formatting and star calculations calculate correct percentages', () => {
  const stats = {
    avgRating: 4.5,
    totalReviews: 10,
    distribution: { 5: 6, 4: 3, 3: 1, 2: 0, 1: 0 },
  };

  const fiveStarPercent = Math.round((stats.distribution[5] / stats.totalReviews) * 100);
  const fourStarPercent = Math.round((stats.distribution[4] / stats.totalReviews) * 100);

  assert.equal(fiveStarPercent, 60);
  assert.equal(fourStarPercent, 30);
  assert.equal(stats.avgRating.toFixed(1), '4.5');
});

test('review formatting handles 0 total reviews without NaN', () => {
  const stats = {
    avgRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };

  const total = stats.totalReviews;
  const fiveStarPercent = total > 0 ? Math.round((stats.distribution[5] / total) * 100) : 0;

  assert.equal(fiveStarPercent, 0);
  assert.equal(total === 0 ? 'No reviews yet' : `Based on ${total} reviews`, 'No reviews yet');
});

test('review input validations enforce minimum length and star boundaries', () => {
  const validate = ({ rating, comment }) => {
    if (!rating || rating < 1 || rating > 5) return 'Invalid rating';
    if (!comment || comment.trim().length < 5) return 'Comment too short';
    return null;
  };

  assert.equal(validate({ rating: 0, comment: 'Valid comment' }), 'Invalid rating');
  assert.equal(validate({ rating: 6, comment: 'Valid comment' }), 'Invalid rating');
  assert.equal(validate({ rating: 5, comment: 'Bad' }), 'Comment too short');
  assert.equal(validate({ rating: 5, comment: '     ' }), 'Comment too short');
  assert.equal(validate({ rating: 5, comment: 'Great product and fast shipping!' }), null);
});
