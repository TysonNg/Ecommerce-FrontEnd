'use client'

import { useState } from "react"

interface DiscountsShop{
    discount_name: string;
    discount_description: string;
    discount_code: string;
    discount_start_date: Date ;
    discount_end_date: Date;
    discount_shopId: string;
    discount_product_ids:[];

}

interface RemoveDiscountParams {
    productId: string; 
    codeId: string;    
    userId: string;    
    shopId: string;   
}

interface ListDiscountsOfProductProps {
    discounts: DiscountsShop[]; 
    productId: string;
    activeItem: string;
    toggleDown: boolean;
    addDiscountToProduct: (productId:string,price: number,quantity: number, codeId: string, shopId: string, 
        newDiscount : {
        codeId: string,
        userId: string,
        shopId: string
    }) => Promise<void>;
    removeDiscountFromProduct: ({codeId,productId,shopId,userId} : RemoveDiscountParams) => void;
    quantity: number;
    price: number;
    userId: string
}

const ListDiscountsOfProduct = (props:ListDiscountsOfProductProps) => {
    const {discounts,productId,activeItem,toggleDown, addDiscountToProduct, 
        removeDiscountFromProduct, userId, quantity, price } = props
    
        
    const [selectedIndex, setSelectedIndex] = useState<number | null>()
    
    if(activeItem === productId){
        if(discounts.length === 0){
            return(
                <div className="absolute w-full overflow-hidden">
                    <div className={`${toggleDown?'translate-y-0':"-translate-y-100"} transition-transform duration-300 flex flex-row p-3
                     border-x-1 border-b text-center cursor-pointer bg-white justify-between hover:bg-[#264653] hover:text-white transition-color duration-300`}>
                        Don't have discounts!!
                    </div>
                </div>
            )
        }

        return (
            <div className={`absolute w-full overflow-hidden`}>
            {discounts?.map((discount:DiscountsShop,i:number) => {
                return(
                    <div title={discount.discount_name} key={i} onClick={()=>{
                        if(selectedIndex !== i){
                            setSelectedIndex(i)
                            addDiscountToProduct(productId, price, quantity,discount.discount_code, discount.discount_shopId,{
                                codeId: `${discount.discount_code}`,
                                userId: `${userId}`,
                                shopId: `${discount.discount_shopId}`
                            })
                            
                        }else{
                            removeDiscountFromProduct({productId,codeId: discount.discount_code, shopId: discount.discount_shopId, userId: discount.discount_name})
                            setSelectedIndex(null);
                        }
                        }} className={`${toggleDown?'translate-y-0':"-translate-y-100"}  ${selectedIndex === i?'bg-[#0573f0] text-white' : 'bg-white'} transition-transform duration-300 flex flex-row p-3
                     border-x-1 border-b cursor-pointer  justify-between hover:bg-[#264653] hover:text-white transition-color duration-300`}>
                        <div className="font-bold">{discount.discount_code}</div>
                        <div>{discount.discount_description??""} <span className="text-[#73f535] pl-2">{selectedIndex === i? "✔":""}</span> </div>
                    </div>
                )
            })}
        </div>
        );
    }
    
}   

export default ListDiscountsOfProduct;