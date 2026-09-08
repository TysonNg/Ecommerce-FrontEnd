"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faXmark, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { ProductSidebar } from "./ProductSidebar";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  totalResults?: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  totalResults,
}: MobileFilterDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category");
  const currentMaxPrice = searchParams.get("maxPrice");
  const currentRating = searchParams.get("rating");

  const hasActiveFilters = Boolean(
    currentCategory ||
    (currentMaxPrice && Number(currentMaxPrice) < 2000) ||
    currentRating
  );

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleResetAll = () => {
    const currentSearch = searchParams.get("search");
    const params = new URLSearchParams();
    if (currentSearch) {
      params.set("search", currentSearch);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[9990] transition-opacity duration-300 cursor-pointer"
          onClick={onClose}
          aria-label="Close filters"
        />
      )}

      {/* Slide-over Left Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Product filters"
        className={`fixed top-0 left-0 bottom-0 z-[9995] w-[85vw] max-w-[340px] bg-white shadow-2xl flex flex-col justify-between transition-all duration-300 ease-out ${
          isOpen
            ? "translate-x-0 opacity-100 visible"
            : "-translate-x-full pointer-events-none opacity-0 invisible"
        }`}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0573f0]">
              <FontAwesomeIcon icon={faFilter} className="text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-none">
                Filters
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Refine product catalogue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer text-sm font-bold"
            aria-label="Close filters"
          >
            <FontAwesomeIcon icon={faXmark} className="text-base" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-slate-100 space-y-4">
          <ProductSidebar onSelectCategory={onClose} isDrawer={true} />
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 border-t border-slate-100 bg-white shadow-md flex items-center gap-2.5">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetAll}
              className="flex-1 py-2.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faRotateLeft} className="text-[11px] text-slate-500" />
              <span>Reset all</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-lg bg-[#0573f0] hover:bg-[#0769da] text-white text-xs font-bold shadow-sm transition-all text-center cursor-pointer"
          >
            {totalResults !== undefined ? `View ${totalResults} Results` : "Apply & Close"}
          </button>
        </div>
      </aside>
    </div>
  );
}
