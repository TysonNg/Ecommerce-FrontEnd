'use client'
import { useEffect, useState } from "react"
import Image from "next/image";
import NotFoundProducts from "@/features/cart/components/not-found";
import { CartTab } from "@/features/cart/components/cartTab";
import { getAllPublish, unPublish } from "@/features/products/actions/publish";
import { getAllDiscountOfProduct } from "@/features/discount/data/data";
import Cookies from "js-cookie";

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

    if(publishDatas.length > 0){
        return(
            <div className="ml-20 my-10 flex flex-col gap-5">
                <h1 className="text-xl font-bold">Published List</h1>
                <div>
                                <table className="border-1 rounded-lg border-separate border-spacing-y-5">
                                    <thead >
                                        <tr >
                                            <th>Thumb</th>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Quantity</th>
                                            <th>Shop</th>
                                            <th>Discounts</th>
                                        </tr>
                                    </thead>
                    
                                    <tbody className="relative">
                                    {publishDatas.map((item,i) => {
                                        return (
                                           <tr key={i} className="text-center">
                                            <td className={`${i === publishDatas.length - 1? "": "border-b"} px-5 pb-4`}> <Image className="rounded-md" src={`${item.product_thumb}`} width={100} height={100} alt="img" /></td>
                                            <td className={`${i === publishDatas.length - 1? "": "border-b"} px-5 pb-4 `}>
                                                <p className="truncate w-75">
                                                    {item.product_name}
                                                </p>
                                            </td>
                                            <td className={`${i === publishDatas.length - 1? "": "border-b"} px-5 pb-4`}>{item.product_type}</td>
                                            <td className={`${i === publishDatas.length - 1? "": "border-b"} px-5 pb-4`}>{item.product_quantity}</td>
                                            <td className={`${i === publishDatas.length - 1? "": "border-b "} px-5 pb-4 text-nowrap`}>{item.product_shop.name}</td>
                                            <td className={`${i === publishDatas.length - 1? "": "border-b "} px-5 pb-4 text-nowrap `}>
                                                <div className="border rounded-lg px-2 py-1 cursor-pointer text-sm relative overflow-y-visible" onClick={() => {handleOpenDiscounts(i);getDiscountsProduct(i)}}>
                                                        list ▼                                                                  
                                                </div>
                                                <div className="relative">
                                                        <ul className={`${activeItem === i?"opacity-100 translate-y-0" : "-translate-y-5 opacity-0 pointer-events-none"} absolute overflow-hidden ease-out top-0 right-0 bg-white transition-all duration-500`}>
                                                            {discounts.map((item,i) => {
                                                                return(
                                                                    <li key={i} className="mt-1 p-2 rounded-lg border border-[#adaaaa] shadow cursor-pointer hover:bg-blue-600 hover:font-bold hover:text-white transition-color duration-300 text-sm">
                                                                        <p>
                                                                        {item.discount_code}
                                                                        </p> 
                                                                    </li>
                                                                )
                                                            })}
                                                            {discounts.length === 0 && (
                                                                <li className="mt-1 p-2 rounded-lg border border-[#adaaaa] shadow cursor-pointer hover:bg-black hover:text-white transition-color duration-300 text-sm">No discounts</li>
                                                            )}
                                                        </ul>
                                                </div>
                                               
                                               
                                               
                                            </td>
                                            <td className={`${i === publishDatas.length - 1? "": "border-b"} px-5 pb-4 `} >
                                                <button className="cursor-pointer border-1 px-3 py-1 rounded-lg bg-[#bd2d2dc9] text-white hover:bg-[#f44336] transition-color duration-300 text-nowrap" onClick={() => handleUnpublish(i)}> Undo</button>
                                            </td>
                                           
                                           </tr>
                                        )
                                    })}
                                    </tbody>
                    
                                </table>
                    </div>
                    <CartTab />

            </div>
        )
    }
    
    if(publishDatas.length === 0) {
        return(
            <div className="mt-10">
                <NotFoundProducts />
                <CartTab />
            </div>
        )
    }
}

export default PublishPage