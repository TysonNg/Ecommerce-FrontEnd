import Link from "next/link";
import Image from "next/image";

export interface ShopInfo {
  _id: string;
  name: string;
  slug?: string;
  logo?: string;
  description?: string;
  productCount?: number;
}

interface ShopSellerCardProps {
  shop?: ShopInfo | string;
}

export function ShopSellerCard({ shop }: ShopSellerCardProps) {
  if (!shop) return null;

  const isObject = typeof shop === "object";
  const shopId = isObject ? shop._id : shop;
  const shopName = isObject && shop.name ? shop.name : "Seller Store";
  const shopSlug = isObject && shop.slug ? shop.slug : shopId;
  const shopLogo = isObject ? shop.logo : undefined;
  const shopHref = `/shop/${shopSlug || shopId}`;

  const initial = (shopName || "S").charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
      <span className="font-medium">Seller:</span>
      <Link
        href={shopHref}
        className="group inline-flex items-center gap-2 hover:text-[#0573f0] transition-colors"
      >
        <div className="w-6 h-6 shrink-0 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
          {shopLogo ? (
            <Image
              src={shopLogo}
              alt={shopName}
              width={24}
              height={24}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-bold text-slate-700 text-[10px]">{initial}</span>
          )}
        </div>
        <span className="font-semibold text-slate-800 group-hover:text-[#0573f0] transition-colors hover:underline underline-offset-2">
          {shopName}
        </span>
      </Link>
    </div>
  );
}
