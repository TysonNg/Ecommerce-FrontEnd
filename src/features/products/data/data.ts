 'server-only'
import dotenv from "dotenv";
import { GetStaticProps, GetServerSideProps } from "next";
import { notFound } from "next/navigation";
dotenv.config();

const apiKey: string = `${process.env.API_KEY}`;
const rootUrl: string = 'http://localhost:3056/v1/api/product'


//get Product Hotdeals
export const  getProductsHotDeals = async() => {
    const res = await fetch(`${rootUrl}/hotDeals`,{
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


//get Product Detail
export const getProductDetail : GetStaticProps = async(productId) => {
  const res = await fetch(`${rootUrl}/${productId}`,{
    method: "GET",
    headers:{
      "x-api-key": apiKey 
    },
    next:{revalidate:600,tags: ['detailProduct']}
  })
  if (!res.ok) throw new Error("Fail to fetch Data getProductDetail");
  const {metadata} = await res.json()
  return {
    props: {data: metadata},
    revalidate: 10
  }  
  // return data.metadata
}


//get RelatedProduct
export async function getRelatedProductByCategory(category: string, productId: string, limit = 6 ) {
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


//get Product By Category
export const getProductByCategory = async(category: string,limit: number) => {
  const res = await fetch(`${rootUrl}/categories?category=${category}&&limit=${limit}`,{
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
export async function getAllProducts(limit:Number,category: any, apiKey: string, page: string) {
  
  const res = await fetch(`${rootUrl}${category?`/categories?category=${category}&&`:"?"}limit=${limit}&&page=${page}`,{
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
  const res = await fetch(`${rootUrl}/search/${params}`,{
    method: "GET",
    headers:{
      "x-api-key": apiKey 
    }
  })
  if (!res) throw new Error("Fail to fetch Data getProductByCategory");
  const data = await res.json()  
  return data.metadata
}

