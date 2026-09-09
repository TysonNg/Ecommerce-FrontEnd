import { ProductGrid } from "@/features/products/components/ProductCard";
import dotenv from "dotenv";
import {
  FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";
dotenv.config();
import styles from "./home.module.scss";
import {
  faTruckFast,
  faCommentDots,
  faRotateLeft,
  faCreditCard,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";


import { getProductByCategory, getProductsHotDeals } from "@/features/products/data/data";
import { CartTab } from "@/features/cart/components/cartTab";
import Image from "next/image";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type Product = {
    _id: string;
    product_name: string;
    product_prevPrice?: number | string;
    product_price:number;
    product_shop: string;
    product_slug: string;
    product_thumb: string;
    cartRem: number;
}




//////
export default async function Home() {

  const productsHotDeal: Product[] = await getProductsHotDeals();
  const productsElectronics: Product[] = await getProductByCategory('electronics', 4);
  const productsLaptop: Product[] = await getProductByCategory('laptop', 4);
  const productsGadget: Product[] = await getProductByCategory('gadget', 4);
  const productsKitchenAppliances: Product[] = await getProductByCategory('kitchenAppliances', 4);
  
  
  type Image = {
    name: string;
    url: string;
    link: string;
  };

  type Services = {
    icon: IconDefinition;
    name: string;
    text: string;
  };

  type Elements = {
    name: string;
    title: string;
    decriptions: string;
    image: string;
  };

  const categoriesProduct: Image[] = [
    {
      name: "AIR CONDITIONER",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-06.jpg",
      link: "#"
    },
    {
      name: "AUDIO & VIDEO",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-08.jpg",
      link: "/products?category=audioVideo&&page=1"
    },
    {
      name: "KITCHEN APPLIANCES",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-05.jpg",
      link: "/products?category=kitchenAppliances&&page=1"
    },
    {
      name: "PCS & LAPTOP",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-03.jpg",
      link: "/products?category=laptop&&page=1"
    },
    {
      name: "GADGET",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-02.jpg",
      link: "/products?category=gadget&&page=1"
    },
    {
      name: "HOME APPLIANCES",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-07.jpg",
      link: "/products?category=homeAppliances&&page=1"
    },
    {
      name: "REFRIGERATOR",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-04.jpg",
      link: "/products?category=refrigerator&&page=1"
    },
    {
      name: "SMART HOME",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-01.jpg",
      link: "/products?category=smartHome&&page=1"
    },
  ];

  const bodyBanner: Image[] = [
    {
      name: "banner 1",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-promotional-banner-2.jpg",
      link: "#"
    },
    {
      name: "banner 2",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-promotional-banner-1.jpg",
      link: "#"
    },
  ];

  const services: Services[] = [
    {
      icon: faTruckFast,
      name: "Free shipping",
      text: "When you spend $80 or more",
    },
    {
      icon: faCommentDots,
      name: "We are available 24/7",
      text: "Need help? contact us anytime",
    },
    {
      icon: faRotateLeft,
      name: "Satisfied or return",
      text: "Easy 30-day return policy",
    },
    {
      icon: faCreditCard,
      name: "100% secure payments",
      text: "Visa, Mastercard, Stripe, PayPal",
    },
  ];

  const elements: Elements[] = [
    {
      name: "headphone",
      title: "Wireless headphones",
      decriptions: "Starting at $49",
      image: "/headphoneImage.png",
    },
    {
      name: "grooming",
      title: "Grooming",
      decriptions: "Starting at $49",
      image: "/groomImage.png",
    },
    {
      name: "game",
      title: "Video game",
      decriptions: "Starting at $49",
      image: "/gamesImage.png",
    },
  ];

  const topBrands = [
    {
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-top-brand-logo-6.svg"
    },
    {
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-top-brand-logo-5.svg"
    },
    {
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-top-brand-logo-4.svg"
    },
    {
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-top-brand-logo-3.svg"
    },
    {
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-top-brand-logo-2.svg"
    },
    {
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-top-brand-logo-1.svg"
    },
    
  ]
   
  return (
    <>
      <div className="bg-[#f8fbfc] overflow-x-hidden w-full max-w-full">
        {/* Hero Banner */}
        <section className="banner w-full">
          <div className="w-full h-[260px] sm:h-[400px] lg:h-[550px] relative overflow-hidden">
            <Image className="object-cover" src="/banner.jpg" fill alt="banner" priority />
          </div>
        </section>

        {/* Body Top: Services & Categories */}
        <section className={`${styles.body_top} px-4`}>
          <div className={`${styles.body__top_container}`}>
            {/* Services bar */}
            <section className={`${styles.services__section}`}>
              <div className={`${styles.services__section_container} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`}>
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-4 p-2">
                    <span className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-[#0573f0]">
                      <FontAwesomeIcon className="text-xl" icon={service.icon} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-bold text-slate-800">{service.name}</p>
                      <p className="text-xs text-slate-500 leading-snug">{service.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Product categories grid */}
            <section className={`${styles.categoriesProduct__section}`}>
              <div className="bg-white">
                <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6">
                  {categoriesProduct.map((product, index) => (
                    <li key={index} className="text-center p-4 rounded-xl hover:bg-slate-50 transition-colors">
                      <Link href={product.link} className="flex flex-col items-center group">
                        <div className="relative w-full max-w-[160px] sm:max-w-[200px] h-[120px] sm:h-[150px] mb-3">
                          <Image
                            src={product.url}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 160px, 200px"
                            className="object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <p className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-[#0573f0] transition-colors">{product.name}</p>
                        <span className="text-xs text-[#0573f0] font-medium mt-1">Shop now →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </section>

        {/* Promo Banners */}
        <section className={`${styles.banner} px-4`}>
          <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {bodyBanner.map((banner, index) => (
              <div key={index} className="w-full rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                <Link href="/products" className="block relative w-full aspect-[588/160]">
                  <Image src={banner.url} alt={banner.name} fill sizes="(max-width: 640px) 100vw, 600px" className="object-cover" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Hot Deals */}
        <section className={`${styles.hotdeal_products} px-4`}>
          <div className={`${styles.hotdeal_products_container} w-full max-w-[1200px] mx-auto shadow-sm bg-white`}>
            <div className={`${styles.hotdeal_title}`}>
              Today&apos;s best deal
              <span className={`${styles.seemore}`}>
                <Link href="/products?page=1">see more</Link>
              </span>
            </div>
            <ProductGrid products={productsHotDeal} numOfProduct={6} cartRem={1} />
          </div>
        </section>

        {/* Highlight Elements */}
        <section className={`${styles.elements} px-4`}>
          <div className={`${styles.elements_container} w-full max-w-[1200px] mx-auto`}>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {elements.map((element, index) => (
                <li key={index} className={`${styles[element.name]} flex flex-col justify-between min-h-[170px]`}>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{element.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{element.decriptions}</p>
                  </div>
                  <div className="mt-4">
                    <Link className="text-[#0573f0] font-bold text-sm hover:underline" href="/products">
                      Shop now →
                    </Link>
                  </div>
                  <div className={`${styles.element_image}`}>
                    <img className="w-auto h-auto max-h-[110px]" alt={element.name} src={element.image} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Electronics Shelf */}
        <section className="mt-10 px-4">
          <div className="w-full max-w-[1200px] border border-[#dce3e5] mx-auto shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="text-lg font-bold p-4 flex items-center justify-between border-b border-slate-100">
              <span>Electronics</span>
              <Link href="/products?category=electronics&&page=1" className="text-sm text-[#0573f0] font-semibold hover:underline">
                see more →
              </Link>
            </div>
            <ProductGrid products={productsElectronics} numOfProduct={4} cartRem={1} />
          </div>
        </section>

        {/* PC & Laptop Shelf */}
        <section className="mt-10 px-4">
          <div className="w-full max-w-[1200px] border border-[#dce3e5] mx-auto shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="text-lg font-bold p-4 flex items-center justify-between border-b border-slate-100">
              <span>PC & Laptop</span>
              <Link href="/products?category=laptop&&page=1" className="text-sm text-[#0573f0] font-semibold hover:underline">
                see more →
              </Link>
            </div>
            <ProductGrid products={productsLaptop} numOfProduct={4} cartRem={1} />
          </div>
        </section>

        {/* Full-width Promotional Banner */}
        <section className="mt-10 px-4">
          <div className="w-full max-w-[1200px] mx-auto rounded-xl overflow-hidden shadow-xs">
            <Link href="/products" className="block relative w-full aspect-[10/1] min-h-[72px] sm:min-h-0">
              <Image
                src="https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-promotional-banner-fwidth-1.jpg"
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                alt="banner"
                className="object-cover object-left sm:object-center"
              />
            </Link>
          </div>
        </section>

        {/* Gadgets Shelf */}
        <section className="mt-10 px-4">
          <div className="w-full max-w-[1200px] border border-[#dce3e5] mx-auto shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="text-lg font-bold p-4 flex items-center justify-between border-b border-slate-100">
              <span>Gadgets</span>
              <Link href="/products?category=gadget&&page=1" className="text-sm text-[#0573f0] font-semibold hover:underline">
                see more →
              </Link>
            </div>
            <ProductGrid products={productsGadget} numOfProduct={4} cartRem={1} />
          </div>
        </section>

        {/* Kitchen Appliances Shelf */}
        <section className="mt-10 px-4">
          <div className="w-full max-w-[1200px] border border-[#dce3e5] mx-auto shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="text-lg font-bold p-4 flex items-center justify-between border-b border-slate-100">
              <span>Kitchen appliances</span>
              <Link href="/products?category=kitchenAppliances&&page=1" className="text-sm text-[#0573f0] font-semibold hover:underline">
                see more →
              </Link>
            </div>
            <ProductGrid products={productsKitchenAppliances} numOfProduct={4} cartRem={1} />
          </div>
        </section>

        {/* Brand's Deal Banner */}
        <section className="mt-10 px-4">
          <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden border border-[#dce3e5] bg-white">
            <div className="p-6 sm:p-10 flex flex-col justify-center">
              <div className="flex flex-col gap-3">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brand&apos;s deal</h2>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  Save up to $200 on select Samsung washing machine
                </p>
                <p className="text-sm text-slate-500">Tortor purus et quis aenean tempus tellus fames.</p>
                <Link href="/products" className="text-[#0573f0] font-bold text-sm hover:underline mt-2">
                  Shop now →
                </Link>
              </div>
            </div>
            <div className="relative min-h-[220px] sm:min-h-[300px]">
              <Image
                src="https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-promotional-banner-hwidth-1.jpg"
                alt="banner"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Top Brands Grid */}
        <section className="my-10 px-4">
          <div className="w-full max-w-[1200px] mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Top brands</h2>
            <ul className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {topBrands.map((img, i) => (
                <li
                  key={i}
                  className="border border-[#dce3e5] p-3 sm:p-4 bg-white flex items-center justify-center rounded-xl hover:shadow-sm transition-shadow h-20"
                >
                  <div className="relative w-16 h-12">
                    <Image src={img.url} alt="imageTopBrand" fill sizes="64px" className="object-contain" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Slide-over Cart Tab */}
        <section className={styles.cartTab}>
          <CartTab />
        </section>
      </div>
    </>
  );
}
