'use server'

type Product ={
    _id: string;
    product_name: string;
    product_price: number;
    product_images : Array<string>
    product_type : string
    product_description : string
    product_thumb : string
    product_quantity : number
    product_attributes : Object
}

export async function createProduct(formData:Product) {
    const res = await fetch('http://localhost:3056/v1/api/product/',{method:'POST'})
    const data = await res.json()
    return {
        message: 'CreateProduct Success',
        data
    }
}