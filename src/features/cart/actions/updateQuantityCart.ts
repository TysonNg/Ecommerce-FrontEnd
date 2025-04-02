'use client'

import api from "@/app/protected/protected";

interface UpdateCart {
    userId: string;
    shop_order_ids:[
        {
            shopId: string;
            item_products: [{
                quantity: number,
                old_quantity: number,
                productId: string
            }]
        }
    ]
 }
export async function updateQuantityCart(payload:UpdateCart) {
    
    try {
        const res = await api.post('/cart/update',payload)
        if(!res.data) throw new Error('Fail to fetch addToCart')
        
        return res.data
    } catch (error) {
        console.log('Fail to fetch addToCart', error);
        
    }
}