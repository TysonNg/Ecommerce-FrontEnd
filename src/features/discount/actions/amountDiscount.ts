'use client'

import api from "@/app/protected/protected";

interface AmountDiscount {
    codeId: string;
    userId: string;
    shopId: string;
    products:[
        {
            productId: string;
            quantity: number;
            price: number
        }
    ]
 }
export async function amountDiscount(payload:AmountDiscount) {
    try {        
        const res = await api.post('/discount/amount',payload)
        if(!res.data) throw new Error('Fail to fetch amountDiscount')
        console.log('amountDiscount', res.data);
        return res.data
    } catch (error) {
        console.log('Fail to fetch amountDiscount', error);
        
    }
}



