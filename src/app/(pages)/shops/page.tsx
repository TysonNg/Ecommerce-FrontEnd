import { Metadata } from "next";
import { getAllPublicShops } from "@/features/shop/data/data";
import { ShopsDirectoryView } from "@/features/shop/components/ShopsDirectoryView";

export const metadata: Metadata = {
  title: "Brand Stores Directory | Ecommerce",
  description: "Browse verified brand partners, authentic stores, and specialized vendor collections on Ecommerce.",
};

export const revalidate = 60;

export default async function ShopsPage() {
  const shops = await getAllPublicShops();

  return <ShopsDirectoryView initialShops={shops} />;
}
