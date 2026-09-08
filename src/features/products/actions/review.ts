import api from '@/app/protected/protected';

export interface ReviewItem {
  _id: string;
  productId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  avgRating: number;
  totalReviews: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewsResponse {
  reviews: ReviewItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: ReviewStats;
}

export async function getReviewsByProduct(
  productId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewsResponse | null> {
  try {
    const res = await api.get(`/reviews/product/${productId}`, {
      params: { page, limit },
    });
    return res.data.metadata;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return null;
  }
}

export async function getUserReview(productId: string): Promise<ReviewItem | null> {
  try {
    const res = await api.get(`/reviews/product/${productId}/me`);
    return res.data.metadata?.review || null;
  } catch {
    // If not authenticated or error, silently return null
    return null;
  }
}

export async function submitProductReview(payload: {
  productId: string;
  rating: number;
  comment: string;
}): Promise<ReviewItem | null> {
  const res = await api.post('/reviews', payload);
  return res.data.metadata?.review || null;
}

export async function deleteProductReview(reviewId: string): Promise<boolean> {
  try {
    await api.delete(`/reviews/${reviewId}`);
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
}
