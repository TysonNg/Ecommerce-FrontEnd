"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";

export interface SortOption {
  value: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "default", label: "Default sorting" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "rating", label: "Top Rated" },
];

interface ProductSortProps {
  className?: string;
  buttonClassName?: string;
}

export function ProductSort({ className = "", buttonClassName = "" }: ProductSortProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSortValue = searchParams.get("sort") || "default";
  const activeOption =
    SORT_OPTIONS.find((opt) => opt.value === currentSortValue) || SORT_OPTIONS[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectSort = useCallback(
    (sortValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset page to 1 on sort change
      params.set("page", "1");

      if (sortValue === "default") {
        params.delete("sort");
      } else {
        params.set("sort", sortValue);
      }

      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
      setIsOpen(false);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        id="product-sort-trigger"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex items-center justify-between gap-2 px-3 py-2 sm:py-1.5 bg-white border rounded-lg sm:rounded text-xs transition-colors cursor-pointer ${
          isOpen
            ? "border-[#0573f0] text-[#0573f0] shadow-2xs"
            : "border-slate-200 text-[#48515b] hover:border-slate-300 hover:text-slate-900"
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-[#5e6d73]">Sort:</span>
          <span className="font-medium text-slate-800 truncate">{activeOption.label}</span>
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-[10px] text-slate-400 shrink-0 transition-transform duration-150 ${
            isOpen ? "rotate-180 text-[#0573f0]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          id="product-sort-menu"
          role="listbox"
          aria-label="Product sorting options"
          className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded py-1 z-30"
        >
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.value === activeOption.value;
            return (
              <button
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelectSort(option.value)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-slate-50 text-[#0573f0] font-semibold"
                    : "text-[#48515b] hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <FontAwesomeIcon icon={faCheck} className="text-[#0573f0] text-[11px]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
