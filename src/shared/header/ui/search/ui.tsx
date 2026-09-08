'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef, Suspense } from "react";
import { searchProducts } from "@/features/products/data/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductSearch {
  _id: string;
  product_name: string;
  product_thumb: string;
  product_slug: string;
  product_price?: number;
  product_prevPrice?: number | string;
  product_type?: string;
}

const SearchBarInner = () => {
  const apiKey: string = `${process.env.NEXT_PUBLIC_API_KEY}`;
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [input, setInput] = useState<string>(urlSearch);
  const [data, setData] = useState<ProductSearch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync input value when URL search param changes
  useEffect(() => {
    setInput(urlSearch);
  }, [urlSearch]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (value: string) => {
    setInput(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setData([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchProducts(value.trim(), apiKey);
        setData(results || []);
      } catch (error) {
        console.error("Search error:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }, 280);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsOpen(false);
    router.push(`/products?search=${encodeURIComponent(input.trim())}`);
  };

  return (
    <div className="relative w-full max-w-[240px] xs:max-w-[300px] sm:max-w-[380px] md:max-w-[440px]" ref={dropdownRef}>
      {/* Search Input Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-row items-stretch w-full h-11 bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-300/60"
      >
        <input
          className="flex-1 min-w-0 h-full bg-transparent text-slate-800 text-sm pl-4 pr-2 outline-none placeholder:text-slate-400 font-normal border-none"
          type="text"
          placeholder="Type to search..."
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (input.trim()) setIsOpen(true);
          }}
        />
        <button
          type="submit"
          aria-label="Search"
          className="h-full px-4 flex items-center justify-center text-[#0573f0] hover:text-blue-700 hover:bg-slate-50/80 cursor-pointer transition-colors border-none bg-transparent shrink-0"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-base" />
        </button>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && input.trim().length > 0 && (
        <div className="absolute right-0 sm:right-auto sm:left-0 top-full mt-2 w-screen max-w-[320px] xs:max-w-[360px] sm:max-w-[420px] md:max-w-[460px] bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden z-50 animate-toast-enter">
          {/* Loading State */}
          {isLoading && (
            <div className="py-6 px-4 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-sm" />
              <span className="font-medium">Searching products...</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && data.length === 0 && (
            <div className="py-8 px-4 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
              </div>
              <p className="text-sm font-semibold text-slate-800">No products found</p>
              <p className="text-xs text-slate-500 mt-1">
                We couldn&apos;t find anything matching &quot;<span className="font-medium text-slate-700">{input}</span>&quot;
              </p>
            </div>
          )}

          {/* Results List */}
          {!isLoading && data.length > 0 && (
            <>
              <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                {data.map((item) => (
                  <Link
                    key={item._id}
                    href={`/products/${item._id}/${item.product_slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-blue-50/60 transition-colors group cursor-pointer"
                  >
                    <div className="relative w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <Image
                        src={item.product_thumb || "/banner.jpg"}
                        alt={item.product_name}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      {item.product_type && (
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-0.5">
                          {item.product_type}
                        </span>
                      )}
                      <h5 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {item.product_name}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        {item.product_prevPrice && (
                          <span className="text-[11px] line-through text-slate-400">
                            ${item.product_prevPrice}.00
                          </span>
                        )}
                        {item.product_price && (
                          <span className="text-xs font-bold text-slate-900">
                            ${item.product_price}.00
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Dropdown Footer: View All Results */}
              <Link
                href={`/products?search=${encodeURIComponent(input.trim())}`}
                onClick={() => setIsOpen(false)}
                className="block p-3 bg-slate-50 hover:bg-blue-50 border-t border-slate-100 text-center text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all results for &quot;{input.trim()}&quot; →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

function SearchBarFallback() {
  return (
    <div className="relative w-full max-w-[240px] xs:max-w-[300px] sm:max-w-[380px] md:max-w-[440px]">
      <div className="flex flex-row items-stretch w-full h-11 bg-white rounded-lg shadow-sm overflow-hidden">
        <input
          disabled
          className="flex-1 min-w-0 h-full bg-transparent text-slate-800 text-sm pl-4 pr-2 outline-none placeholder:text-slate-400 font-normal border-none"
          type="text"
          placeholder="Type to search..."
        />
        <div className="h-full px-4 flex items-center justify-center text-[#0573f0]">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-base" />
        </div>
      </div>
    </div>
  );
}

export const SearchBar = () => {
  return (
    <Suspense fallback={<SearchBarFallback />}>
      <SearchBarInner />
    </Suspense>
  );
};