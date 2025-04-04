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
    product_prevPrice: string;
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
      <div className="container-fluid bg-[#f8fbfc]">
        <section className="banner">
          <div className="w-full h-[650px] mx-auto my-0 relative">
            <Image className=" object-cover" src="/banner.jpg" fill alt="banner"/>
          </div>
        </section>

        <section className={`${styles.body_top}`}>
          <div className={`${styles.body__top_container}`}>
            <section className={`${styles.services__section} bg-white`}>
              <div
                className={`${styles.services__section_container} flex flex-row gap-15 `}
              >
                {services.map((service) => {
                  return (
                    <div
                      key={services.indexOf(service)}
                      className={`${styles.wrap_services} flex gap-4`}
                    >
                      <span className="content-center">
                        <FontAwesomeIcon
                          className="text-[#3e74ee] text-4xl"
                          icon={service.icon}
                        />
                      </span>
                      <div>
                        <p className="text-base font-bold">{service.name}</p>
                        <p className="text-sm text-nowrap text-[#6e97a5]">
                          {service.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            <section className={`${styles.categoriesProduct__section}`}>
              <div className={`categoriesProduct__section_container bg-white`}>
                <ul className={`elementor_col grid grid-cols-12 `}>
                  {categoriesProduct.map((product) => {
                    return (
                      <li
                        key={categoriesProduct.indexOf(product)}
                        className={`${styles.elementor_elenment} col-span-3 text-center bg-white py-10`}
                      >
                        <Link href={product.link}>
                          <Image src={product.url} width={300} height={200} alt={product.name} />
                          <div className="flex flex-col">
                            <p className="font-bold text-lg">{product.name}</p>
                            <span>see more</span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          </div>
        </section>

        <section className={`${styles.banner}`}>
          <div className={`${styles.banner_container} grid grid-cols-12 gap-10 `}>
            {bodyBanner.map((banner) => {
              return (
                <div key={bodyBanner.indexOf(banner)} className="col-span-6  w-full h-auto">
                  <Link href="#">
                    <Image src={banner.url} width={580} height={200} alt={banner.name} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`${styles.hotdeal_products}`}>
          <div
            className={`${styles.hotdeal_products_container} shadow-lg shadow-[0px_12px_0px_-6px_rgba(0, 0, 0, 0.04)] bg-white`}
          >
            <div className={`${styles.hotdeal_title}`}>
              Today&apos;s best deal
              <span className={`${styles.seemore} `}>
                <Link href="#" >see more</Link>
              </span>
            </div>
            <ProductGrid products={productsHotDeal} numOfProduct={6}  cartRem = {5}/>
          </div>
        </section>

        <section className={`${styles.elements} `}>
          <div className={`${styles.elements_container}`}>
            <ul className="grid grid-cols-12 min-h-[304px]">
              {elements.map((element) => {
                return (
                  <li key={elements.indexOf(element)} className={`${styles[element.name]} flex flex-col gap-2 col-span-4`}>
                    <p className={`${styles[element.title]} text-3xl font-semibold`}>{element.title}</p>
                    <p className={`${styles[element.decriptions]} text-[#647075]`}>
                      {element.decriptions}
                    </p>
                    <div className={`${styles.element_image}`}>
                      <Image className={`${styles.image}`} alt={element.name} src={element.image} width={200} height={200} />
                    </div>
                    <Link className="text-[#1a5bd5] font-bold text-sm" href="#" >Shop now</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className={`${styles.electronics}  mt-[40px] px-[40px] py-0 bg-[#f8fbfc]`}>
          <div
            className={`${styles.electronics_container} w-[1200px] border border-[#dce3e5] mx-auto my-0 shadow-lg shadow-[0px_12px_0px_-6px_rgba(0, 0, 0, 0.04)] bg-white`}
          >
            <div className={`${styles.electronics_title} text-[1.2rem] font-bold p-[1rem] `}>
              Electronics
              <span className={`${styles.seemore} `}>
                <Link href="/products?category=electronics&&page=1" className="text-[1rem] text-[#5774e9] text-sm pl-[0.7rem] font-bold">see more</Link>
              </span>
            </div>
            <ProductGrid products={productsElectronics} numOfProduct={4} cartRem = {1}/>
          </div>
        </section>

        <section className={`  mt-[40px] px-[40px] py-0 bg-[#f8fbfc]`}>
          <div
            className={` w-[1200px] border border-[#dce3e5] mx-auto my-0 shadow-lg shadow-[0px_12px_0px_-6px_rgba(0, 0, 0, 0.04)] bg-white`}
          >
            <div className={`text-[1.2rem] font-bold p-[1rem] `}>
              PC&Laptop
              <span >
                <Link href="/products?category=laptop&&page=1" className="text-[1rem] text-[#5774e9] text-sm pl-[0.7rem] font-bold">see more</Link>
              </span>
            </div>
            <ProductGrid products={productsLaptop} numOfProduct={4} cartRem = {1}/>
          </div>
        </section>

        <section >
              <div className="w-[1200px] mx-auto mt-[40px] ">
                  <Image className="cursor-pointer" src='/bannerLaptop.jpg' width={1200} height={120} alt="banner"/>
              </div>
        </section>

        <section className={`mt-[40px] px-[40px] py-0 bg-[#f8fbfc]`}>
          <div
            className={` w-[1200px] border border-[#dce3e5] mx-auto my-0 shadow-lg shadow-[0px_12px_0px_-6px_rgba(0, 0, 0, 0.04)] bg-white`}
          >
            <div className={`text-[1.2rem] font-bold p-[1rem] `}>
              Gadgets
              <span >
                <Link href="/products?category=gadget&&page=1" className="text-[1rem] text-[#5774e9] text-sm pl-[0.7rem] font-bold">see more</Link>
              </span>
            </div>
            <ProductGrid products={productsGadget} numOfProduct={4} cartRem = {1}/>
          </div>
        </section>

        <section className={`mt-[40px] px-[40px] py-0 bg-[#f8fbfc]`}>
          <div
            className={` w-[1200px] border border-[#dce3e5] mx-auto my-0 shadow-lg shadow-[0px_12px_0px_-6px_rgba(0, 0, 0, 0.04)] bg-white`}
          >
            <div className={`text-[1.2rem] font-bold p-[1rem] `}>
              Kitchen appliances
              <span >
                <Link href="/products?category=kitchenAppliances&&page=1" className="text-[1rem] text-[#5774e9] text-sm pl-[0.7rem] font-bold">see more</Link>
              </span>
            </div>
            <ProductGrid products={productsKitchenAppliances} numOfProduct={4} cartRem = {1}/>
          </div>
        </section>

        <section>
          <div className="w-[1200px] mx-auto mt-[40px] grid grid-cols-6">
              <div className="col-span-3 bg-white">
                <div className="flex flex-col h-full w-3/4 item-center gap-5 mt-10 ml-10">
                  <h1 className="text-sm text-[#9ca7ab]">Brand&apos;s deal</h1>
                  <p className="text-2xl font-bold">Save up to $200 on select Samsung washing machine</p>
                  <p className="text-sm">Tortor purus et quis aenean tempus tellus fames.</p>
                  <Link href="#" className="text-[#0573f0] font-bold text-sm">Shop now</Link>
                </div>
              </div>
              <div className="col-span-3"> 
                  <Image src={`https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-promotional-banner-hwidth-1.jpg`} alt="banner" width={600} height={400} />
              </div>
          </div>
        </section>
        
        <section className="mb-[40px]">
              <div className="w-[1200px] mx-auto mt-[40px]">
                  <h1 className="font-bold text-xl">Top brands</h1>
                  <ul className="grid grid-cols-12 mt-5">
                    {
                      topBrands.map((img,i) => {
                        return(
                          <li key={i} className="border border-[#dce3e5] col-span-2 px-10 py-5 bg-white content-center justify-items-center">
                            <Image src={img.url} width={70} height={70} alt="imageTopBrand"/>
                          </li>
                        )
                      })
                    }
                  </ul>
                  
              </div>
        </section>
        
        
        <section className={`${styles.cartTab} `}>
            <CartTab />
        </section>
      </div>
    </>
  );
}
