import Image from "next/image";
import Link from "next/link";

interface NotFoundProductsProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  showAction?: boolean;
  className?: string;
}

export default function NotFoundProducts({
  title = "No Products Found",
  description = "Your product list is currently empty.",
  actionText = "+ Add New Product",
  actionHref = "/user/shop/product",
  showAction = true,
  className = "",
}: NotFoundProductsProps = {}) {
  return (
    <div className={`py-8 sm:py-12 px-4 text-center flex flex-col items-center justify-center max-w-md mx-auto ${className}`}>
      {/* Responsive image container */}
      <div className="relative w-36 sm:w-48 lg:w-56 aspect-[2/1] mb-4">
        <Image
          src="/no_products.png"
          alt={title}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 640px) 144px, (max-width: 1024px) 192px, 224px"
        />
      </div>

      {/* Typography */}
      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mb-5 leading-relaxed">
        {description}
      </p>

      {/* CTA Button */}
      {showAction && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 bg-[#0573f0] hover:bg-[#0769da] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
        >
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
}