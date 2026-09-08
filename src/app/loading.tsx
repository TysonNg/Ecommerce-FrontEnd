import React from "react";
import { ProductGridSkeleton } from "@/features/products/components/ProductSkeleton";

export default function Loading() {
  return (
    <div className="w-full bg-[#f8fbfc] pb-16 min-h-screen">
      {/* Top Banner Skeleton */}
      <div className="w-full max-w-[1200px] h-[340px] sm:h-[460px] mx-auto mt-4 px-4">
        <div className="w-full h-full rounded-2xl bg-slate-200/80 skeleton-shimmer overflow-hidden relative shadow-inner">
          <div className="absolute left-8 sm:left-16 top-1/3 space-y-3">
            <div className="h-6 w-32 rounded-full bg-slate-300/70" />
            <div className="h-10 w-64 sm:w-96 rounded-xl bg-slate-300/70" />
            <div className="h-4 w-48 rounded bg-slate-300/70" />
          </div>
        </div>
      </div>

      {/* Services Section Skeleton */}
      <div className="w-full max-w-[1200px] mx-auto mt-6 px-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 skeleton-shimmer shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 rounded bg-slate-200 skeleton-shimmer" />
                  <div className="h-3 w-36 rounded bg-slate-100 skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Grid Skeleton */}
      <div className="w-full max-w-[1200px] mx-auto mt-8 px-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="h-6 w-48 rounded-lg bg-slate-200 skeleton-shimmer mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 skeleton-shimmer" />
                <div className="h-3.5 w-16 rounded bg-slate-200 skeleton-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hot Deals Products Grid Skeleton */}
      <div className="w-full max-w-[1200px] mx-auto mt-10 px-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="h-7 w-52 rounded-lg bg-slate-200 skeleton-shimmer" />
            <div className="h-4 w-20 rounded bg-slate-200 skeleton-shimmer" />
          </div>
          <ProductGridSkeleton count={6} columns={6} />
        </div>
      </div>

      {/* Secondary Shelf Skeleton */}
      <div className="w-full max-w-[1200px] mx-auto mt-8 px-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="h-7 w-40 rounded-lg bg-slate-200 skeleton-shimmer" />
            <div className="h-4 w-20 rounded bg-slate-200 skeleton-shimmer" />
          </div>
          <ProductGridSkeleton count={4} columns={4} />
        </div>
      </div>
    </div>
  );
}