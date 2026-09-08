'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ReviewItem, ReviewStats } from '../../actions/review';

interface ReviewListProps {
  reviews: ReviewItem[];
  stats: ReviewStats;
  currentUserId?: string;
  onEditReview?: (review: ReviewItem) => void;
  onDeleteReview?: (reviewId: string) => void;
  isDeleting?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  stats,
  currentUserId,
  onEditReview,
  onDeleteReview,
  isDeleting = false,
}) => {
  const total = stats.totalReviews || reviews.length;
  const avg = stats.avgRating || 0;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Overview / Stats Card */}
      <div className="p-6 bg-[#f8fbfc] border border-[#dce3e5] rounded-sm flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
        {/* Left: Overall Score */}
        <div className="flex flex-col items-center justify-center min-w-[180px] text-center">
          <div className="text-5xl font-bold text-[#171717]">{avg > 0 ? avg.toFixed(1) : '0.0'}</div>
          <div className="flex items-center gap-1 my-2 text-[#f59e0b] text-base">
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesomeIcon
                key={star}
                icon={faStar}
                className={star <= Math.round(avg) ? 'text-[#f59e0b]' : 'text-slate-300'}
              />
            ))}
          </div>
          <span className="text-sm text-[#48515b]">
            {total === 0 ? 'No reviews yet' : `Based on ${total} ${total === 1 ? 'review' : 'reviews'}`}
          </span>
        </div>

        {/* Right: Star Breakdown Progress Bars */}
        <div className="flex-1 w-full max-w-[450px] flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((ratingNum) => {
            const count = stats.distribution?.[ratingNum as keyof typeof stats.distribution] || 0;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={ratingNum} className="flex items-center gap-3 text-xs sm:text-sm text-[#48515b]">
                <span className="w-12 font-medium flex items-center gap-1">
                  {ratingNum} <FontAwesomeIcon icon={faStar} className="text-[#f59e0b] text-xs" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#f59e0b] transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[#5e6d73] text-xs">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-[#171717]">
          Customer Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[#dce3e5] bg-white rounded-sm">
            <p className="text-[#48515b] text-sm">
              There are no reviews yet. Be the first to share your thoughts about this product!
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#dce3e5] border border-[#dce3e5] bg-white rounded-sm">
            {reviews.map((rev) => {
              const isAuthor = currentUserId && rev.userId?._id === currentUserId;
              const authorName = rev.userId?.name || 'Anonymous User';
              const initialLetter = authorName.charAt(0).toUpperCase() || 'U';

              return (
                <div key={rev._id} className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#0573f0]/10 text-[#0573f0] font-bold flex items-center justify-center border border-[#0573f0]/20 text-sm">
                        {initialLetter}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#171717]">{authorName}</span>
                          {isAuthor && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#0573f0] text-white rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#5e6d73]">{formatDate(rev.createdAt)}</span>
                      </div>
                    </div>

                    {/* Action buttons for author */}
                    {isAuthor && (
                      <div className="flex items-center gap-2">
                        {onEditReview && (
                          <button
                            type="button"
                            onClick={() => onEditReview(rev)}
                            className="p-1.5 text-xs text-[#48515b] hover:text-[#0573f0] transition-colors cursor-pointer"
                            title="Edit your review"
                          >
                            <FontAwesomeIcon icon={faPen} className="mr-1" />
                            Edit
                          </button>
                        )}
                        {onDeleteReview && (
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => onDeleteReview(rev._id)}
                            className="p-1.5 text-xs text-[#e5484d] hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
                            title="Delete your review"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-1" />
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-[#f59e0b] text-xs">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FontAwesomeIcon
                        key={s}
                        icon={faStar}
                        className={s <= rev.rating ? 'text-[#f59e0b]' : 'text-slate-200'}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-[#2b323e] leading-relaxed whitespace-pre-line">
                    {rev.comment}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
