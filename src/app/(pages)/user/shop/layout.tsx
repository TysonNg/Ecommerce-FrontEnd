'use client'

import { useState, useEffect  } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { getAllDraft } from "@/features/products/actions/draft";
import { getAllPublish } from "@/features/products/actions/publish";
import Cookies from "js-cookie";
import NotFound from "@/app/not-found";




export default function Layout({children}: {children: React.ReactNode}) {
    const id = Cookies.get('_id')

    const [activeItem, setActiveItem] = useState<string>('')
    const [draftItems, setDraftItems] = useState<number>()
    const [publishItems, setPublishItems] = useState<number>()

    const router = useRouter()
    const handleItemClick = (item: string) =>{
        setActiveItem(item)
        router.push(`/user/shop/${item}`)
    }

    const getItemClass = (item: string | undefined) => {
        return (activeItem === item? "border-y border-[#d3d3d3]" :"")
    }
  
    useEffect(() => {
        if(id) {
            const fetchDraftItems = async() => {
                const res = await getAllDraft()
                return setDraftItems(res.length)
            }
            const fetchPublishItems = async() => {
                const res = await getAllPublish()
                return setPublishItems(res.length)
            }
    
            fetchDraftItems()
            fetchPublishItems()
            
            const handleEvent = () => {
                fetchDraftItems();
                fetchPublishItems();
            }
            
            window.addEventListener('ChangeQuantityDraftAndPublish',handleEvent)
            return () => window.removeEventListener('ChangeQuantityDraftAndPublish', handleEvent)
        }
        
    },[])
   
    if(!id){
        return(
            <NotFound />
        )
    }
    return (
        <section className="shopProduct-body">
            <div className="shopProduct-container w-[1200px] h-full mx-auto grid grid-cols-12 ">
                <div className="col-span-1 border-r-1 border-[#d3d3d3] h-full pt-10 flex flex-col gap-5 text-xl text-[#7f7d7d] ">
                    <div onClick={() => handleItemClick("product")} className={`${getItemClass("product")} cursor-pointer pr-10 py-2`}>
                        Product
                    </div>
                    
                    <div onClick={() => handleItemClick("draft")} className={`${getItemClass("draft")} cursor-pointer pr-10 py-2`}>
                        <p className="relative">
                            Draft
                            <span className="absolute top-[-5px] right-[-5px] bg-[#dd3b3b] text-white text-sm font-bold border rounded-full px-1">{draftItems}</span>    
                        </p>
                        
                    </div>
                    <div onClick={() => handleItemClick("publish")} className={`${getItemClass("publish")} cursor-pointer pr-0 py-2`}>
                        <p className="relative">
                            Published
                            <span className="absolute top-[-10px] right-[0px] bg-[#dd3b3b] text-white text-sm font-bold border rounded-full px-1">{publishItems}</span>
                        </p> 
                    </div>
                </div>

                <div className="col-span-11 w-full">
                    {children}
                </div>
            </div>
        </section>
       
    );
}