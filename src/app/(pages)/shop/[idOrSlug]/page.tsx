import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getShopProducts } from "@/features/shop/data/data";
import { ProductGrid } from "@/features/products/components/ProductCard";
import { CartTab } from "@/features/cart/components/cartTab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faBoxArchive, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type Params = Promise<{
  idOrSlug: string;
}>;

type SearchParams = Promise<{
  category?: string;
  search?: string;
}>;

export default async function ShopStorefrontPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { idOrSlug } = await params;
  const { category = "all", search = "" } = await searchParams;

  const data = await getShopProducts(idOrSlug, category, search);

  if (!data || !data.shop) {
    notFound();
  }

  const { shop, products, categories, total } = data;
  const initial = (shop.name || "S").charAt(0).toUpperCase();

  const formattedDate = shop.createdAt
    ? new Date(shop.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <section className="min-h-screen bg-[#f8fbfc] pb-20">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#0573f0] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shops" className="hover:text-[#0573f0] transition-colors">
            Shops
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium line-clamp-1">{shop.name}</span>
        </nav>

        {/* Minimalist Borderless Shop Header */}
        <div className="pb-6 mb-8 border-b border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Shop Identity */}
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-slate-200/80 rounded-md flex items-center justify-center overflow-hidden">
                {shop.logo ? (
                  <Image
                    src={shop.logo}
                    alt={shop.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-slate-700 text-xl sm:text-2xl">{initial}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {shop.name}
                </h1>

                {shop.description && (
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 max-w-xl">
                    {shop.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faBoxArchive} className="text-slate-400" />
                    <span><strong>{total || products?.length || 0}</strong> Products</span>
                  </span>
                  {formattedDate && (
                    <span className="inline-flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCalendar} className="text-slate-400" />
                      <span>Joined {formattedDate}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: In-Shop Search */}
            <div className="w-full md:w-80 shrink-0">
              <form method="GET" action={`/shop/${idOrSlug}`} className="flex items-center gap-1.5">
                {category !== "all" && (
                  <input type="hidden" name="category" value={category} />
                )}
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="Search in this store..."
                    className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm border border-[#dce3e5] rounded-sm focus:outline-none focus:border-[#0573f0] bg-white placeholder:text-slate-400"
                  />
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#0573f0] hover:bg-[#0769da] text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer shrink-0"
                >
                  Search
                </button>
                {search && (
                  <Link
                    href={`/shop/${idOrSlug}${category !== "all" ? `?category=${category}` : ""}`}
                    className="px-2.5 py-2 border border-slate-300 text-slate-600 text-xs font-semibold rounded-sm hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                    title="Clear search"
                  >
                    Clear
                  </Link>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        {categories && categories.length > 0 && (
          <div className="border-b border-[#dce3e5] mb-6 flex items-center gap-2 overflow-x-auto pb-px">
            <Link
              href={`/shop/${idOrSlug}${search ? `?search=${encodeURIComponent(search)}` : ""}`}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                category === "all"
                  ? "border-[#0573f0] text-[#0573f0]"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              All Products
            </Link>
            {categories.map((cat) => {
              const isActive = category.toLowerCase() === cat.toLowerCase();
              const catHref = `/shop/${idOrSlug}?category=${encodeURIComponent(cat)}${
                search ? `&search=${encodeURIComponent(search)}` : ""
              }`;
              return (
                <Link
                  key={cat}
                  href={catHref}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-semibold capitalize whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    isActive
                      ? "border-[#0573f0] text-[#0573f0]"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        )}

        {/* Product Grid or Empty State */}
        {products && products.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wide">
                {search ? `Search: "${search}"` : category === "all" ? "All Products" : category}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Showing {products.length} {products.length === 1 ? "product" : "products"}
              </span>
            </div>
            <ProductGrid products={products} cartRem={1} numOfProduct={4} />
          </div>
        ) : (
          <div className="border border-[#dce3e5] bg-white p-12 text-center rounded-md my-8 shadow-none">
            <div className="w-12 h-12 mx-auto mb-3 border border-[#dce3e5] bg-[#f8fbfc] rounded-md flex items-center justify-center text-slate-400">
              <FontAwesomeIcon icon={faBoxArchive} className="text-lg" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1">
              No products found
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {search
                ? `No products matching "${search}" in this store.`
                : "There are no published products in this category right now."}
            </p>
            <Link
              href={`/shop/${idOrSlug}`}
              className="inline-block text-xs font-semibold border border-[#2b323e] text-[#2b323e] hover:bg-[#0573f0] hover:text-white hover:border-[#0573f0] px-4 py-2 rounded-sm transition-colors cursor-pointer"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartTab />
    </section>
  );
}
