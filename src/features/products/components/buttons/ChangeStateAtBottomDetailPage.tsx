"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { ReviewList } from "../reviews/ReviewList";
import { ReviewForm } from "../reviews/ReviewForm";
import {
  ReviewItem,
  ReviewStats,
  getReviewsByProduct,
  getUserReview,
  deleteProductReview,
} from "../../actions/review";

interface ChangeStateProps {
  productId: string;
  product_description: string;
  product_thumb: string;
  product_images: string[];
  product_name: string;
}

export const ChangeStateAtDetailPage: React.FC<ChangeStateProps> = (props) => {
  const {
    productId,
    product_description,
    product_thumb,
    product_images,
    product_name,
  } = props;

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [state, setState] = useState<"Description" | "Reviews">(
    tabParam === "reviews" ? "Reviews" : "Description"
  );

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    avgRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [userReview, setUserReview] = useState<ReviewItem | null>(null);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const fetchReviewsData = useCallback(async () => {
    if (!productId) return;
    setLoadingReviews(true);
    try {
      const data = await getReviewsByProduct(productId);
      if (data) {
        setReviews(data.reviews || []);
        setStats(
          data.stats || {
            avgRating: 0,
            totalReviews: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          }
        );
      }

      const userId = Cookies.get("_id");
      const token = Cookies.get("accessToken");
      if (userId && token) {
        setIsLoggedIn(true);
        setCurrentUserId(userId);
        const myReview = await getUserReview(productId);
        setUserReview(myReview);
      } else {
        setIsLoggedIn(false);
        setCurrentUserId(undefined);
        setUserReview(null);
      }
    } finally {
      setLoadingReviews(false);
    }
  }, [productId]);

  // Load reviews on mount or when product/state changes
  useEffect(() => {
    fetchReviewsData();
  }, [fetchReviewsData]);

  // Respond to URL param ?tab=reviews
  useEffect(() => {
    if (tabParam === "reviews") {
      setState("Reviews");
      const timer = setTimeout(() => {
        const el = document.getElementById("reviews-section");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [tabParam]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete your review?")) return;
    setIsDeleting(true);
    try {
      const success = await deleteProductReview(reviewId);
      if (success) {
        setEditingReview(null);
        await fetchReviewsData();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditReview = (review: ReviewItem) => {
    setEditingReview(review);
    const formElement = document.getElementById("review-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmitSuccess = async () => {
    setEditingReview(null);
    await fetchReviewsData();
  };

  const renderByState = () => {
    if (state === "Description") {
      return (
        <div className="w-full pt-6 sm:pt-10">
          <h2 className="pb-6 sm:pb-8 text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
            More about the product
          </h2>

          <div className="relative w-full max-w-4xl aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-2xs mx-auto bg-slate-50">
            <Image
              src={product_thumb}
              alt={product_description}
              fill
              className="object-contain p-4 sm:p-8"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-12 py-8 sm:py-14 items-start">
            <div className="lg:col-span-4">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 pb-1.5 border-b-2 border-[#0573f0] inline-block">
                Product&apos;s Features
              </h3>
            </div>

            <div className="lg:col-span-8 text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-line">
              {product_description}
            </div>
          </div>

          <div className="relative w-full max-w-4xl aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-2xs mx-auto bg-slate-50">
            <Image
              src={
                product_images.length > 1 ? product_images[1] : product_thumb
              }
              alt={product_description}
              fill
              className="object-contain p-4 sm:p-8"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="pt-6 sm:pt-8 flex flex-col gap-10">
        {loadingReviews && reviews.length === 0 ? (
          <div className="py-12 text-center text-[#48515b] flex flex-col items-center justify-center gap-3">
            <span className="inline-block w-8 h-8 border-3 border-[#0573f0] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading reviews...</p>
          </div>
        ) : (
          <>
            <ReviewList
              reviews={reviews}
              stats={stats}
              currentUserId={currentUserId}
              onEditReview={handleEditReview}
              onDeleteReview={handleDeleteReview}
              isDeleting={isDeleting}
            />

            <div id="review-form-section">
              <ReviewForm
                productId={productId}
                productName={product_name}
                isLoggedIn={isLoggedIn}
                existingReview={editingReview || userReview}
                onSubmitSuccess={handleSubmitSuccess}
                onCancelEdit={
                  editingReview ? () => setEditingReview(null) : undefined
                }
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      id="reviews-section"
      className="w-full mx-auto scroll-mt-24"
    >
      <div className="border-b border-slate-200">
        <div className="flex gap-6 sm:gap-10 text-sm sm:text-base font-semibold">
          <button
            type="button"
            className={`${
              state === "Description"
                ? "border-b-2 border-[#0573f0] text-[#0573f0]"
                : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
            } pb-3 pt-1 cursor-pointer transition-all`}
            onClick={() => setState("Description")}
          >
            Descriptions
          </button>
          <button
            type="button"
            className={`${
              state === "Reviews"
                ? "border-b-2 border-[#0573f0] text-[#0573f0]"
                : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
            } pb-3 pt-1 cursor-pointer transition-all flex items-center gap-1.5`}
            onClick={() => setState("Reviews")}
          >
            <span>Reviews</span>
            {stats.totalReviews > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0573f0] text-xs font-bold">
                {stats.totalReviews}
              </span>
            )}
          </button>
        </div>
      </div>
      {renderByState()}
    </div>
  );
};
