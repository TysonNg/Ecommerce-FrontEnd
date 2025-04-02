'use client'

import api from "@/app/protected/protected";

interface Checkout {
    userId: string;
    cartId: string;
    shop_order_ids:{
            shopId: string;
            shop_discount: string[];
            item_products:[
                {
                    price: number;
                    quantity: number;
                    productId: string
                }
            ] 
            
            
            }[]
}
export async function checkoutReview(payload:Checkout) {
    try {
        
        const res = await api.post('/checkout/review',payload)
        if(!res.data) throw new Error('Fail to fetch checkoutReview')
        return res.data
    } catch (error) {
        console.log('Fail to fetch checkoutReview', error);
        
    }
}