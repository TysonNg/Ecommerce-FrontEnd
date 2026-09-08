"use client";

import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="w-full p-2.5 sm:p-4 bg-white rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
      {/* Thumbnail shimmer */}
      <div className="relative w-full aspect-square rounded-lg bg-slate-100 skeleton-shimmer overflow-hidden flex items-center justify-center p-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-slate-200/50" />
      </div>

      {/* Content shimmer */}
      <div className="flex flex-col gap-2">
        {/* Title line 1 */}
        <div className="h-3.5 w-5/6 rounded-md bg-slate-200 skeleton-shimmer" />
        {/* Title line 2 */}
        <div className="h-3.5 w-3/5 rounded-md bg-slate-200 skeleton-shimmer" />

        {/* Rating shimmer */}
        <div className="h-3 w-20 rounded bg-slate-200 skeleton-shimmer my-1" />

        {/* Price line */}
        <div className="mt-1 flex items-center gap-2">
          <div className="h-3.5 w-14 rounded bg-slate-200 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 6,
  columns = 6,
}: {
  count?: number;
  columns?: 4 | 6;
}) {
  return (
    <div className="w-full">
      <div
        className={`grid ${
          columns === 4
            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
        } gap-3 sm:gap-5 lg:gap-6 items-stretch mb-10`}
      >
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
