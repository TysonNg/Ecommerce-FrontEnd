"use client";
import { useEffect, useState } from "react";
import { getCartById } from "../data/data";
import Image from "next/image";

import HandleCart from "@/features/products/components/buttons/HandleCart";
import { useModal } from "@/app/context/ModalContext";
import NotFoundProducts from "./not-found";
import { deleteItemOfCart } from "../actions/deleteItemOfCart";
import Cookies from "js-cookie";
import { checkoutReview } from "../actions/reviewCheckout";

interface ProductsCart {
  name: string;
  price: number | undefined;
  productId: string;
  shopId: string;
  imgThumb: string;
  quantity: number | undefined;
  slug: string | undefined;
}

interface CheckoutRequest {
  userId: string;
  cartId: string;
  shop_order_ids: {
    shopId: string;
    shop_discount: CodeDiscount[];
    item_products: {
      price: number;
      quantity: number;
      productId: string;
    }[];
  }[];
}

interface CodeDiscount{
    codeId: string;
    shopId: string;
    userId: string
}
export function CartTab() {
  const id: string | undefined = Cookies.get("_id");
  const cartUserId: string | undefined = Cookies.get(`cartId_${id}`);
  const tempId: string | undefined = Cookies.get("tempId");
  const guestId: string | undefined = Cookies.get("guestId");

  const [cart, setCart] = useState<Array<ProductsCart>>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { closeCartModal, isCartModalOpen } = useModal();
  const [checkout, setCheckout] = useState<CheckoutRequest>({
    userId: id ?? guestId ?? "",
    cartId: cartUserId ?? tempId ?? "",
    shop_order_ids: [],
  });

  useEffect(() => {
    const fetchCart = async () => {
      
      try {
        const res = await getCartById();
        setCart(res.metadata.cart_products);

        return res;
      } catch (error) {
        console.log("err: getCart ", error);
      }
    };
      if(isCartModalOpen){
        fetchCart();
        
        window.addEventListener("cartQuantityStorage", fetchCart);
        return () => window.removeEventListener("cartQuantityStorage", fetchCart);
        
      }
      
    
  }, [isCartModalOpen]);

  useEffect(() => {
    if (cart.length > 0) {
      const updatedCheckout = {
        userId: id ?? guestId ?? "",
        cartId: cartUserId ?? tempId ?? "",
        shop_order_ids: cart?.map((item) => ({
          shopId: item?.shopId ?? "",
          shop_discount: [],
          item_products: [
            {
              price: item?.price ?? 0,
              quantity: item?.quantity ?? 0,
              productId: item?.productId ?? "",
            },
          ],
        })),
      };
      setCheckout(updatedCheckout);
    }
  }, [cart]);

  useEffect(() => {
    const total = cart.reduce(
      (acc, item: ProductsCart) =>
        acc + (item?.price ?? 0) * (item?.quantity ?? 1),
      0
    );
    setTotalPrice(total);

    if (isCartModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    const fetchCheckout = async () => {
      try {
        const res = await checkoutReview(
          checkout?.shop_order_ids[0]
            ? checkout
            : {
                userId: id ?? guestId ?? "",
                cartId: cartUserId ?? tempId ?? "",
                shop_order_ids: cart.map((item) => ({
                  shopId: item?.shopId ?? "",
                  shop_discount: [],
                  item_products: [
                    {
                      price: item?.price ?? 0,
                      quantity: item?.quantity ?? 0,
                      productId: item?.productId ?? "",
                    },
                  ],
                })),
              }
        );

        if (res.metadata) {
          sessionStorage.setItem(
            `reviewCheckout_${cartUserId}`,
            JSON.stringify(res.metadata)
          );
        }

        return res.metadata;
      } catch (error) {
        console.log("checkout", error);
      }
    };

    if(cart.length > 0){
      fetchCheckout();
    }
  }, [cart, isCartModalOpen]);

  const handleChangePrice = (newQuantity: number, productId: string) => {
    setCart((prevCart): ProductsCart[] => {
      const updatedCart = prevCart.map((item) =>
        item?.productId === productId
          ? { ...item, quantity: newQuantity }
          : { ...item }
      );

      return updatedCart;
    });
  };

  const handleDeleteItem = async (productId: string) => {
    const id = Cookies.get("_id");
    const cartUserId = Cookies.get(`cartId_${id}`);
    const tempId = Cookies.get("tempId");
    setCart((prevCart) =>
      prevCart.filter((item) => item?.productId !== productId)
    );
    const res = await deleteItemOfCart({
      userId: cartUserId ?? tempId,
      productId,
    });
    if (res) {
      localStorage.setItem("cartQuantity", `${cart.length - 1}`);
      window.dispatchEvent(new Event("cartQuantityStorage"));
    }
    return res;
  };

  return (
    
    <div>
        {isCartModalOpen && (
        <div className="fixed inset-0 w-full h-full backdrop-blur-sm bg-opacity-25 z-0 cursor-pointer" onClick={closeCartModal}>
        </div>
        )}
        
      <div
        className={`${
          isCartModalOpen ? "z-1" : "w-[0px]"
        } absolute top-0 right-0 overflow-hidden`}
      >
        <div
          className={`${
              isCartModalOpen ? `translate-x-0 ` : `translate-x-200`
          } cartTab_conatiner relative  bg-white w-[600px] h-[1300px] flex flex-col justify-between transition-transform duration-700 overflow-hidden`}
        >
          <div>
            <div className="mt-5 border-b border-[#dce3e5] text-[#737272] py-2 px-3 font-bold flex flex-row justify-between">
              <p>Shopping Cart</p>
              <span
                className="text-xl cursor-pointer "
                onClick={closeCartModal}
              >
                X
              </span>
            </div>
            <div className={`${cart ? "" : "hidden"} text-black px-3 pt-3`}>
              {cart?.map((product, i) => {
                return (
                  <div key={i} className="flex flex-row relative my-5">
                    <Image
                      src={`${product?.imgThumb}`}
                      alt="cartImg"
                      width={70}
                      height={20}
                    />
                    <div className="">
                      <a
                        href={`http://localhost:3000/products/${product?.productId}/${product?.slug}`}
                      >
                        <p className="text-wrap text-sm text-[#818283] w-[400px] pl-5">
                          {product?.name}
                        </p>
                      </a>
                      <div className="ml-5">
                        <HandleCart
                          cartTab={true}
                          productQuantityCartTab={product?.quantity ?? 1}
                          productIdCartTab={product?.productId}
                          shopIdCartTab={product?.shopId}
                          onHandleChangePrice={(newQuantity: number) => {
                            handleChangePrice(
                              newQuantity,
                              product?.productId ?? ""
                            );
                          }}
                        />
                        <button
                          className="text-[#d2dcdf] text-base place-self-end 
                                    cursor-pointer  px-1  border absolute top-0 right-0
                                    rounded-full bg-white hover:text-white hover:bg-[#ff6b6b] transition-color duration-300"
                          onClick={() =>
                            handleDeleteItem(product?.productId ?? "")
                          }
                        >
                          X
                        </button>
                        <div className="absolute top-10 right-0 text-[#737272] font-bold">
                          ${(product?.price ?? 0) * (product?.quantity ?? 1)}.00
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`${cart[0] ? "hidden" : ""} mt-[20rem]`}>
              <NotFoundProducts />
            </div>
          </div>

          <div className="flex flex-col gap-5 mb-5">
            <div className="border-y border-[#dce3e5] w-full py-2 px-3 font-bold text-sm flex flex-row justify-between text-[#737272]">
              <p>Subtotal:</p>
              <span className="">${totalPrice}.00</span>
            </div>

            <div className="mx-5">
              <a href="/cart">
                <button className="text-white bg-[#333333] w-full p-3 cursor-pointer font-bold hover:text-white hover:bg-[#0573f0] transition-colors duration-500 ">
                  ViewCart
                </button>
              </a>
            </div>
            <div className="mx-5">
              <a href="/cart/checkout">
                <button className="text-white bg-[#333333] w-full p-3 cursor-pointer font-bold hover:text-white hover:bg-[#0573f0] transition-colors duration-500">
                  Checkout
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
