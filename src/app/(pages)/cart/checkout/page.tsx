"use client";

import { useEffect, useState } from "react";
import styles from "./checkout.module.scss";
import { getCartById } from "@/features/cart/data/data";
import Image from "next/image";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { OrderByUser } from "@/features/order/actions/orderByUser";
import { useToast } from "@/app/context/ToastContext";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
  const { toast } = useToast();
  const id: string | undefined = Cookies.get("_id");
  const cartUserId: string | undefined = Cookies.get(`cartId_${id}`);

  const [cart, setCart] = useState<Array<ProductsCart | undefined>>([]);
  const [checkout, setCheckout] = useState<Checkout | null>(null);

  const [userAddress, setUserAddress] = useState<UserAddress>({
    name: "",
    street: "",
    city: "",
    country: "",
    phone: 0,
  });
  const [payment, setPayment] = useState<Payment>({ method: "cash" });
  const [isOrdered, setIsOrdered] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && cartUserId) {
      const checkoutSession = sessionStorage.getItem(
        `reviewCheckout_${cartUserId}`
      );
      if (checkoutSession) {
        try {
          const payloadCheckout: Checkout = JSON.parse(checkoutSession);
          setCheckout(payloadCheckout);
        } catch (e) {
          console.error("Error parsing checkout session:", e);
        }
      }
    }

    const fetchCart = async () => {
      try {
        const res = await getCartById();
        if (res?.metadata?.cart_products) {
          setCart(res.metadata.cart_products);
        }
        return res;
      } catch (err) {
        console.log("err: checkoutPage", err);
      }
    };

    fetchCart();
  }, [cartUserId]);

  // Compute fallback shop_order_ids from cart if session storage has not set it yet
  const computedShopOrderIds =
    checkout?.shop_order_ids && checkout.shop_order_ids.length > 0
      ? checkout.shop_order_ids
      : cart.map((item) => ({
          shopId: item?.shopId ?? "",
          shop_discount: [] as [],
          item_products: [
            {
              price: item?.price ?? 0,
              quantity: item?.quantity ?? 1,
              productId: item?.productId ?? "",
            },
          ] as [
            {
              price: number;
              quantity: number;
              productId: string;
            }
          ],
        }));

  const computedTotal =
    checkout?.checkout_order?.totalCheckout ||
    cart.reduce(
      (acc, item) => acc + (item?.price ?? 0) * (item?.quantity ?? 1),
      0
    );

  const computedTotalPrice =
    checkout?.checkout_order?.totalPrice || computedTotal;

  const handleOrder = async () => {
    // 1. Validate Authentication
    if (!id) {
      toast.error({
        title: "Login Required",
        message: "You are not logged in. Please sign in to place an order.",
      });
      return;
    }

    // 2. Validate Cart
    if (!cart || cart.length === 0) {
      toast.error({
        title: "Cart Empty",
        message: "Your shopping cart is empty. Please add items before checking out.",
      });
      return;
    }

    // 3. Validate Form Fields
    if (!userAddress.name.trim()) {
      toast.error({
        title: "Missing Information",
        message: "Please enter your name or email address.",
      });
      return;
    }

    if (!userAddress.street.trim()) {
      toast.error({
        title: "Missing Information",
        message: "Please enter your street address.",
      });
      return;
    }

    if (!userAddress.city.trim()) {
      toast.error({
        title: "Missing Information",
        message: "Please enter your city.",
      });
      return;
    }

    if (!userAddress.country.trim()) {
      toast.error({
        title: "Missing Information",
        message: "Please enter your country.",
      });
      return;
    }

    if (!userAddress.phone || isNaN(userAddress.phone) || userAddress.phone <= 0) {
      toast.error({
        title: "Invalid Phone",
        message: "Please enter a valid numeric phone number.",
      });
      return;
    }

    // 4. Submit Order
    setIsSubmitting(true);

    try {
      const res = await OrderByUser({
        cartId: cartUserId ?? "",
        userId: id,
        shop_order_ids: computedShopOrderIds,
        user_address: userAddress,
        user_payment: payment,
      });

      if (res && res.success) {
        setIsOrdered(true);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(`reviewCheckout_${cartUserId}`);
        }
        localStorage.removeItem(`cartQuantity`);

        toast.success({
          title: "Order Placed Successfully!",
          message: `Your order has been recorded. Tracking: ${res.data?.metadata?.order_trackingNumber || "N/A"}`,
        });
      } else {
        toast.error({
          title: "Order Failed",
          message: res?.message || "Could not process order. Please verify your details and try again.",
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      toast.error({
        title: "Order Error",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCartItems =
    cart?.reduce((acc, item) => acc + (item?.quantity ?? 0), 0) || 0;

  return (
    <div className={`${styles.checkoutPage} min-h-screen bg-[#f8fbfc] py-8 sm:py-12`}>
      {/* Standard responsive container per DESIGN_SYSTEM.md */}
      <div className="xl:w-[1200px] lg:w-[1024px] md:w-[768px] sm:w-[640px] w-full px-4 mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight mb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer information & Billing details (7 cols on Desktop) */}
          <div className="customer-detail lg:col-span-7 bg-white p-5 sm:p-7 rounded-lg border border-[#dce3e5] shadow-2xs space-y-6">
            {/* Customer Information */}
            <div>
              <h2 className="text-base font-bold text-[#171717] border-b border-[#dce3e5] pb-2.5 mb-4">
                Customer information
              </h2>
              <input
                className="p-2.5 rounded-md border border-[#dce3e5] w-full text-sm text-[#171717] placeholder:text-slate-400 focus:outline-none focus:border-[#0573f0] focus:ring-1 focus:ring-[#0573f0] transition-colors"
                type="text"
                value={userAddress.name}
                placeholder="Username or Email Address *"
                onChange={(e) =>
                  setUserAddress((prev: UserAddress) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            {/* Billing Details */}
            <div>
              <h2 className="text-base font-bold text-[#171717] border-b border-[#dce3e5] pb-2.5 mb-4">
                Billing details
              </h2>
              <div className="space-y-4">
                <input
                  className="p-2.5 rounded-md border border-[#dce3e5] w-full text-sm text-[#171717] placeholder:text-slate-400 focus:outline-none focus:border-[#0573f0] focus:ring-1 focus:ring-[#0573f0] transition-colors"
                  type="text"
                  value={userAddress.street}
                  placeholder="Street *"
                  onChange={(e) =>
                    setUserAddress((prev: UserAddress) => ({
                      ...prev,
                      street: e.target.value,
                    }))
                  }
                />
                <input
                  className="p-2.5 rounded-md border border-[#dce3e5] w-full text-sm text-[#171717] placeholder:text-slate-400 focus:outline-none focus:border-[#0573f0] focus:ring-1 focus:ring-[#0573f0] transition-colors"
                  type="text"
                  value={userAddress.city}
                  placeholder="City *"
                  onChange={(e) =>
                    setUserAddress((prev: UserAddress) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                />
                <input
                  className="p-2.5 rounded-md border border-[#dce3e5] w-full text-sm text-[#171717] placeholder:text-slate-400 focus:outline-none focus:border-[#0573f0] focus:ring-1 focus:ring-[#0573f0] transition-colors"
                  type="text"
                  value={userAddress.country}
                  placeholder="Country *"
                  onChange={(e) =>
                    setUserAddress((prev: UserAddress) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                />
                <input
                  className="p-2.5 rounded-md border border-[#dce3e5] w-full text-sm text-[#171717] placeholder:text-slate-400 focus:outline-none focus:border-[#0573f0] focus:ring-1 focus:ring-[#0573f0] transition-colors"
                  type="text"
                  value={userAddress.phone || ""}
                  placeholder="Phone *"
                  onChange={(e) =>
                    setUserAddress((prev: UserAddress) => ({
                      ...prev,
                      phone: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-base font-bold text-[#171717] border-b border-[#dce3e5] pb-2.5 mb-4">
                Payment
              </h2>
              <select
                name="payments"
                id="payments"
                className="p-2.5 rounded-md border border-[#dce3e5] w-full text-sm text-[#171717] bg-white focus:outline-none focus:border-[#0573f0] focus:ring-1 focus:ring-[#0573f0] transition-colors"
                onChange={(e) =>
                  setPayment(() => ({ method: e.target.value }))
                }
              >
                <option value="cash" className="text-sm">
                  Cash
                </option>
                <option value="creditCard" className="text-sm">
                  Credit Card
                </option>
              </select>
            </div>

            {/* Place Order CTA button with loading spinner */}
            <button
              type="button"
              disabled={isSubmitting}
              className="w-full bg-[#2b323e] hover:bg-[#0573f0] disabled:bg-slate-400 disabled:cursor-not-allowed text-white p-3.5 font-bold rounded-md cursor-pointer transition-colors duration-300 flex items-center justify-center gap-2 shadow-xs hover:shadow-md active:scale-98"
              onClick={handleOrder}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faLock} className="text-sm" />
                  <span>Place Order ${computedTotal}.00</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Your Order Summary (5 cols on Desktop, sticky top-24) */}
          <div className="order-detail lg:col-span-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#171717]">
                Your order
              </h2>
              {totalCartItems > 0 && (
                <span className="text-xs font-semibold text-[#5e6d73] bg-white px-2.5 py-1 rounded border border-[#dce3e5] shadow-2xs">
                  {totalCartItems} {totalCartItems === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            <div className="order-detal_container border border-[#dce3e5] rounded-lg bg-white overflow-hidden shadow-2xs">
              {/* Product / Subtotal Table Header */}
              <div className="flex flex-row justify-between items-center px-4 py-3 bg-[#f8fbfc] border-b border-[#dce3e5]">
                <h3 className="text-xs font-bold text-[#5e6d73] uppercase tracking-wider">
                  Product
                </h3>
                <h3 className="text-xs font-bold text-[#5e6d73] uppercase tracking-wider">
                  Subtotal
                </h3>
              </div>

              {/* Scrollable Product List with Max-Height */}
              <div className="max-h-[320px] sm:max-h-[360px] overflow-y-auto divide-y divide-[#dce3e5] scrollbar-thin">
                {cart?.map((product, i) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-row items-center justify-between gap-3 p-3.5 hover:bg-[#f8fbfc]/50 transition-colors"
                    >
                      {/* Product Thumbnail (70x70) & Info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative shrink-0 w-[70px] h-[70px] bg-[#f8fbfc] rounded border border-[#dce3e5] p-1 flex items-center justify-center overflow-hidden">
                          <Image
                            src={product?.imgThumb || "/no_products.png"}
                            alt={product?.name || "Product"}
                            width={70}
                            height={70}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-[#171717] line-clamp-2 leading-snug">
                            {product?.name}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="inline-block text-xs font-semibold text-[#5e6d73] bg-[#f8fbfc] border border-[#dce3e5] px-2 py-0.5 rounded">
                              x{product?.quantity}
                            </span>
                            <span className="text-[11px] text-[#5e6d73]">
                              ${product?.price ?? 0}.00 each
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right shrink-0">
                        <p className="text-xs sm:text-sm font-bold text-[#171717]">
                          ${(product?.price ?? 0) * (product?.quantity ?? 1)}.00
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtotal Fixed Row */}
              <div className="border-t border-[#dce3e5] bg-[#f8fbfc]/70 px-4 py-3 text-xs sm:text-sm text-[#5e6d73] flex flex-row justify-between items-center">
                <p className="font-medium">Subtotal</p>
                <span className="font-semibold text-[#171717]">
                  ${computedTotalPrice}.00
                </span>
              </div>

              {/* Total Fixed Row */}
              <div className="border-t border-[#dce3e5] bg-white px-4 py-4 flex flex-row justify-between items-center">
                <p className="text-sm sm:text-base font-bold text-[#171717]">Total</p>
                <span className="text-base sm:text-lg font-bold text-[#0573f0]">
                  ${computedTotal}.00
                </span>
              </div>
            </div>

            {/* Success notification banner */}
            {isOrdered && (
              <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm animate-in fade-in duration-300">
                <div className="flex items-start gap-2.5">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-emerald-600 mt-0.5 text-base shrink-0"
                  />
                  <div>
                    <p className="font-bold">You ordered successfully!</p>
                    <p className="mt-1 text-emerald-700">
                      Go to{" "}
                      <Link
                        className="text-[#0573f0] font-bold underline hover:text-blue-700"
                        href="/user/order"
                      >
                        My Orders
                      </Link>{" "}
                      to manage and track your orders.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
