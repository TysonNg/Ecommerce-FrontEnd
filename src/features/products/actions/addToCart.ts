'use server'
import env from 'dotenv'
type AddToCart ={
   userId: string;
   product:{
    productId: string,
    shopId: string,
    quantity: number,
    name: string,
    price: number
   }
}
const apiKey: string = `${process.env.API_KEY}`;

export async function addToCart(formData:AddToCart) {
    const res = await fetch('http://localhost:3056/v1/api/cart/',{
        method:'POST',
        headers:{
            'x-api-key': apiKey
        },
        body: JSON.stringify({
           formData
        }),
        next:{revalidate:3600}
    })
    const response = await res.json()
    return response
}