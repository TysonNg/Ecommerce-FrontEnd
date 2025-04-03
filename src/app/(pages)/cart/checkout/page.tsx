"use client";

import { useEffect, useState } from "react";
import styles from "./checkout.module.scss";
import { getCartById } from "@/features/cart/data/data";
import Image from "next/image";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "@/app/context/ModalContext";
import { OrderByUser } from "@/features/order/actions/orderByUser";

interface ProductsCart {
  name: string;
  price: number | undefined;
  productId: string;
  shopId: string;
  imgThumb: string;
  quantity: number | undefined;
  slug: string | undefined;
}

interface Checkout {
  checkout_order: {
    totalPrice: number;
    feeShip: number;
    totalDiscount: number;
    totalCheckout: number;
  };
  shop_order_ids: {
    shopId: string;
    shop_discount: [];
    item_products: [
      {
        price: number;
        quantity: number;
        productId: string;
      }
    ];
  }[];
  shop_order_ids_new: {
    shopId: string;
    shop_discount: [];
    priceRaw: number;
    priceApplyDiscount: number;
    item_products: [
      {
        price: number;
        quantity: number;
        productId: string;
      }
    ];
  }[];
}

interface UserAddress {
  name: string;
  street: string;
  city: string;
  country: string;
  phone: number;
}

interface Payment {
  method: string;
}

const CheckOutPage = () => {
  const id: string | undefined = Cookies.get("_id");
  const cartUserId: string | undefined = Cookies.get(`cartId_${id}`);
  const checkoutSession = sessionStorage.getItem(
    `reviewCheckout_${cartUserId}`
  );
  const payloadCheckout: Checkout = checkoutSession
    ? JSON.parse(checkoutSession)
    : null;

  const defaulUserAddress = {
    name: "name",
    street: "street",
    city: "city",
    country: "country",
    phone: 123,
  };

  const { noCartTab } = useModal();
  const [cart, setCart] = useState<Array<ProductsCart | undefined>>([]);
  const [checkout] = useState<Checkout>(payloadCheckout ??
     {
      checkout_order: {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids: [],
      shop_order_ids_new: [],
    }
  );
  const [userAddress, setUserAddress] =
    useState<UserAddress>(defaulUserAddress);
  const [payment, setPayment] = useState<Payment>({ method: "cash" });
  const [isOrdered, setIsOrdered] = useState<boolean>(false);

  useEffect(() => {
    noCartTab();
    const fetchCart = async () => {
      try {
        const res = await getCartById();
        setCart(res.metadata.cart_products);

        return res;
      } catch (err) {
        console.log("err: checkoutPage", err);
      }
    };

    fetchCart();
  }, []);

  const handleOrder = async () => {
    if (!id) {
      alert("You not login yet. Pls login to order!!!");
      return;
    }
    console.log(checkout);
    if (!checkout.shop_order_ids[0]) {
      alert(`You don't have any product. Continue to shopping!`);
      return;
    }
    if(userAddress === defaulUserAddress){
        alert(`You need fill fully your informations!`)
    }
    const res = await OrderByUser({
      cartId: cartUserId ?? "",
      userId: id,
      shop_order_ids: checkout.shop_order_ids,
      user_address: userAddress,
      user_payment: payment,
    });
    if(res) {
        setIsOrdered(true);
        sessionStorage.removeItem(`reviewCheckout_${cartUserId}`);
        localStorage.removeItem(`cartQuantity`)
    }
  
    return res;
  };

  return (
    <div className={`${styles.checkoutPage} bg-white pb-50`}>
      <div className="checkoutPage-container w-[1200px] my-10 mx-auto">
        <h1 className="text-xl font-bold ">Checkout</h1>
        <div className="flex flex-row grid grid-cols-12 mt-5">
          <div className="customer-detail col-span-6 w-full flex flex-col gap-5 mt-5">
            <h2 className="text-base font-bold border-b border-[#a9a9a9] w-[170px] text-nowrap mb-3 pb-3">
              Customer information
            </h2>
            <input
              className="p-1.5 rounded-md border-1 border-[#a9a9a9] w-full"
              type="text"
              placeholder="Username of Email Address *"
              onChange={(e) =>
                setUserAddress((prev: UserAddress) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />

            <h2 className="border-b border-[#a9a9a9] pb-3">Billing details</h2>
            <div className="flex flex-col gap-7">
              <input
                className="p-1.5 rounded-md border-1 border-[#a9a9a9] w-full"
                type="text"
                placeholder="Street *"
                onChange={(e) =>
                  setUserAddress((prev: UserAddress) => ({
                    ...prev,
                    street: e.target.value,
                  }))
                }
              />
              <input
                className="p-1.5 rounded-md border-1 border-[#a9a9a9] w-full"
                type="text"
                placeholder="City *"
                onChange={(e) =>
                  setUserAddress((prev: UserAddress) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
              />
              <input
                className="p-1.5 rounded-md border-1 border-[#a9a9a9] w-full"
                type="text"
                placeholder="Country *"
                onChange={(e) =>
                  setUserAddress((prev: UserAddress) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
              />
              <input
                className="p-1.5 rounded-md border-1 border-[#a9a9a9] w-full"
                type="text"
                placeholder="Phone *"
                onChange={(e) =>
                  setUserAddress((prev: UserAddress) => ({
                    ...prev,
                    phone: parseInt(e.target.value),
                  }))
                }
              />
            </div>

            <h2>Payment</h2>
            <select
              name="payments"
              id="payments"
              className="p-1.5 rounded-md border-1 border-[#a9a9a9] w-full"
              onChange={(e) =>
                setPayment((prev) => ({ method: e.target.value }))
              }
            >
              <option value="cash" className="text-sm">
                Cash
              </option>
              <option value="creditCard" className="text-sm">
                Credit Card
              </option>
            </select>

            <button
              className="w-full bg-[#27323f] text-white p-3 font-bold cursor-pointer hover:bg-[#0573f0] transition-colors duration-500"
              onClick={handleOrder}
            >
              <span className="pr-2">
                <FontAwesomeIcon icon={faLock} />
              </span>
              Place Order ${checkout.checkout_order.totalCheckout}.00
            </button>
          </div>

          <div className="order-detail col-span-6 ml-20">
            <h2>Your order</h2>
            <div className="order-detal_container border-1 border-[#a9a9a9] rounded-sm mt-3">
              <div className="flex flex-row justify-between px-3 py-3 ">
                <h3 className="text-sm text-[#76797e] font-bold">Product</h3>
                <h3 className="text-sm text-[#76797e] font-bold">Subtotal</h3>
              </div>
              {cart?.map((product, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-row justify-between px-3 pt-3 pb-6 border-t-1 border-[#a9a9a9] relative text-sm"
                  >
                    <Image
                      src={`${product?.imgThumb}`}
                      alt={`imageProduct`}
                      width={70}
                      height={70}
                    />
                    <p className="w-[300px] mr-[3rem] text-sm text-[#76797e]">
                      {product?.name}
                    </p>
                    <p className="absolute bottom-0 left-7 text-[#76797e]">
                      x{product?.quantity}
                    </p>
                    <p className="text-[#76797e]">
                      ${(product?.price ?? 0) * (product?.quantity ?? 1)}.00
                    </p>
                  </div>
                );
              })}

              <div className="border-t-1 border-[#a9a9a9] px-3 py-5 text-sm text-[#76797e] flex flex-row justify-between">
                <p>Subtotal</p>
                <span>${checkout?.checkout_order.totalPrice}.00</span>
              </div>

              <div className="border-t-1 border-[#a9a9a9] px-3 py-5 font-bold flex flex-row justify-between">
                <p>Total</p>
                <span>${checkout?.checkout_order.totalCheckout}.00</span>
              </div>
            </div>
            <div
              className={`${
                isOrdered ? "" : "hidden"
              }  mt-20 text-xl text-nowrap text-[#0c6334c4]`}
            >
              <p>
                You ordered successfully.... Go to
                <a className="text-[#d72968] font-bold" href={`/user/order`}>
                  my order
                </a>
                to manage your orders! ✅
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
