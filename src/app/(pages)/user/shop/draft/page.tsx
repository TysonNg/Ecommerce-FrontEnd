'use client'
import { CartTab } from "@/features/cart/components/cartTab";
import NotFoundProducts from "@/features/cart/components/not-found";
import { getAllDraft, publishProduct } from "@/features/products/actions/draft"
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";


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
            alert('Publish Successfully!')
            setDraftDatas((prev) => (prev.filter((item) => item._id !== draftDatas[i]._id)))
            window.dispatchEvent(new Event('ChangeQuantityDraftAndPublish'))

            return res
        }else{
            alert('Publish Error!')
            return
        }
    }

    
    if(draftDatas.length > 0) {
        return(
            <div className="ml-20 mt-10 flex flex-col gap-5">
            <h1 className="text-xl font-bold">Draft List</h1>
            
            <div>
                <table className="w-full border-1 rounded-lg border-separate border-spacing-y-5">
                    <thead >
                        <tr >
                            <th>Thumb</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Shop</th>
                        </tr>
                    </thead>
    
                    <tbody className="relative">
                    {draftDatas.map((item,i) => {
                        return (
                           <tr key={i} className="text-center">
                            <td className={`${i === draftDatas.length - 1? "": "border-b"} px-5 pb-4`}> <Image className="rounded-md" src={`${item.product_thumb}`} width={100} height={100} alt="img" /></td>
                            <td className={`${i === draftDatas.length - 1? "": "border-b"} px-5 pb-4`}>{item.product_name}</td>
                            <td className={`${i === draftDatas.length - 1? "": "border-b"} px-5 pb-4`}>{item.product_type}</td>
                            <td className={`${i === draftDatas.length - 1? "": "border-b"} px-5 pb-4`}>{item.product_quantity}</td>
                            <td className={`${i === draftDatas.length - 1? "": "border-b "} px-5 pb-4 text-nowrap`}>{item.product_shop.name}</td>
                            <td className={`${i === draftDatas.length - 1? "": "border-b"} px-5 pb-4 `} >
                                <button className="cursor-pointer border-1 px-3 py-1 rounded-lg bg-black text-white hover:bg-[#0573f0] transition-color duration-300" onClick={() => handlePublish(i)}>Publish</button>
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
    
    if (draftDatas.length === 0) {
    return(
        <div className="m-10">
            <NotFoundProducts />
            <CartTab />

        </div>

        )
    }

    
}

export default DraftPage