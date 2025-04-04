 'server-only'
import dotenv from "dotenv";
dotenv.config();

const apiKey: string = `${process.env.NEXT_PUBLIC_API_KEY}`;
const rootUrl: string = `${process.env.NEXT_PUBLIC_ROOT_URL}`


interface ItemRelateCategory{
  _id: string;
  product_name: string;
  product_prevPrice: string;
  product_shop: string;
  product_slug: string;
  product_thumb: string;
}

//get Product Hotdeals
export const  getProductsHotDeals = async() => {
    const res = await fetch(`${rootUrl}/product/hotDeals`,{
        method: "GET",
        headers:{
          "x-api-key": apiKey 
        },
        next:{revalidate:3600,tags: ['hotDeals']}
      })
    
    
    if (!res) throw new Error("Fail to fetch Data getProductsHotDeals");
    const {metadata} = await res.json()
    return metadata
}


// get Product Detail
export const getProductDetail=  async(productId : string) => {
  
  const res = await fetch(`${rootUrl}/product/${productId}`,{
    method: "GET",
    headers:{
      "x-api-key": apiKey 
    },
    next:{revalidate:600,tags: ['detailProduct']}
  })
  if (!res.ok) throw new Error("Fail to fetch Data getProductDetail");
  const {metadata}  = await res.json()
  return metadata

}


//get RelatedProduct
export async function getRelatedProductByCategory(category: string, productId: string, limit = 6 ) {
  const res = await fetch(`${rootUrl}/product/categories?category=${category}&&limit=${limit}`,{
    method: "GET",
    headers:{
      "x-api-key": apiKey 
    },
    next:{revalidate:600}
  })
  if (!res) throw new Error("Fail to fetch Data getProductByCategory");
  const response = await res.json()
  
  const data = response.metadata.filter((item:ItemRelateCategory) => item._id !== productId)
  return data
}


//get Product By Category
export const getProductByCategory = async(category: string,limit: number) => {
  const res = await fetch(`${rootUrl}/product/categories?category=${category}&&limit=${limit}`,{
    method: "GET",
    headers:{
      "x-api-key": apiKey 
    }
  })
  if (!res) throw new Error("Fail to fetch Data getProductByCategory");
  const data = await res.json()  
  return data.metadata
}


//get All Products
export async function getAllProducts(limit:number,category: string, apiKey: string, page: string) {
  
  const res = await fetch(`${rootUrl}/product${category?`/categories?category=${category}&&`:"?"}limit=${limit}&&page=${page}`,{
    method: "GET",
    headers:{
      "x-api-key": apiKey
    },
    next:{revalidate:600}
  })
  if (!res) throw new Error("Fail to fetch Data getAllProducts");
  const data = await res.json()  
  return data.metadata
}


//search product
export async function searchProducts(params: string, apiKey: string){
  const res = await fetch(`${rootUrl}/product/search/${params}`,{
    method: "GET",
    headers:{
      "x-api-key": apiKey 
    }
  })
  if (!res) throw new Error("Fail to fetch Data getProductByCategory");
  const data = await res.json()  
  return data.metadata
}

