import 'server-only'
import dotenv from "dotenv";
dotenv.config();

const apiKey: string = `${process.env.API_KEY}`;
const rootUrl: string = 'http://localhost:3056/v1/api/product'

export async function getProductsHotDeals() {
    const res = await fetch(`${rootUrl}/hotDeals`,{
        method: "GET",
        headers:{
          "x-api-key": apiKey 
        },
        next:{revalidate:3600,tags: ['hotDeals']}
      })
    
    
    if (!res) throw new Error("Fail to fetch Data getProductsHotDeals");
    const data = res.json()
    return data
}


export async function getProductDetail(productId: string) {
  const res = await fetch(`${rootUrl}/${productId}`,{
    method: "GET",
    headers:{
      "x-api-key": apiKey 
    },
    next:{revalidate:600,tags: ['detailProduct']}
  })
  if (!res) throw new Error("Fail to fetch Data getProductDetail");
  const data = await res.json()  
  return data.metadata
}

export async function getRelatedProductByCategory(category: string, productId: string, limit = 5 ) {
  const res = await fetch(`${rootUrl}/categories?category=${category}&&limit=${limit}`,{
    method: "GET",
    headers:{
      "x-api-key": apiKey 
    },
    next:{revalidate:600}
  })
  if (!res) throw new Error("Fail to fetch Data getProductByCategory");
  const response = await res.json()
  const data = response.metadata.filter((item:any) => item._id !== productId)
  return data
}

export async function getProductByCategory(category: string) {
  const res = await fetch(`${rootUrl}/categories?category=${category}`,{
    method: "GET",
    headers:{
      "x-api-key": apiKey 
    },
    next:{revalidate:600}
  })
  if (!res) throw new Error("Fail to fetch Data getProductByCategory");
  const data = await res.json()  
  return data.metadata
}