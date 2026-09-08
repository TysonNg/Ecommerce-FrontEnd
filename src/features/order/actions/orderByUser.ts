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

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

export async function OrderByUser(payload: Order) {
  try {
    const res = await api.post('/checkout/handleOrder', payload);
    if (!res.data) throw new Error('No response data from server');
    return { success: true, data: res.data };
  } catch (error: unknown) {
    console.error('Fail to fetch OrderByUser:', error);
    const err = error as AxiosErrorLike;
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Failed to place order. Please try again.';
    return { success: false, message };
  }
}



