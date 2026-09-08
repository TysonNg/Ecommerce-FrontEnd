'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StarRatingInput } from './StarRatingInput';
import { ReviewItem, submitProductReview } from '../../actions/review';

interface ReviewFormProps {
  productId: string;
  productName: string;
  isLoggedIn: boolean;
  existingReview?: ReviewItem | null;
  onSubmitSuccess: () => void;
  onCancelEdit?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  productName,
  isLoggedIn,
  existingReview,
  onSubmitSuccess,
  onCancelEdit,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      setRating(5);
      setComment('');
    }
    setErrorMessage(null);
  }, [existingReview]);

  if (!isLoggedIn) {
    return (
      <div className="p-6 border border-[#dce3e5] bg-[#f8fbfc] rounded-sm text-center flex flex-col items-center gap-3">
        <h4 className="text-base font-semibold text-[#171717]">
          Be the first to review &ldquo;{productName}&rdquo;
        </h4>
        <p className="text-sm text-[#48515b] max-w-[480px]">
          Only registered users can submit a review. Please sign in to share your experience and rating.
        </p>
        <Link
          href="/user/login"
          className="mt-2 inline-flex items-center justify-center px-6 py-2.5 bg-[#0573f0] hover:bg-[#0769da] text-white text-sm font-medium rounded-sm transition-colors cursor-pointer shadow-sm"
        >
          Sign in to write a review
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!rating || rating < 1 || rating > 5) {
      setErrorMessage('Please select a star rating between 1 and 5.');
      return;
    }

    if (!comment.trim()) {
      setErrorMessage('Please provide a comment for your review.');
      return;
    }

    if (comment.trim().length < 5) {
      setErrorMessage('Review comment should be at least 5 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await submitProductReview({
        productId,
        rating,
        comment: comment.trim(),
      });

      if (res) {
        if (!existingReview) {
          setComment('');
          setRating(5);
        }
        onSubmitSuccess();
      } else {
        setErrorMessage('Failed to submit review. Please try again.');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred while submitting your review.';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[#dce3e5] bg-[#f8fbfc] p-6 rounded-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <h4 className="text-base font-bold text-[#171717]">
            {existingReview
              ? `Update your review for "${productName}"`
              : `Write a review for "${productName}"`}
          </h4>
          <p className="text-xs text-[#5e6d73] mt-0.5">
            Your review will be published publicly with your account name.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 text-xs text-[#e5484d] bg-[#fef2f2] border border-[#fecaca] rounded-sm">
            {errorMessage}
          </div>
        )}

        {/* Rating selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#2b323e]">
            Your rating <span className="text-[#e5484d]">*</span>
          </label>
          <StarRatingInput value={rating} onChange={setRating} disabled={loading} />
        </div>

        {/* Comment textarea */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-comment" className="text-sm font-semibold text-[#2b323e]">
            Your review <span className="text-[#e5484d]">*</span>
          </label>
          <textarea
            id="review-comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
            placeholder="What did you like or dislike about this product? How is the quality?"
            className="w-full p-3 text-sm text-[#171717] bg-white border border-[#dce3e5] rounded-sm focus:border-[#0573f0] focus:ring-1 focus:ring-[#0573f0] outline-none transition-all placeholder:text-[#94a3b8] resize-y"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#171717] hover:bg-[#0573f0] text-white text-sm font-semibold rounded-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : existingReview ? (
              'Update Review'
            ) : (
              'Submit Review'
            )}
          </button>

          {existingReview && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={loading}
              className="px-4 py-2.5 text-sm text-[#48515b] hover:text-[#171717] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
