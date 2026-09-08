"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faRotateLeft, faFilter } from "@fortawesome/free-solid-svg-icons";

interface CategoryItem {
  label: string;
  slug: string;
}

const CATEGORIES: CategoryItem[] = [
  { label: "All products", slug: "" },
  { label: "Audio & video", slug: "audioVideo" },
  { label: "Home appliances", slug: "homeAppliances" },
  { label: "Kitchen appliances", slug: "kitchenAppliances" },
  { label: "PC & laptop", slug: "laptop" },
  { label: "Clothing", slug: "clothing" },
  { label: "Electronics", slug: "electronics" },
  { label: "Jewelrys", slug: "jewelrys" },
  { label: "Gadget", slug: "gadget" },
  { label: "Others", slug: "others" },
];

const RATING_OPTIONS = [
  { value: 5, label: "5 Stars", stars: 5 },
  { value: 4, label: "4 Stars & up", stars: 4 },
  { value: 3, label: "3 Stars & up", stars: 3 },
  { value: 2, label: "2 Stars & up", stars: 2 },
];

const DEFAULT_MAX_PRICE = 2000;

interface ProductSidebarProps {
  onSelectCategory?: () => void;
  isDrawer?: boolean;
}

export function ProductSidebar({ onSelectCategory, isDrawer }: ProductSidebarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentMaxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : DEFAULT_MAX_PRICE;
  const currentRating = searchParams.get("rating")
    ? Number(searchParams.get("rating"))
    : 0;

  const [sliderPrice, setSliderPrice] = useState<number>(currentMaxPrice);

  // Sync local slider when URL changes
  useEffect(() => {
    setSliderPrice(currentMaxPrice);
  }, [currentMaxPrice]);

  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset page to 1 on any filter change
      params.set("page", "1");

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || (key === "maxPrice" && Number(value) >= DEFAULT_MAX_PRICE)) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handlePriceCommit = (value: number) => {
    updateQueryParams({
      maxPrice: value >= DEFAULT_MAX_PRICE ? null : value.toString(),
    });
  };

  const handleRatingClick = (ratingVal: number) => {
    if (currentRating === ratingVal) {
      // Toggle off
      updateQueryParams({ rating: null });
    } else {
      updateQueryParams({ rating: ratingVal.toString() });
    }
  };

  const handleResetFilters = () => {
    setSliderPrice(DEFAULT_MAX_PRICE);
    const params = new URLSearchParams();
    const currentSearch = searchParams.get("search");
    if (currentSearch) {
      params.set("search", currentSearch);
    }
    if (currentCategory) {
      params.set("category", currentCategory);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const isFiltered = currentMaxPrice < DEFAULT_MAX_PRICE || currentRating > 0;

  return (
    <aside className={`w-full ${isDrawer ? "px-1 text-slate-800" : "pr-4 text-slate-800"}`}>
      {/* Header & Reset button */}
      {!isDrawer ? (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFilter} className="text-[#0573f0] text-sm" />
            <h2 className="font-bold text-base text-[#253D4E] tracking-tight">Categories</h2>
          </div>
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-[#0573f0] hover:text-[#0769da] transition-colors cursor-pointer bg-blue-50 hover:bg-blue-100/80 px-2 py-1 rounded"
              title="Reset price and rating filters"
            >
              <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
              <span>Reset</span>
            </button>
          )}
        </div>
      ) : (
        <div className="mb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Categories</h3>
        </div>
      )}

      {/* Category List */}
      <ul className="flex flex-col gap-1 text-sm mb-8">
        {CATEGORIES.map((cat) => {
          const isActive =
            (cat.slug === "" && !currentCategory) ||
            currentCategory.toLowerCase() === cat.slug.toLowerCase();

          return (
            <li key={cat.slug || "all"}>
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (cat.slug) {
                    params.set("category", cat.slug);
                  } else {
                    params.delete("category");
                  }
                  params.set("page", "1");
                  router.push(`${pathname}?${params.toString()}`);
                  if (onSelectCategory) {
                    onSelectCategory();
                  }
                }}
                className={`w-full text-left transition-all duration-200 cursor-pointer flex items-center justify-between text-[13.5px] ${
                  isActive
                    ? "bg-blue-50/80 text-[#0573f0] font-semibold border-l-[3px] border-[#0573f0] pl-3 pr-2 py-1.5 rounded-r shadow-xs"
                    : "text-[#5e6d73] hover:text-[#0573f0] hover:bg-slate-50/90 border-l-[3px] border-transparent pl-3 pr-2 py-1.5 rounded-r"
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0573f0]" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Filter by Price */}
      <div className="mb-8 pt-4 border-t border-slate-200/80">
        <h3 className="font-bold text-sm text-[#253D4E] mb-3">Filter by price</h3>
        <div className="space-y-3">
          <input
            type="range"
            min="50"
            max={DEFAULT_MAX_PRICE}
            step="50"
            value={sliderPrice}
            onChange={(e) => setSliderPrice(Number(e.target.value))}
            onMouseUp={() => handlePriceCommit(sliderPrice)}
            onTouchEnd={() => handlePriceCommit(sliderPrice)}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0573f0]"
            aria-label="Filter by maximum price"
          />
          <div className="flex items-center justify-between text-xs font-medium text-[#48515b]">
            <span>Price:</span>
            <span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              $0 — ${sliderPrice >= DEFAULT_MAX_PRICE ? `${DEFAULT_MAX_PRICE}+` : sliderPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="mb-6 pt-4 border-t border-slate-200/80">
        <h3 className="font-bold text-sm text-[#253D4E] mb-3">Average rating</h3>
        <div className="flex flex-col gap-1.5">
          {RATING_OPTIONS.map((opt) => {
            const isSelected = currentRating === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleRatingClick(opt.value)}
                className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded text-xs transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-50/80 text-[#0573f0] font-semibold border border-blue-200"
                    : "text-[#5e6d73] hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex text-[#f59e0b] text-[11px] gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className={i < opt.stars ? "text-[#f59e0b]" : "text-slate-200"}
                      />
                    ))}
                  </div>
                  <span className="ml-1">{opt.label}</span>
                </div>
                {isSelected && (
                  <span className="text-[10px] text-[#0573f0] font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
