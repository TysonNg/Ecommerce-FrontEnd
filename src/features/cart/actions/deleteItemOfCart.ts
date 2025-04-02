'use client'

import api from "@/app/protected/protected";

interface DeleteItemOfCart {
    userId: string|undefined;
    productId: string
 }

export async function deleteItemOfCart(payload:DeleteItemOfCart) {
    try {        
        const res = await api.delete('/cart',{
            data: payload
        })
        if(!res.data) throw new Error('Fail to fetch deleteItemOfCart')
        return res.data
    } catch (error) {
        console.log('Fail to fetch deleteItemOfCart', error);
        
    }
}