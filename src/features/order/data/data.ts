'use client'
import api from "@/app/protected/protected"



export async function getAllOrders() {

    const res = await api.get('/checkout/getOrders')
    console.log('fetch successfully getAllorders', res.data);
    return res.data.metadata

}