'use client'
import { getAllProducts, searchProducts } from '@/features/products/data/data';
import { ProductGrid } from '@/features/products/components/ProductCard';
import { ProductGridSkeleton } from '@/features/products/components/ProductSkeleton';
import { ProductSort } from '@/features/products/components/ProductSort';
import { useSearchParams } from "next/navigation";
import dotenv from "dotenv";
import { useEffect, useState, useMemo, type ComponentProps } from 'react';
import NotFoundProducts from '@/features/cart/components/not-found';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark, faRotateLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import { MobileFilterDrawer } from '@/features/products/components/MobileFilterDrawer';

dotenv.config();
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const ProductsPage = () => {
    const apiKey: string = `${process.env.NEXT_PUBLIC_API_KEY}`;
    const pageSize = 12;
    const searchParams = useSearchParams();
    
    type CatalogProduct = ComponentProps<typeof ProductGrid>['products'][number] & {
        product_ratingsAverage?: number;
        product_type?: string;
    };
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [allResults, setAllResults] = useState<CatalogProduct[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

    const currentPage = Number(searchParams.get('page')) || 1;
    const maxPriceParam = searchParams.get('maxPrice');
    const ratingParam = searchParams.get('rating');
    const sortParam = searchParams.get('sort') || 'default';
    const maxPrice = maxPriceParam ? Number(maxPriceParam) : null;
    const minRating = ratingParam ? Number(ratingParam) : null;

    const categoryParam = searchParams.get('category') ?? "";
    const searchParam = searchParams.get('search')?.trim() ?? "";

    useEffect(() => {
        setIsLoading(true);

        const fetchProducts = async () => {
            try {
                if (searchParam) {
                    const searchRes = await searchProducts(searchParam, apiKey);
                    const rawList: CatalogProduct[] = Array.isArray(searchRes) ? searchRes : [];
                    // Filter by category if a category is also selected
                    const matchedList = categoryParam
                        ? rawList.filter((item) => (item.product_type || "").toLowerCase() === categoryParam.toLowerCase())
                        : rawList;
                    setProducts(matchedList);
                    setAllResults(matchedList);
                } else {
                    const res = await getAllProducts(pageSize, categoryParam, apiKey, "1");
                    const allResultsData = await getAllProducts(0, categoryParam, apiKey, "1");
                    if (!res) throw new Error("Error fetchAllProducts");
                    setProducts(res);
                    setAllResults(allResultsData && allResultsData.length > 0 ? allResultsData : res);
                }
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };
        fetchProducts();

    }, [categoryParam, searchParam, apiKey]);

    // 1. Filter products by price and rating across the entire dataset
    const baseDataset = allResults.length > 0 ? allResults : products;

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (categoryParam) count++;
        if (maxPrice !== null && maxPrice < 2000) count++;
        if (minRating !== null && minRating > 0) count++;
        return count;
    }, [categoryParam, maxPrice, minRating]);

    const filteredProducts = useMemo(() => {
        return baseDataset.filter((item) => {
            if (maxPrice !== null && item.product_price > maxPrice) {
                return false;
            }
            if (minRating !== null) {
                const rating = item.product_ratingsAverage || 4.5;
                if (rating < minRating) return false;
            }
            return true;
        });
    }, [baseDataset, maxPrice, minRating]);

    // 2. Sort the filtered products according to sortParam
    const sortedProducts = useMemo(() => {
        const list = [...filteredProducts];
        switch (sortParam) {
            case 'price_asc':
                return list.sort((a, b) => a.product_price - b.product_price);
            case 'price_desc':
                return list.sort((a, b) => b.product_price - a.product_price);
            case 'newest':
                return list.sort((a, b) => {
                    if (a._id && b._id) {
                        return b._id.localeCompare(a._id);
                    }
                    return 0;
                });
            case 'rating':
                return list.sort((a, b) => {
                    const ratingA = a.product_ratingsAverage ?? 4.5;
                    const ratingB = b.product_ratingsAverage ?? 4.5;
                    return ratingB - ratingA;
                });
            case 'default':
            default:
                return list;
        }
    }, [filteredProducts, sortParam]);

    // 3. Paginate the sorted results
    const totalItems = sortedProducts.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginations = useMemo(() => {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }, [totalPages]);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedProducts = useMemo(() => {
        return sortedProducts.slice(startIndex, endIndex);
    }, [sortedProducts, startIndex, endIndex]);

    const buildPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `/products?${params.toString()}`;
    };

    const getClearSearchUrl = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('search');
        params.set('page', '1');
        const q = params.toString();
        return `/products${q ? `?${q}` : ''}`;
    };

    const getResetFilterUrl = () => {
        const params = new URLSearchParams();
        if (searchParam) params.set('search', searchParam);
        params.set('page', '1');
        return `/products?${params.toString()}`;
    };
    
    if (isLoading) {
        return (
            <div className="products_container">
                <div className="text-sm flex flex-row justify-between text-[#48515b] mb-6 items-center">
                    <div className="h-4 w-32 sm:w-40 rounded bg-slate-200 skeleton-shimmer" />
                    <div className="h-8 w-28 sm:w-36 rounded bg-slate-200 skeleton-shimmer" />
                </div>
                <ProductGridSkeleton count={8} columns={6} />
            </div>
        );
    }

    if ((baseDataset.length > 0 || searchParam) && !isLoading) {
        return (
            <div className="products_container">
                {/* Search Header Badge */}
                {searchParam && (
                    <div className="flex items-center justify-between gap-3 mb-5 p-3 px-4 bg-gradient-to-r from-blue-50/90 to-indigo-50/50 border border-blue-100 rounded-xl">
                        <div className="flex items-center gap-2.5 text-sm text-slate-700">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#0573f0] text-xs" />
                            <span>Search results for:</span>
                            <span className="font-bold text-[#0573f0] bg-white/90 px-2.5 py-0.5 rounded-md border border-blue-200/60 shadow-2xs">
                                &ldquo;{searchParam}&rdquo;
                            </span>
                        </div>
                        <Link
                            href={getClearSearchUrl()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                            title="Clear search"
                        >
                            <FontAwesomeIcon icon={faXmark} className="text-xs" />
                            <span>Clear search</span>
                        </Link>
                    </div>
                )}

                {/* Mobile / Tablet Action Bar (< 1024px) */}
                <div className="lg:hidden mb-5">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 px-0.5">
                        <p className="font-medium">
                            {totalItems > 0
                                ? `Showing ${startIndex + 1}-${endIndex} of ${totalItems} results`
                                : 'Showing 0 results'}
                        </p>
                        {activeFiltersCount > 0 && (
                            <Link
                                href={getResetFilterUrl()}
                                className="text-[#0573f0] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
                                <span>Reset filters</span>
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsFilterDrawerOpen(true)}
                            className={`flex items-center justify-center gap-2 px-3 py-2 bg-white border rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                                activeFiltersCount > 0
                                    ? "border-[#0573f0] text-[#0573f0] bg-blue-50/60"
                                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                            }`}
                        >
                            <FontAwesomeIcon icon={faFilter} className="text-[11px]" />
                            <span>Filters</span>
                            {activeFiltersCount > 0 && (
                                <span className="w-5 h-5 rounded-full bg-[#0573f0] text-white text-[10px] font-bold flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        <ProductSort className="w-full" buttonClassName="w-full justify-between" />
                    </div>
                </div>

                {/* Desktop Toolbar (>= 1024px) */}
                <div className="hidden lg:flex text-sm flex-row justify-between text-[#48515b] mb-6 items-center">
                    <p>
                        {totalItems > 0
                            ? `Showing ${startIndex + 1}-${endIndex} of ${totalItems} results`
                            : 'Showing 0 results'}
                    </p>
                    {totalItems > 0 && <ProductSort />}
                </div> 

                {paginatedProducts.length > 0 ? (
                    <ProductGrid products={paginatedProducts} numOfProduct={6} cartRem={1} />
                ) : baseDataset.length === 0 && searchParam ? (
                    <div className="py-16 px-6 text-center bg-slate-50/80 rounded-2xl border border-slate-200/80 my-4 max-w-2xl mx-auto">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0573f0] text-2xl shadow-xs">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                            No products found matching &ldquo;{searchParam}&rdquo;
                        </h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                            {categoryParam 
                                ? `No products found in the selected category matching your search.`
                                : `Please check your spelling or try searching with more general keywords.`}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href={getClearSearchUrl()}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0573f0] hover:bg-[#0769da] text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
                                <span>Clear search filter</span>
                            </Link>
                            {categoryParam && (
                                <Link
                                    href={`/products?search=${encodeURIComponent(searchParam)}`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer"
                                >
                                    Search in all categories
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="py-14 text-center bg-slate-50/80 rounded-xl border border-slate-200/80 p-8 my-6">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center text-[#0573f0] text-xl font-bold">
                            !
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mb-1">No products match your filter criteria</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                            Try adjusting your price slider or star rating filter to view more products.
                        </p>
                        <Link
                            href={getResetFilterUrl()}
                            className="inline-flex items-center px-4 py-2 bg-[#0573f0] hover:bg-[#0769da] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                        >
                            Reset Filters
                        </Link>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination-container mt-10 mb-6">
                        <div className="pagination-item flex flex-row justify-center flex-wrap gap-1.5 sm:gap-2">
                            {paginations.map((page, i) => {
                                const isCurrent = page === currentPage;
                                return (
                                    <Link key={i} href={buildPageUrl(page)}>
                                        <div className={`min-w-9 h-9 px-2 flex items-center justify-center border text-xs sm:text-sm cursor-pointer rounded-lg transition-all duration-200 ${
                                            isCurrent
                                                ? 'bg-[#0573f0] text-white border-[#0573f0] font-bold shadow-xs'
                                                : 'border-slate-200 text-[#48515b] hover:bg-[#0573f0] hover:text-white hover:border-[#0573f0]'
                                        }`}>
                                            {page} 
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Mobile & Tablet Slide-over Filter Drawer */}
                <MobileFilterDrawer
                    isOpen={isFilterDrawerOpen}
                    onClose={() => setIsFilterDrawerOpen(false)}
                    totalResults={totalItems}
                />
            </div>
        );
    }
    return (
        <div className="notFoundProducts-container">
            <NotFoundProducts />
        </div>
    );
};

export default ProductsPage;
