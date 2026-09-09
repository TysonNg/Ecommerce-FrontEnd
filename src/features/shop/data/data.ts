const apiKey: string = `${process.env.NEXT_PUBLIC_API_KEY}`;
const rootApi: string = `${process.env.NEXT_PUBLIC_API_URL}`;

export interface SampleProduct {
  _id: string;
  product_name: string;
  product_thumb: string;
  product_slug: string;
  product_price: number;
}

export interface PublicShop {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  createdAt?: string;
  productCount?: number;
  sampleProducts?: SampleProduct[];
}

export interface ShopProductsResponse {
  shop: PublicShop;
  products: any[];
  categories: string[];
  total: number;
  page: number;
  limit: number;
}

export const getPublicShop = async (idOrSlug: string): Promise<PublicShop | null> => {
  try {
    const res = await fetch(`${rootApi}/shop/public/${idOrSlug}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
      next: { revalidate: 60, tags: [`shop-${idOrSlug}`] },
    });
    if (!res.ok) return null;
    const { metadata } = await res.json();
    return metadata;
  } catch (error) {
    console.error("Error fetching public shop:", error);
    return null;
  }
};

export const getAllPublicShops = async (): Promise<PublicShop[]> => {
  try {
    const res = await fetch(`${rootApi}/shop/public/all`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
      next: { revalidate: 60, tags: ["all-public-shops"] },
    });
    if (!res.ok) return [];
    const { metadata } = await res.json();
    return metadata || [];
  } catch (error) {
    console.error("Error fetching all public shops:", error);
    return [];
  }
};

export const getShopProducts = async (
  idOrSlug: string,
  category?: string,
  search?: string
): Promise<ShopProductsResponse> => {
  try {
    const params = new URLSearchParams();
    if (category && category !== "all") {
      params.set("category", category);
    }
    if (search && search.trim()) {
      params.set("search", search.trim());
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${rootApi}/product/shop/${idOrSlug}${query}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
      next: { revalidate: 60, tags: [`shop-products-${idOrSlug}`] },
    });
    if (!res.ok) {
      return { shop: null as any, products: [], categories: [], total: 0, page: 1, limit: 50 };
    }
    const { metadata } = await res.json();
    return metadata;
  } catch (error) {
    console.error("Error fetching shop products:", error);
    return { shop: null as any, products: [], categories: [], total: 0, page: 1, limit: 50 };
  }
};
