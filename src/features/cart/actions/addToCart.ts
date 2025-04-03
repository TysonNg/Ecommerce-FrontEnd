'use client'

import api from "@/app/protected/protected";
interface AddToCart {
    userId: string;
    product:{
     productId: string,
     shopId: string,
     quantity: number,
     imgThumb: string,
     name: string,
     price: number,
     slug: string
    }
 }
export async function addToCart(payload:AddToCart) {
    try {
        
        console.log('payloadAddtoCart', payload);
        
        const res = await api.post('/cart',payload)
        console.log('res add Cart', res.data);
        
        if(!res.data) throw new Error('Fail to fetch addToCart')
        return res.data
    } catch (error) {
        console.log('Fail to fetch addToCart', error);
        
    }
}