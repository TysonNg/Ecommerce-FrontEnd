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

interface CodeDiscount {
  codeId: string;
  shopId: string;
  userId: string;
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
    if (isCartModalOpen) {
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

    if (cart.length > 0) {
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
    <div className="cart-drawer-root">
      {/* Backdrop */}
      {isCartModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9990] transition-opacity duration-300 cursor-pointer"
          onClick={closeCartModal}
          aria-label="Close cart"
        />
      )}

      {/* Slide-over Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[9995] w-full max-w-[360px] sm:max-w-[400px] bg-white shadow-2xl flex flex-col justify-between transition-all duration-500 ease-out ${
          isCartModalOpen ? "translate-x-0 opacity-100" : "translate-x-full pointer-events-none opacity-0 invisible"
        }`}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900">Shopping Cart</h3>
            {cart?.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                {cart.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCartModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer text-sm font-bold"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body / Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-slate-100">
          {cart && cart.length > 0 ? (
            cart.map((product, i) => (
              <div key={i} className="py-4 flex gap-3 relative group">
                <div className="relative w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  <Image
                    src={product?.imgThumb || "/banner.jpg"}
                    alt={product?.name || "Product"}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <a
                    href={`/products/${product?.productId}/${product?.slug}`}
                    className="text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 leading-relaxed"
                  >
                    {product?.name}
                  </a>

                  <div className="mt-2 flex items-center justify-between">
                    <HandleCart
                      cartTab={true}
                      productQuantityCartTab={product?.quantity ?? 1}
                      productIdCartTab={product?.productId}
                      shopIdCartTab={product?.shopId}
                      onHandleChangePrice={(newQuantity: number) => {
                        handleChangePrice(newQuantity, product?.productId ?? "");
                      }}
                    />
                    <span className="font-bold text-sm text-slate-900">
                      ${(product?.price ?? 0) * (product?.quantity ?? 1)}.00
                    </span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDeleteItem(product?.productId ?? "")}
                  className="absolute top-4 right-0 w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer text-xs"
                  title="Remove from cart"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <NotFoundProducts />
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">Subtotal:</span>
            <span className="text-lg font-bold text-slate-900">${totalPrice}.00</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a href="/cart" className="block">
              <button
                onClick={closeCartModal}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-xs text-slate-700 transition-colors cursor-pointer"
              >
                View Cart
              </button>
            </a>
            <a href="/cart/checkout" className="block">
              <button
                onClick={closeCartModal}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                Checkout
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
