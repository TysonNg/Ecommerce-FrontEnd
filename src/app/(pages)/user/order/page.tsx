'use client'

import { getAllOrders } from "@/features/order/data/data";
import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCircleInfo,
    faShoppingBag,
    faLocationDot,
    faPhone,
    faUser,
    faXmark,
    faBoxesStacked,
    faCreditCard,
    faEye,
    faSpinner,
    faReceipt,
    faArrowUpRightFromSquare
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface OrderProductItem {
    price: number;
    quantity: number;
    productId: string;
}

interface GetOrder {
    _id: string;
    order_userId: string;
    order_checkout: {
        totalPrice: number;
        feeShip: number;
        totalDiscount: number;
        totalCheckout: number;
    };
    order_payment: {
        method: string;
    };
    order_products: OrderProductItem[];
    order_shipping: {
        name: string;
        street: string;
        city: string;
        country: string;
        phone: number;
    };
    order_trackingNumber: string;
    order_status: string;
    createdAt: Date;
}

interface ProductDetailInfo {
    name: string;
    thumb: string;
    slug?: string;
}

const OrderUserPage = () => {
    const [orders, setOrders] = useState<GetOrder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Order details modal state
    const [selectedOrder, setSelectedOrder] = useState<GetOrder | null>(null);
    const [isLoadingProductDetails, setIsLoadingProductDetails] = useState<boolean>(false);
    const [productDetailsCache, setProductDetailsCache] = useState<Record<string, ProductDetailInfo>>({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const res = await getAllOrders();
                if (Array.isArray(res)) {
                    setOrders(res);
                } else {
                    setOrders([]);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Format tracking number to prevent double '#' (e.g., '##0000...' -> '#0000...')
    const formatTrackingNumber = (trackingNumber: string) => {
        if (!trackingNumber) return "#N/A";
        const cleaned = trackingNumber.replace(/^#+/, "");
        return `#${cleaned}`;
    };

    // Open Order Details Modal and fetch product metadata
    const handleOpenOrderDetails = useCallback(async (orderItem: GetOrder) => {
        setSelectedOrder(orderItem);

        const missingProductIds = orderItem.order_products
            .map((p) => p.productId)
            .filter((id) => id && !productDetailsCache[id]);

        if (missingProductIds.length === 0) return;

        setIsLoadingProductDetails(true);

        const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

        try {
            const fetchPromises = missingProductIds.map(async (productId) => {
                try {
                    const res = await fetch(`${apiUrl}/product/${productId}`, {
                        headers: { "x-api-key": apiKey }
                    });
                    if (res.ok) {
                        const json = await res.json();
                        const metadata = json?.metadata;
                        return {
                            productId,
                            name: metadata?.product_name || "Product Item",
                            thumb: metadata?.product_thumb || "/no_products.png",
                            slug: metadata?.product_slug || ""
                        };
                    }
                } catch (e) {
                    console.error("Error fetching product detail for:", productId, e);
                }
                return {
                    productId,
                    name: "Product Item",
                    thumb: "/no_products.png",
                    slug: ""
                };
            });

            const results = await Promise.all(fetchPromises);
            setProductDetailsCache((prev) => {
                const updated = { ...prev };
                results.forEach((item) => {
                    if (item) {
                        updated[item.productId] = {
                            name: item.name,
                            thumb: item.thumb,
                            slug: item.slug
                        };
                    }
                });
                return updated;
            });
        } finally {
            setIsLoadingProductDetails(false);
        }
    }, [productDetailsCache]);

    const totalOrdersCount = orders?.length || 0;
    const totalOrderedItems = orders?.reduce((acc, item) => acc + (item.order_products?.length || 0), 0) || 0;

    const renderStatusBadge = (status: string) => {
        const lower = (status || "").toLowerCase();
        if (lower === "pending") {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-[#fffdf0] text-[#917f09] border border-[#d7c318]">
                    Pending
                </span>
            );
        }
        if (lower === "completed" || lower === "delivered" || lower === "confirmed") {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-[#ecfdf5] text-[#047857] border border-[#10b981]">
                    {status}
                </span>
            );
        }
        if (lower === "cancelled" || lower === "canceled") {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-[#fef2f2] text-[#b91c1c] border border-[#e5484d]">
                    Cancelled
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-[#f8fbfc] text-[#48515b] border border-[#dce3e5] capitalize">
                {status || "Unknown"}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8fbfc] py-6 sm:py-10">
            {/* Standard responsive container width per DESIGN_SYSTEM.md */}
            <div className="xl:w-[1200px] lg:w-[1024px] md:w-[768px] sm:w-[640px] w-full px-4 mx-auto">
                
                {/* Header title */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight">Order list</h1>
                        <p className="text-xs sm:text-sm text-[#5e6d73] mt-1">
                            Track and review your placed orders and delivery status
                        </p>
                    </div>
                    {totalOrdersCount > 0 && (
                        <div className="self-start sm:self-auto">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-white text-[#0573f0] border border-[#dce3e5] shadow-2xs">
                                <FontAwesomeIcon icon={faShoppingBag} className="w-3 h-3" />
                                {totalOrdersCount} {totalOrdersCount === 1 ? "Order" : "Orders"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Top 3-Box Stats Bar (Co giãn linh hoạt 100% w-full, giữ 3 ô liền kề theo DESIGN_SYSTEM) */}
                <div className="w-full bg-white border border-[#dce3e5] rounded-lg shadow-2xs grid grid-cols-3 divide-x divide-[#dce3e5] overflow-hidden mb-8">
                    {/* Box 1: Today / Date */}
                    <div className="p-3 sm:p-5 lg:p-6 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 bg-[#f8fbfc]/70">
                        <span className="text-[#0573f0] text-base sm:text-xl">
                            <FontAwesomeIcon icon={faCalendar} />
                        </span>
                        <h2 className="text-sm sm:text-lg font-bold text-[#171717]">Today</h2>
                    </div>

                    {/* Box 2: Total Orders */}
                    <div className="p-3 sm:p-5 lg:p-6 flex flex-col justify-center">
                        <h2 className="text-[11px] sm:text-xs lg:text-sm font-semibold text-[#5e6d73] uppercase tracking-wider">
                            Total orders
                        </h2>
                        <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#171717] mt-0.5 sm:mt-1">
                            {isLoading ? "..." : totalOrdersCount}
                        </span>
                    </div>

                    {/* Box 3: Ordered Items */}
                    <div className="p-3 sm:p-5 lg:p-6 flex flex-col justify-center">
                        <h2 className="text-[11px] sm:text-xs lg:text-sm font-semibold text-[#5e6d73] uppercase tracking-wider">
                            Ordered items
                        </h2>
                        <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#171717] mt-0.5 sm:mt-1">
                            {isLoading ? "..." : totalOrderedItems}
                        </span>
                    </div>
                </div>

                {/* Content Area */}
                {isLoading ? (
                    /* Loading Skeleton */
                    <div className="bg-white border border-[#dce3e5] rounded-lg p-6 sm:p-8 space-y-4 animate-pulse">
                        <div className="h-6 bg-[#e9eff4] rounded w-1/4"></div>
                        <div className="h-10 bg-[#f8fafc] rounded w-full"></div>
                        <div className="h-10 bg-[#f8fafc] rounded w-full"></div>
                        <div className="h-10 bg-[#f8fafc] rounded w-full"></div>
                    </div>
                ) : orders.length === 0 ? (
                    /* Empty State: Responsive Image & CTA Button */
                    <div className="bg-white border border-[#dce3e5] rounded-lg p-8 sm:p-14 text-center flex flex-col items-center justify-center shadow-2xs">
                        <div className="relative w-36 sm:w-48 lg:w-56 aspect-[2/1] mb-5">
                            <Image
                                src="/no_products.png"
                                alt="No Orders Found"
                                fill
                                priority
                                className="object-contain"
                                sizes="(max-width: 640px) 144px, (max-width: 1024px) 192px, 224px"
                            />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#171717] mb-1.5">
                            No Orders Found
                        </h3>
                        <p className="text-xs sm:text-sm text-[#48515b] max-w-sm sm:max-w-md mb-6 leading-relaxed">
                            You haven&apos;t placed any orders yet. Discover our latest electronic gadgets, audio gear, and computers to start shopping!
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#0573f0] hover:bg-[#0461cc] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200 active:scale-98"
                        >
                            <FontAwesomeIcon icon={faShoppingBag} className="w-3.5 h-3.5" />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    /* Order List: Mobile Cards + Desktop Table */
                    <div className="space-y-4">
                        
                        {/* 1. Mobile Card View (< 640px) */}
                        <div className="block sm:hidden space-y-3.5">
                            {orders.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => handleOpenOrderDetails(item)}
                                    className="bg-white border border-[#dce3e5] rounded-lg p-4 shadow-2xs space-y-3 cursor-pointer hover:border-[#0573f0] transition-all duration-200 active:scale-99"
                                >
                                    {/* Tracking # & Status */}
                                    <div className="flex items-center justify-between gap-2 border-b border-[#dce3e5] pb-2.5">
                                        <div className="font-mono font-bold text-xs text-[#0573f0] truncate">
                                            {formatTrackingNumber(item.order_trackingNumber)}
                                        </div>
                                        {renderStatusBadge(item.order_status)}
                                    </div>

                                    {/* Date */}
                                    <div className="text-[11px] text-[#5e6d73] flex items-center gap-1.5">
                                        <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 text-[#5e6d73]" />
                                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                                    </div>

                                    {/* Customer & Shipping Summary */}
                                    <div className="bg-[#f8fbfc] rounded-md p-3 text-xs text-[#48515b] space-y-1 border border-[#dce3e5]">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-[#171717] flex items-center gap-1.5">
                                                <FontAwesomeIcon icon={faUser} className="w-3 h-3 text-[#5e6d73]" />
                                                {item.order_shipping?.name}
                                            </span>
                                            {item.order_shipping?.phone && (
                                                <span className="text-[#5e6d73] text-[11px] flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faPhone} className="w-2.5 h-2.5 text-[#5e6d73]" />
                                                    {item.order_shipping.phone}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[#48515b] text-[11px] flex items-start gap-1.5 pt-0.5">
                                            <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 text-[#5e6d73] mt-0.5 shrink-0" />
                                            <span className="line-clamp-2">
                                                {[
                                                    item.order_shipping?.street,
                                                    item.order_shipping?.city,
                                                    item.order_shipping?.country
                                                ].filter(Boolean).join(", ")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer: Items count, Payment Method & Total Checkout */}
                                    <div className="flex items-center justify-between pt-1 text-xs">
                                        <div className="text-[#5e6d73] space-y-0.5">
                                            <div className="flex items-center gap-1.5">
                                                <FontAwesomeIcon icon={faBoxesStacked} className="w-3 h-3 text-[#5e6d73]" />
                                                <span>{item.order_products?.length || 0} items</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px]">
                                                <FontAwesomeIcon icon={faCreditCard} className="w-3 h-3 text-[#5e6d73]" />
                                                <span className="uppercase">{item.order_payment?.method || "N/A"}</span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-[11px] text-[#5e6d73] block">Total</span>
                                            <span className="text-base font-bold text-[#171717]">
                                                ${item.order_checkout?.totalCheckout}.00
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenOrderDetails(item);
                                        }}
                                        className="w-full mt-1 py-2 px-3 rounded text-xs font-semibold text-[#0573f0] bg-blue-50/70 hover:bg-[#0573f0] hover:text-white border border-blue-100 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                                        <span>View Order Details</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* 2. Tablet & Desktop Table View (>= 640px) */}
                        <div className="hidden sm:block overflow-x-auto rounded-lg border border-[#dce3e5] bg-white shadow-2xs">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead>
                                    <tr className="bg-[#f8fbfc] border-b border-[#dce3e5]">
                                        <th className="px-4 py-3.5 text-xs font-semibold text-[#5e6d73] uppercase tracking-wider">
                                            Order
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-semibold text-[#5e6d73] uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-semibold text-[#5e6d73] uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-semibold text-[#5e6d73] uppercase tracking-wider text-right">
                                            Total
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-semibold text-[#5e6d73] uppercase tracking-wider text-center">
                                            Payment Status
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-semibold text-[#5e6d73] uppercase tracking-wider text-center">
                                            Items
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-semibold text-[#5e6d73] uppercase tracking-wider text-center">
                                            Method
                                        </th>
                                        <th className="px-4 py-3.5 text-xs font-semibold text-[#5e6d73] uppercase tracking-wider text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#dce3e5]">
                                    {orders.map((item) => (
                                        <tr
                                            key={item._id}
                                            onClick={() => handleOpenOrderDetails(item)}
                                            className="hover:bg-[#f8fbfc] transition-colors duration-150 cursor-pointer group"
                                        >
                                            {/* Tracking Number */}
                                            <td className="px-4 py-4 font-mono font-bold text-xs text-[#0573f0] whitespace-nowrap group-hover:underline">
                                                {formatTrackingNumber(item.order_trackingNumber)}
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-4 text-xs text-[#48515b] whitespace-nowrap">
                                                {new Date(item.createdAt).toLocaleString()}
                                            </td>

                                            {/* Customer */}
                                            <td className="px-4 py-4 text-[#171717] whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-medium text-xs sm:text-sm">
                                                        {item.order_shipping?.name || "Customer"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Total */}
                                            <td className="px-4 py-4 text-right font-semibold text-[#171717] whitespace-nowrap">
                                                ${item.order_checkout?.totalCheckout}.00
                                            </td>

                                            {/* Payment Status */}
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                {renderStatusBadge(item.order_status)}
                                            </td>

                                            {/* Items count */}
                                            <td className="px-4 py-4 text-center text-xs font-medium text-[#48515b] whitespace-nowrap">
                                                {item.order_products?.length || 0}
                                            </td>

                                            {/* Method */}
                                            <td className="px-4 py-4 text-center text-xs text-[#48515b] uppercase whitespace-nowrap font-medium">
                                                {item.order_payment?.method || "N/A"}
                                            </td>

                                            {/* Action Button */}
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenOrderDetails(item);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-[#0573f0] group-hover:bg-[#0573f0] group-hover:text-white bg-blue-50 border border-blue-100 transition-all duration-150 cursor-pointer shadow-2xs"
                                                >
                                                    <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                                                    <span>View Details</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Comprehensive Order Details Modal (Products list + Shipping info + Pricing summary) */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl border border-[#dce3e5] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-start sm:items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[#dce3e5] bg-[#f8fbfc] shrink-0 gap-2">
                            <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0573f0] shrink-0 mt-0.5 sm:mt-0">
                                    <FontAwesomeIcon icon={faReceipt} className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                        <h3 className="font-bold text-[#171717] text-xs sm:text-base font-mono truncate max-w-[170px] sm:max-w-none">
                                            {formatTrackingNumber(selectedOrder.order_trackingNumber)}
                                        </h3>
                                        {renderStatusBadge(selectedOrder.order_status)}
                                    </div>
                                    <p className="text-[10px] sm:text-[11px] text-[#5e6d73] mt-0.5">
                                        Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="text-[#5e6d73] hover:text-[#171717] p-1.5 rounded hover:bg-[#dce3e5]/50 transition-colors cursor-pointer shrink-0"
                            >
                                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto divide-y divide-[#dce3e5] scrollbar-thin flex-1">
                            
                            {/* Section 1: Product Items */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[11px] sm:text-xs font-bold text-[#5e6d73] uppercase tracking-wider">
                                        Products in this Order ({selectedOrder.order_products?.length || 0})
                                    </h4>
                                    {isLoadingProductDetails && (
                                        <span className="text-xs text-[#0573f0] flex items-center gap-1">
                                            <FontAwesomeIcon icon={faSpinner} className="animate-spin w-3 h-3" />
                                            Loading details...
                                        </span>
                                    )}
                                </div>

                                <div className="border border-[#dce3e5] rounded-lg divide-y divide-[#dce3e5] max-h-[250px] sm:max-h-[270px] overflow-y-auto bg-[#f8fbfc]/40">
                                    {selectedOrder.order_products?.map((prod, idx) => {
                                        const detail = productDetailsCache[prod.productId];
                                        const lineSubtotal = (prod.price || 0) * (prod.quantity || 1);

                                        return (
                                            <div
                                                key={idx}
                                                className="p-2.5 sm:p-3.5 flex items-center justify-between gap-2.5 sm:gap-3 bg-white hover:bg-[#f8fbfc]/70 transition-colors"
                                            >
                                                {/* Thumbnail Image */}
                                                <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-[#f8fbfc] rounded border border-[#dce3e5] p-1 flex items-center justify-center overflow-hidden">
                                                    <Image
                                                        src={detail?.thumb || "/no_products.png"}
                                                        alt={detail?.name || "Product"}
                                                        width={56}
                                                        height={56}
                                                        className="object-contain w-full h-full"
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    {detail?.slug ? (
                                                        <Link
                                                            href={`/products/${prod.productId}/${detail.slug}`}
                                                            target="_blank"
                                                            className="text-xs sm:text-sm font-semibold text-[#171717] hover:text-[#0573f0] line-clamp-2 leading-snug inline-flex items-center gap-1 group"
                                                        >
                                                            <span>{detail.name}</span>
                                                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                                                        </Link>
                                                    ) : (
                                                        <p className="text-xs sm:text-sm font-semibold text-[#171717] line-clamp-2 leading-snug">
                                                            {detail?.name || `Product ID: #${prod.productId}`}
                                                        </p>
                                                    )}
                                                    
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="inline-block text-[10px] sm:text-[11px] font-semibold text-[#5e6d73] bg-[#f8fbfc] border border-[#dce3e5] px-1.5 py-0.5 rounded">
                                                            x{prod.quantity}
                                                        </span>
                                                        <span className="text-[10px] sm:text-[11px] text-[#5e6d73]">
                                                            ${prod.price}.00 each
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Line Total */}
                                                <div className="text-right shrink-0">
                                                    <span className="text-xs sm:text-sm font-bold text-[#171717]">
                                                        ${lineSubtotal}.00
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Section 2: Delivery & Customer Info */}
                            <div className="pt-5 space-y-3">
                                <h4 className="text-xs font-bold text-[#5e6d73] uppercase tracking-wider">
                                    Delivery Address & Recipient
                                </h4>
                                <div className="bg-[#f8fbfc] border border-[#dce3e5] rounded-lg p-4 space-y-2 text-xs sm:text-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 font-semibold text-[#171717]">
                                            <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5 text-[#5e6d73]" />
                                            <span>{selectedOrder.order_shipping?.name || "N/A"}</span>
                                        </div>
                                        {selectedOrder.order_shipping?.phone && (
                                            <div className="flex items-center gap-1.5 text-[#5e6d73] text-xs">
                                                <FontAwesomeIcon icon={faPhone} className="w-3 h-3 text-[#5e6d73]" />
                                                <span>{selectedOrder.order_shipping.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-start gap-2 text-[#48515b] pt-1 border-t border-[#dce3e5]/60 text-xs">
                                        <FontAwesomeIcon icon={faLocationDot} className="w-3.5 h-3.5 text-[#5e6d73] mt-0.5 shrink-0" />
                                        <span>
                                            {[
                                                selectedOrder.order_shipping?.street,
                                                selectedOrder.order_shipping?.city,
                                                selectedOrder.order_shipping?.country
                                            ].filter(Boolean).join(", ") || "No address specified"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Payment & Order Pricing Summary */}
                            <div className="pt-5 space-y-3">
                                <h4 className="text-xs font-bold text-[#5e6d73] uppercase tracking-wider">
                                    Payment & Cost Summary
                                </h4>
                                <div className="bg-[#f8fbfc] border border-[#dce3e5] rounded-lg p-4 space-y-2.5 text-xs sm:text-sm">
                                    <div className="flex justify-between items-center text-[#5e6d73]">
                                        <span>Payment Method</span>
                                        <span className="font-semibold text-[#171717] uppercase">
                                            {selectedOrder.order_payment?.method || "Cash"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[#5e6d73]">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-[#171717]">
                                            ${selectedOrder.order_checkout?.totalPrice || selectedOrder.order_checkout?.totalCheckout || 0}.00
                                        </span>
                                    </div>
                                    {selectedOrder.order_checkout?.totalDiscount > 0 && (
                                        <div className="flex justify-between items-center text-emerald-600 font-medium">
                                            <span>Discount</span>
                                            <span>-${selectedOrder.order_checkout.totalDiscount}.00</span>
                                        </div>
                                    )}
                                    {selectedOrder.order_checkout?.feeShip > 0 && (
                                        <div className="flex justify-between items-center text-[#5e6d73]">
                                            <span>Shipping Fee</span>
                                            <span>${selectedOrder.order_checkout.feeShip}.00</span>
                                        </div>
                                    )}
                                    <div className="pt-2 border-t border-[#dce3e5] flex justify-between items-center text-sm sm:text-base font-bold text-[#171717]">
                                        <span>Total Amount</span>
                                        <span className="text-base sm:text-lg text-[#0573f0]">
                                            ${selectedOrder.order_checkout?.totalCheckout || 0}.00
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="px-5 py-3.5 bg-[#f8fbfc] border-t border-[#dce3e5] flex justify-end shrink-0">
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="px-5 py-2 rounded text-xs font-semibold text-white bg-[#2b323e] hover:bg-[#0573f0] transition-colors shadow-2xs cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderUserPage;