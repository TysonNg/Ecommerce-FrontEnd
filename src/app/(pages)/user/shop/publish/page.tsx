'use client'
import { useEffect, useState } from "react"
import Image from "next/image";
import NotFoundProducts from "@/features/cart/components/not-found";
import { CartTab } from "@/features/cart/components/cartTab";
import { getAllPublish, unPublish } from "@/features/products/actions/publish";
import { getAllDiscountOfProduct } from "@/features/discount/data/data";
import Cookies from "js-cookie";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PublishProduct {
    _id: string;
    product_name: string;
    product_prevPrice: number;
    product_price: number;
    product_type: string;
    product_description: string;
    product_thumb: string;
    product_images:string[];
    product_quantity: number;
    product_shop:{
        name: string;
        email: string;
    }
    product_attributes:{
        brand: string,
        model: string,
        material: string
    }

}

interface DiscountsShop{
    discount_name: string;
    discount_description: string;
    discount_code: string;
    discount_start_date: Date ;
    discount_end_date: Date;
    discount_shopId: string;
    discount_product_ids:[];

}
const PublishPage = () => {

    const id = Cookies.get('_id')

    const [publishDatas, setPublishDatas] = useState<PublishProduct[]>([])
    const [discounts, setDiscounts] = useState<DiscountsShop[]>([])
    const [activeItem, setActiveItem] = useState<number>(0)



    useEffect(() => {
        if(id){
            const fetchPublishProducts = async() => {
                const res = await getAllPublish()
                setPublishDatas(res)
                return res
            }
    
            fetchPublishProducts()
        }
        
    },[])


   

    const handleUnpublish = async(i: number) => {
            const res = await unPublish(publishDatas[i]._id)
            if(res){
                alert('Publish Successfully!')
                setPublishDatas((prev) => (prev.filter((item) => item._id !== publishDatas[i]._id)))
                window.dispatchEvent(new Event('ChangeQuantityDraftAndPublish'))
                return res
            }else{
                alert('Unpublish Error!')
                return
            }
    }
    
    const handleOpenDiscounts = (i : number) => {
        if(activeItem === i){
            setActiveItem(-1)
        }else{
            setActiveItem(i)
        }
    }

    const getDiscountsProduct = async(i : number) => {
        const res = await getAllDiscountOfProduct(publishDatas[i]._id)
        setDiscounts(res)
        return res
    }

    if (publishDatas.length > 0) {
        return (
            <div className="w-full my-4 sm:my-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Published Products</h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage and track your live products ({publishDatas.length})</p>
                    </div>
                </div>

                {/* Mobile Card List (< 640px) */}
                <div className="sm:hidden flex flex-col gap-3">
                    {publishDatas.map((item, i) => (
                        <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-3">
                            <div className="flex gap-3">
                                <div className="relative w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                    <Image src={item.product_thumb} alt={item.product_name} fill className="object-contain p-1" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{item.product_name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-[#0573f0] rounded-md font-medium capitalize">
                                            {item.product_type}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">Qty: {item.product_quantity}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => { handleOpenDiscounts(i); getDiscountsProduct(i); }}
                                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Discounts ▼</span>
                                    </button>
                                    {activeItem === i && (
                                        <div className="absolute left-0 mt-1 z-30 w-48 bg-white border border-slate-200 rounded-lg shadow-lg p-2">
                                            {discounts.length > 0 ? (
                                                discounts.map((d, dIdx) => (
                                                    <div key={dIdx} className="p-1.5 text-xs text-slate-700 bg-slate-50 rounded mb-1 font-mono">
                                                        {d.discount_code}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-slate-400 p-1">No discounts</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleUnpublish(i)}
                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-semibold transition-colors cursor-pointer"
                                >
                                    Unpublish
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tablet & Desktop Table (>= 640px) */}
                <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-4 py-3">Thumb</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Quantity</th>
                                <th className="px-4 py-3">Shop</th>
                                <th className="px-4 py-3">Discounts</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {publishDatas.map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="relative w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                                            <Image src={item.product_thumb} alt={item.product_name} fill className="object-contain p-1" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">{item.product_name}</td>
                                    <td className="px-4 py-3 capitalize">{item.product_type}</td>
                                    <td className="px-4 py-3 font-semibold">{item.product_quantity}</td>
                                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{item.product_shop.name}</td>
                                    <td className="px-4 py-3 whitespace-nowrap relative">
                                        <button
                                            type="button"
                                            onClick={() => { handleOpenDiscounts(i); getDiscountsProduct(i); }}
                                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium cursor-pointer"
                                        >
                                            Discounts ▼
                                        </button>
                                        {activeItem === i && (
                                            <div className="absolute left-4 mt-1 z-30 w-48 bg-white border border-slate-200 rounded-lg shadow-lg p-2">
                                                {discounts.length > 0 ? (
                                                    discounts.map((d, dIdx) => (
                                                        <div key={dIdx} className="p-1.5 text-xs text-slate-700 bg-slate-50 rounded mb-1 font-mono">
                                                            {d.discount_code}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-slate-400 p-1">No discounts</p>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleUnpublish(i)}
                                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                        >
                                            Unpublish
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <CartTab />
            </div>
        );
    }
    
    if (publishDatas.length === 0) {
        return (
            <div className="w-full py-8">
                <NotFoundProducts
                    title="No Published Products"
                    description="You haven't published any products yet. Create and publish products to make them visible in your store."
                    actionText="+ Create Product"
                    actionHref="/user/shop/product"
                />
                <CartTab />
            </div>
        );
    }
}

export default PublishPage