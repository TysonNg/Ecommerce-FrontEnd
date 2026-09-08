'use client'
import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"

interface ProductInfo {
  _id: string;
  product_name: string;
  product_price: number;
  product_description: string;
  product_images: string[];
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

export function BtnToSlideImagesProduct({ productDetails }: { productDetails: ProductInfo }) {
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imgId, setImgId] = useState(1);

  const images = productDetails.product_images && productDetails.product_images.length > 0
    ? productDetails.product_images
    : [productDetails.product_thumb || "/banner.jpg"];

  const slideImage = useCallback(() => {
    if (showcaseRef.current && containerRef.current) {
      const displayWidth = containerRef.current.clientWidth;
      showcaseRef.current.style.transform = `translateX(-${(imgId - 1) * displayWidth}px)`;
    }
  }, [imgId]);

  useEffect(() => {
    slideImage();
    const handleResize = () => slideImage();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [slideImage]);

  return (
    <div className="w-full max-w-[600px] mx-auto">
      {/* Main image container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-2xs"
      >
        <div
          className="flex flex-row h-full transition-transform duration-500 ease-out"
          ref={showcaseRef}
        >
          {images.map((image: string, i: number) => (
            <div
              key={i}
              className="relative min-w-full h-full flex items-center justify-center p-4 sm:p-8"
            >
              <Image
                src={image}
                alt={`${productDetails.product_name} - image ${i + 1}`}
                fill
                priority={i === 0}
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          ))}
        </div>

        {/* Counter Badge */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-slate-900/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full pointer-events-none">
            {imgId} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto py-3 px-1 mt-1 scrollbar-thin">
          {images.map((image: string, i: number) => {
            const isActive = imgId === i + 1;
            return (
              <button
                type="button"
                key={i}
                onClick={() => setImgId(i + 1)}
                aria-label={`Select product image ${i + 1}`}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 bg-white border ${
                  isActive
                    ? "border-[#0573f0] ring-2 ring-blue-400/40 shadow-sm scale-105"
                    : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-contain p-1.5"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}