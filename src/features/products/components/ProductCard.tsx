"use client";
import Image from "next/image";
import styles from "./productCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Cookies from "js-cookie";
import { addToCart } from "@/features/cart/actions/addToCart";
import { useToast } from "@/app/context/ToastContext";
import { useModal } from "@/app/context/ModalContext";

interface ProductCardProps {
  _id: string;
  product_name: string;
  product_prevPrice: string;
  product_price: number;
  product_shop: string;
  product_slug: string;
  product_thumb: string;
  cartRem: number;
  product_ratingsAverage?: number;
  product_ratingsAvenrage?: number;
  product_reviewsCount?: number;
}

interface Products {
  products: ProductCardProps[];
  cartRem: number;
  numOfProduct: number;
}

export function ProductGrid(props: Products) {
  const { products, cartRem, numOfProduct } = props;

  return (
    <div className={`${styles.productCard_container} w-full`}>
      <ul
        className={`grid ${
          numOfProduct === 4
            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
        } gap-3 sm:gap-5 lg:gap-6 items-stretch mb-12`}
      >
        {products?.map((product) => (
          <ProductCard key={product._id} {...product} cartRem={cartRem} />
        ))}
      </ul>
    </div>
  );
}

export function ProductCard(props: ProductCardProps) {
  const {
    _id,
    product_name,
    product_price,
    product_thumb,
    product_prevPrice,
    product_slug,
    product_shop,
    cartRem,
    product_ratingsAverage,
    product_ratingsAvenrage,
    product_reviewsCount,
  } = props;

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const { toast } = useToast();
  const { openCartModal } = useModal();

  const guestId = Cookies.get("guestId");
  const tempId = Cookies.get("tempId");
  if (!tempId) {
    Cookies.set("tempId", guestId ?? "", { expires: 365 * 100 });
  }

  const ratingValue = product_ratingsAverage ?? product_ratingsAvenrage ?? 0;
  const roundedRating = Math.round(Number(ratingValue));
  const reviewsCount = Number(product_reviewsCount || 0);

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isAdding) return;

    setIsAdding(true);
    const userId = Cookies.get(`_id`);
    const cartUserId: string | undefined = Cookies.get(`cartId_${userId}`);

    try {
      const res = await addToCart({
        userId: cartUserId ? cartUserId : tempId ?? "",
        product: {
          productId: _id,
          shopId: product_shop,
          name: product_name,
          price: product_price,
          imgThumb: product_thumb,
          slug: product_slug,
          quantity: 1,
        },
      });

      if (res?.metadata?.cart_products) {
        localStorage.setItem("cartQuantity", res.metadata.cart_products.length);
      }
      window.dispatchEvent(new Event("cartQuantityStorage"));

      setIsAdding(false);

      // Trigger modern Toast notification
      toast.success({
        title: "Added to cart!",
        message: "Item has been added to your shopping cart.",
        product: {
          name: product_name,
          price: product_price,
          thumb: product_thumb,
          quantity: 1,
        },
        actionLabel: "View Cart",
        onAction: () => openCartModal(),
      });

      return res;
    } catch (error) {
      console.log("error addToCart", error);
      setIsAdding(false);
      toast.error({
        title: "Could not add to cart",
        message: "Something went wrong. Please try again!",
      });
    }
  };

  const renderRatingStars = () => (
    <div className="pt-0.5 pb-1 flex items-center">
      <a
        href={`/products/${_id}/${product_slug}?tab=reviews#reviews`}
        className="flex items-center gap-1 sm:gap-1.5 group/stars cursor-pointer"
        title={
          reviewsCount > 0
            ? `${reviewsCount} customer review${reviewsCount > 1 ? "s" : ""}`
            : "No reviews yet"
        }
      >
        <div className="flex text-[10px] sm:text-[11px] gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesomeIcon
              key={star}
              icon={faStar}
              className={
                reviewsCount > 0 && star <= roundedRating
                  ? "text-[#f59e0b]"
                  : "text-slate-200"
              }
            />
          ))}
        </div>
        <span className="text-[10px] sm:text-xs text-[#5e6d73] group-hover/stars:text-[#0573f0] transition-colors">
          ({reviewsCount})
        </span>
      </a>
    </div>
  );

  return (
    <li
      key={_id}
      className="group flex flex-col justify-between p-2.5 sm:p-4 bg-white rounded-xl border border-slate-100/90 hover:border-blue-100 hover:shadow-md transition-all duration-300 relative text-dark h-full list-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-square flex items-center justify-center bg-slate-50/50 rounded-lg overflow-hidden mb-2">
        <a href={`/products/${_id}/${product_slug}`} className="w-full h-full flex items-center justify-center">
          {Boolean(product_prevPrice) && (
            <span
              className="absolute top-2 left-2 z-10 border border-slate-200 bg-white/95 backdrop-blur-xs rounded-full text-[10px] sm:text-xs font-semibold text-slate-700 px-2 py-0.5 shadow-2xs"
            >
              Sale!
            </span>
          )}
          <Image
            src={product_thumb}
            alt={product_name}
            width={300}
            height={300}
            className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </a>
        <button
          type="button"
          onClick={(e) => handleAddToCart(e)}
          disabled={isAdding}
          aria-label="Add to cart"
          className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 text-slate-700 hover:text-[#0573f0] hover:bg-blue-50 text-xs sm:text-sm cursor-pointer absolute top-2 right-2 z-10 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/90 shadow-sm border border-slate-200/80 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faCartShopping} />
        </button>
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div>
          <a
            href={`/products/${_id}/${product_slug}`}
            className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-[#0573f0] transition-colors line-clamp-2 min-h-[32px] sm:min-h-[40px] leading-tight sm:leading-snug"
          >
            {product_name}
          </a>

          {/* Rating stars and review count */}
          {renderRatingStars()}
        </div>

        <div className="mt-1 pt-1">
          {product_prevPrice ? (
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-xs line-through text-slate-400">
                ${product_prevPrice}.00
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                ${product_price}.00
              </span>
            </div>
          ) : (
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              ${product_price}.00
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
