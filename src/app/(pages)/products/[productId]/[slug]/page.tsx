import { getProductDetail, getRelatedProductByCategory } from "@/features/products/data/data";
import styles from "./detail.module.scss";
import { BtnToSlideImagesProduct } from "@/features/products/components/buttons/BtnToSlideImageProduct";
import HandleCart from "@/features/products/components/buttons/HandleCart";
import { ChangeStateAtDetailPage } from "@/features/products/components/buttons/ChangeStateAtBottomDetailPage";
import { ProductGrid } from "@/features/products/components/ProductCard";
import { CartTab } from "@/features/cart/components/cartTab";
import Link from "next/link";

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
    <section className={`${styles.body}`}>
      <section className={`${styles.top_body}`}>
        <div className={`${styles.top_body_container} flex flex-row`}>
          {/* cardLeft */}

          <BtnToSlideImagesProduct productDetails={productDetails} />

          {/* card right */}
          <div className={`${styles.infoDetail} pl-6`}>
            <div
              className={`${styles.infoDetail_container} flex flex-col gap-2`}
            >
              <div className={`${styles.navLink} text-[#48515b] text-sm`}>
                <span>
                  <Link href="/">Home</Link> /
                  <Link href={`/products?category=${productDetails.product_type}&&page=1`}>{productDetails.product_type}</Link> /
                  {productDetails.product_name}
                </span>
              </div>
              <div className={`${styles.infoList} `}>

                <ul>
                  <li className={`${styles.name} font-semibold text-xl`}>
                    {productDetails.product_name}
                  </li>
                  <li className={`${styles.prices} pt-2`}>
                    <p>
                      <span className="text-xl line-through text-[#48515b]">
                        {productDetails.product_prevPrice
                          ? `$${productDetails.product_prevPrice}.00`
                          : ""}
                      </span>
                      <span className="text-xl font-semibold pl-4">
                        ${productDetails.product_price}.00
                      </span>
                    </p>
                  </li>

                  <li className="pt-5 flex flex-row gap-2 text-sm">
                        <p className="text-[#6b6969] font-bold">
                          Quantity:
                        </p>
                        <span>{productDetails.product_quantity}</span>
                  </li>

                  <li className={`${styles.detail} pt-5 `}>
                    <p className="font-semibold text-sm">Detail:</p>
                <ul className={`${styles.detail_container} pl-10 pt-3 list-disc`}>
                    <li><span className="font-semibold">Brand: </span> {productDetails.product_attributes.brand}</li> 
                    <li><span className="font-semibold">Model: </span> {productDetails.product_attributes.model}</li> 
                    <li><span className="font-semibold">Material: </span>{productDetails.product_attributes.material}</li> 
                </ul> 
                  </li>
                  <li className={`${styles.cart}`}>
                      <HandleCart name={productDetails.product_name} productId = {productDetails._id} shopId= {productDetails.product_shop} price={productDetails.product_price} imgThumb={productDetails.product_thumb} slug={slug}/>
                  </li>
                 
                  
                  <li className="flex flex-row gap-2 text-sm pt-5">
                        <p className="text-[#6b6969] font-bold">Category: </p>
                        <span className="text-[#48515b]">
                          <Link className="cursor-pointer" href={`/products?category=${productDetails.product_type}&&page=1`}>{productDetails.product_type}</Link>
                        </span>
                  </li>       
                </ul>

              </div>    
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.bottom_body} mt-20`}>
        <ChangeStateAtDetailPage product_name={productDetails.product_name} product_description={productDetails.product_description} product_thumb={productDetails.product_thumb} product_images={productDetails.product_images} />
      </section>

      <section className={`${styles.relate_product} mt-15`}>
        <div className={`${styles.relate_product_container}`}>
          <p className="font-bold text-2xl pb-5">Related products</p>
          <ProductGrid products={productsByCategory} cartRem={5} numOfProduct={6}/>               
        </div>
      </section>
      <section className={`${styles.cartTab} `}>
            <CartTab />
        </section>
    </section>
  );
};

export default ProductDetail;
