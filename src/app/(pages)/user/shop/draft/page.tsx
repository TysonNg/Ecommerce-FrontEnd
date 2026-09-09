'use client'
import { CartTab } from "@/features/cart/components/cartTab";
import NotFoundProducts from "@/features/cart/components/not-found";
import { getAllDraft, publishProduct } from "@/features/products/actions/draft"
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/app/context/ToastContext";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface DraftProduct {
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

const DraftPage = () => {
    const { toast } = useToast();
    const id = Cookies.get('_id')
    
    const [draftDatas, setDraftDatas] = useState<DraftProduct[]>([])

    useEffect(() => {
        if(id) {
            const fetchDrafts = async() => {
                const res = await getAllDraft()
                setDraftDatas(res)
                console.log(res);
                return res
            }
    
            fetchDrafts()
        }
       
    },[])

    const handlePublish = async(i: number) => {
        const res = await publishProduct(draftDatas[i]._id)
        if(res){
            toast.success({
                title: "Published Successfully",
                message: `Product has been published to the public catalog.`
            })
            setDraftDatas((prev) => (prev.filter((item) => item._id !== draftDatas[i]._id)))
            window.dispatchEvent(new Event('ChangeQuantityDraftAndPublish'))

            return res
        }else{
            toast.error({
                title: "Publish Error",
                message: "Failed to publish product. Please try again."
            })
            return
        }
    }

    
    if (draftDatas.length > 0) {
        return (
            <div className="w-full my-4 sm:my-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Draft Products</h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage and publish your unpublished drafts ({draftDatas.length})</p>
                    </div>
                </div>

                {/* Mobile Card List (< 640px) */}
                <div className="sm:hidden flex flex-col gap-3">
                    {draftDatas.map((item, i) => (
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
                                <span className="text-slate-500 font-medium">{item.product_shop.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handlePublish(i)}
                                    className="px-4 py-1.5 bg-[#0573f0] hover:bg-[#0769da] text-white rounded-lg font-semibold transition-colors cursor-pointer shadow-xs"
                                >
                                    Publish
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
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {draftDatas.map((item, i) => (
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
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handlePublish(i)}
                                            className="px-3.5 py-1.5 bg-[#0573f0] hover:bg-[#0769da] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                                        >
                                            Publish
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
    
    if (draftDatas.length === 0) {
        return (
            <div className="w-full py-8">
                <NotFoundProducts
                    title="No Draft Products"
                    description="You don't have any products in draft. Create a new draft product to work on before publishing."
                    actionText="+ Create Draft"
                    actionHref="/user/shop/product"
                />
                <CartTab />
            </div>
        );
    }

    
}

export default DraftPage