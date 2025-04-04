'use client'
import api from "@/app/protected/protected";
interface Product{
    product_name: string;
    product_prevPrice: number;
    product_price: number;
    product_type: string;
    product_description: string;
    product_thumb: string;
    product_images:string[];
    product_quantity: number;
    product_attributes:{
        brand: string,
        model: string,
        material: string
    }
}

export async function createProduct(payload:Product) {
    try { 
        const res = await api.post('/product',payload)
        
        return res.data
    } catch (error) {
        console.log(error);
    }
}