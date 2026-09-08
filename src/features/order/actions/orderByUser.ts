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
export async function OrderByUser(payload: Order) {
  try {
    const res = await api.post('/checkout/handleOrder', payload);
    if (!res.data) throw new Error('No response data from server');
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error('Fail to fetch OrderByUser:', error);
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Failed to place order. Please try again.';
    return { success: false, message };
  }
}



