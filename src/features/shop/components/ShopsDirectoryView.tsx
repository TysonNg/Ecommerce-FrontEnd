"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faStar,
  faStore,
  faMagnifyingGlass,
  faBoxArchive,
  faXmark,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { PublicShop } from "@/features/shop/data/data";
import { CartTab } from "@/features/cart/components/cartTab";

interface ShopsDirectoryViewProps {
  initialShops: PublicShop[];
}

export function ShopsDirectoryView({ initialShops }: ShopsDirectoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredShops = useMemo(() => {
    if (!searchTerm.trim()) return initialShops;
    const term = searchTerm.toLowerCase().trim();
    return initialShops.filter(
      (shop) =>
        shop.name?.toLowerCase().includes(term) ||
        shop.description?.toLowerCase().includes(term) ||
        shop.slug?.toLowerCase().includes(term)
    );
  }, [initialShops, searchTerm]);

  return (
    <section className="min-h-screen bg-[#f8fbfc] pb-24">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#0573f0] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Shops</span>
        </nav>

        {/* Minimalist Borderless Directory Header */}
        <div className="pb-6 mb-8 border-b border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">
                {initialShops.length} Stores Available
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Brand Stores Directory
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Explore certified vendor stores, authentic product collections, and direct-from-brand warranties.
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="w-full md:w-80 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search stores by name..."
                  className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm border border-[#dce3e5] rounded-sm focus:outline-none focus:border-[#0573f0] bg-white placeholder:text-slate-400"
                />
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Directory Results Counter */}
        <div className="flex items-center justify-between gap-4 mb-5 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{filteredShops.length}</strong> of{" "}
            <strong>{initialShops.length}</strong> stores
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="text-[#0573f0] hover:underline cursor-pointer font-medium"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Store Cards Grid */}
        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => {
              const initial = (shop.name || "S").charAt(0).toUpperCase();
              const shopHref = `/shop/${shop.slug || shop._id}`;

              return (
                <div
                  key={shop._id}
                  className="border border-[#dce3e5] bg-white rounded-md p-5 shadow-none flex flex-col justify-between hover:border-slate-400 transition-colors"
                >
                  {/* Top: Identity */}
                  <div>
                    <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
                      <div className="w-14 h-14 shrink-0 border border-[#dce3e5] bg-slate-50 rounded-md flex items-center justify-center overflow-hidden">
                        {shop.logo ? (
                          <Image
                            src={shop.logo}
                            alt={shop.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-slate-800 text-xl">{initial}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={shopHref}
                            className="text-base font-bold text-slate-900 hover:text-[#0573f0] transition-colors truncate block"
                          >
                            {shop.name}
                          </Link>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {shop.description || "Authorized brand seller on Ecommerce."}
                        </p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-2 py-3 border-b border-slate-100 text-center">
                      <div className="border-r border-slate-100 pr-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Catalog
                        </span>
                        <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                          <FontAwesomeIcon icon={faBoxArchive} className="text-slate-400 text-[11px]" />
                          <span>{shop.productCount || 0} Products</span>
                        </span>
                      </div>
                      <div className="pl-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Rating
                        </span>
                        <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                          <FontAwesomeIcon icon={faStar} className="text-amber-500 text-[11px]" />
                          <span>4.9 / 5.0</span>
                        </span>
                      </div>
                    </div>

                    {/* Sample Product Thumbnails Row */}
                    <div className="py-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">
                        Featured Products
                      </span>
                      {shop.sampleProducts && shop.sampleProducts.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                          {shop.sampleProducts.slice(0, 4).map((prod) => (
                            <Link
                              key={prod._id}
                              href={`/products/${prod._id}/${prod.product_slug || "item"}`}
                              className="group block aspect-square border border-[#dce3e5] rounded-xs overflow-hidden bg-slate-50 relative hover:border-[#0573f0] transition-colors"
                              title={prod.product_name}
                            >
                              <Image
                                src={prod.product_thumb}
                                alt={prod.product_name}
                                fill
                                sizes="80px"
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-xs">
                          Catalog updating soon
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Visit Button */}
                  <div className="pt-2">
                    <Link
                      href={shopHref}
                      className="w-full py-2.5 text-xs font-semibold bg-[#2b323e] text-white hover:bg-[#0573f0] rounded-sm transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <FontAwesomeIcon icon={faStore} className="text-[11px]" />
                      <span>Visit Store</span>
                      <FontAwesomeIcon icon={faArrowRight} className="text-[10px] ml-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border border-[#dce3e5] bg-white rounded-md p-12 text-center shadow-none">
            <div className="w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <FontAwesomeIcon icon={faStore} className="text-xl" />
            </div>
            <h2 className="text-base font-bold text-slate-800 mb-1">No Stores Found</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              We couldn&apos;t find any merchants matching &ldquo;{searchTerm}&rdquo;. Try another name or clear your search.
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 bg-[#2b323e] text-white text-xs font-semibold rounded-sm hover:bg-[#0573f0] transition-colors cursor-pointer"
            >
              Show All Stores
            </button>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <div>
        <CartTab />
      </div>
    </section>
  );
}
