import Image from "next/image";
import { useState, useEffect, cache } from "react";
import { ProductGrid } from "@/features/products/components/ProductCard";
import dotenv from "dotenv";
import Carousel from "@/shared/carousel";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
dotenv.config();
import styles from "./home.module.scss";
import {
  faTruckFast,
  faCommentDots,
  faRotateLeft,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";

//get Data
import { getProductsHotDeals } from "@/features/products/data/data";


//////
export default async function Home() {
  const productsHotDeal = await getProductsHotDeals();
  console.log('slug', productsHotDeal);
  type image = {
    name: string;
    url: string;
  };

  type Services = {
    icon: any;
    name: string;
    text: string;
  };

  type Elements = {
    name: string;
    title: string;
    decriptions: string;
    image: string;
  };

  const categoriesProduct: image[] = [
    {
      name: "AIR CONDITIONER",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-06.jpg",
    },
    {
      name: "AUDIO & VIDEO",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-08.jpg",
    },
    {
      name: "KITCHEN APPLIANCES",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-05.jpg",
    },
    {
      name: "PCS & LAPTOP",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-03.jpg",
    },
    {
      name: "PHONES",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-02.jpg",
    },
    {
      name: "HOME APPLIANCES",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-07.jpg",
    },
    {
      name: "REFRIGERATOR",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-04.jpg",
    },
    {
      name: "SMART HOME",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-category-image-01.jpg",
    },
  ];

  const bodyBanner: image[] = [
    {
      name: "banner 1",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-promotional-banner-2.jpg",
    },
    {
      name: "banner 2",
      url: "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-promotional-banner-1.jpg",
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

  return (
    <div className="container-fluid bg-[#f8fbfc]">
      <section className="banner">
        <Carousel />
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
            <div className={`categoriesProduct__section_container`}>
              <ul className={`elementor_col grid grid-cols-12 `}>
                {categoriesProduct.map((product) => {
                  return (
                    <li
                      key={categoriesProduct.indexOf(product)}
                      className={`${styles.elementor_elenment} col-span-3 text-center bg-white py-10`}
                    >
                      <a href="#">
                        <img src={product.url} alt={product.name} />
                        <div className="flex flex-col">
                          <p className="font-bold text-lg">{product.name}</p>
                          <span>see more</span>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </section>

      <section className={`${styles.banner}`}>
        <div className={`${styles.banner_container} grid grid-cols-12 gap-10`}>
          {bodyBanner.map((banner) => {
            return (
              <div key={bodyBanner.indexOf(banner)} className="col-span-6">
                <a href="#">
                  <img src={banner.url} alt={banner.name} />
                </a>
              </div>
            );
          })}
        </div>
      </section>
      <section className={`${styles.hotdeal_products}`}>
        <div
          className={`${styles.hotdeal_products_container} shadow-lg shadow-[0px_12px_0px_-6px_rgba(0, 0, 0, 0.04)]`}
        >
          <div className={`${styles.hotdeal_title}`}>
            Today's best deal
            <span className={`${styles.seemore}`}>
              <a href="/">see more</a>{" "}
            </span>
          </div>
          <ProductGrid products={productsHotDeal.metadata} />
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
                  <a className="text-[#1a5bd5] font-bold text-sm" href="/" >Shop now</a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
