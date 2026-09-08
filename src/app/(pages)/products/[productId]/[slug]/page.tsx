import { getProductDetail, getRelatedProductByCategory } from "@/features/products/data/data";
import { BtnToSlideImagesProduct } from "@/features/products/components/buttons/BtnToSlideImageProduct";
import HandleCart from "@/features/products/components/buttons/HandleCart";
import { ChangeStateAtDetailPage } from "@/features/products/components/buttons/ChangeStateAtBottomDetailPage";
import { ProductGrid } from "@/features/products/components/ProductCard";
import { CartTab } from "@/features/cart/components/cartTab";
import Link from "next/link";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface ProductInfo {
  _id: string;
  product_name: string;
  product_price: number;
  product_description: string;
  product_images: [];
  product_quantity: number;
  product_prevPrice: string;
  product_attributes: {
    brand: string;
    material: string;
    model: string;
  };
  product_type: string;
  product_shop: string;
  product_thumb: string;
  product_slug: string;
  cartRem: number;
}

type Params = Promise<{
  productId: string;
  slug: string;
}>

const ProductDetail = async ({ params }: { params: Params }) => {
  const { productId, slug } =  await params 

  const productDetails : ProductInfo = await getProductDetail(productId)
  
  

  
  
  const productsByCategory: ProductInfo[] = await getRelatedProductByCategory(productDetails.product_type,productDetails._id)
  
  return (
    <section className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* cardLeft: Image Slider */}
          <div className="w-full">
            <BtnToSlideImagesProduct productDetails={productDetails} />
          </div>

          {/* card right: Product Info */}
          <div className="w-full">
            <div className="flex flex-col gap-4">
              {/* Breadcrumbs */}
              <nav className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                <Link href="/" className="hover:text-[#0573f0] transition-colors">Home</Link>
                <span>/</span>
                <Link
                  href={`/products?category=${productDetails.product_type}&page=1`}
                  className="hover:text-[#0573f0] transition-colors capitalize"
                >
                  {productDetails.product_type}
                </Link>
                <span>/</span>
                <span className="text-slate-800 font-medium line-clamp-1 max-w-[200px] sm:max-w-xs">
                  {productDetails.product_name}
                </span>
              </nav>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
                {productDetails.product_name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                {productDetails.product_prevPrice && (
                  <span className="text-base sm:text-lg line-through text-slate-400">
                    ${productDetails.product_prevPrice}.00
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-bold text-[#0573f0]">
                  ${productDetails.product_price}.00
                </span>
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 text-xs sm:text-sm pt-1">
                <span className="text-slate-500 font-medium">Availability:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60 text-xs">
                  In stock ({productDetails.product_quantity} available)
                </span>
              </div>

              {/* Specifications */}
              {productDetails.product_attributes && (
                <div className="pt-3 pb-2 border-t border-b border-slate-100 my-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 mb-2">Specifications:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600">
                    {productDetails.product_attributes.brand && (
                      <li className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">Brand:</span>
                        <span>{productDetails.product_attributes.brand}</span>
                      </li>
                    )}
                    {productDetails.product_attributes.model && (
                      <li className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">Model:</span>
                        <span>{productDetails.product_attributes.model}</span>
                      </li>
                    )}
                    {productDetails.product_attributes.material && (
                      <li className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">Material:</span>
                        <span>{productDetails.product_attributes.material}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Add to Cart Stepper & Button */}
              <div className="pt-2">
                <HandleCart
                  name={productDetails.product_name}
                  productId={productDetails._id}
                  shopId={productDetails.product_shop}
                  price={productDetails.product_price}
                  imgThumb={productDetails.product_thumb}
                  slug={slug}
                />
              </div>

              {/* Category tag */}
              <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
                <span className="font-medium">Category:</span>
                <Link
                  href={`/products?category=${productDetails.product_type}&page=1`}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0573f0] transition-colors font-medium cursor-pointer"
                >
                  {productDetails.product_type}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description & Reviews */}
      <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-16">
        <Suspense fallback={null}>
          <ChangeStateAtDetailPage
            productId={productDetails._id}
            product_name={productDetails.product_name}
            product_description={productDetails.product_description}
            product_thumb={productDetails.product_thumb}
            product_images={productDetails.product_images}
          />
        </Suspense>
      </section>

      {/* Related Products */}
      <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-20">
        <div>
          <h2 className="pb-6 text-xl sm:text-2xl font-bold text-slate-900">Related products</h2>
          <ProductGrid products={productsByCategory} cartRem={1} numOfProduct={6}/>               
        </div>
      </section>
      
      {/* Cart Drawer */}
      <div>
        <CartTab />
      </div>
    </section>
  );
};

export default ProductDetail;
