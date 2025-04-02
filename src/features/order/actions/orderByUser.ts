'use client'

import api from "@/app/protected/protected";

interface Order {
    cartId: string;
    userId: string;
    shop_order_ids:{
        shopId: string;
        shop_discount: [
            {
                codeId: string;
                shopId: string;
                userId: string;
            } 
        ] | [],
        item_products:[
            {
                price: number;
                quantity: number;
                productId: string;
            }
        ]
    }[],
    user_address:{
        name: string,
        street: string;
        city: string;
        country: string;
        phone: number
    },
    user_payment: {
        method: string
    }
 }
export async function OrderByUser(payload:Order) {
    try {        
        const res = await api.post('/checkout/handleOrder',payload)
        if(!res.data) throw new Error('Fail to fetch OrderByUser')
        return res.data
    } catch (error) {
        console.log('Fail to fetch OrderByUser', error);
        
    }
}



