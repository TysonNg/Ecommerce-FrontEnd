'use client'
import { getAllProducts } from '@/features/products/data/data';
import { ProductGrid } from '@/features/products/components/ProductCard';
import { useSearchParams } from "next/navigation";
import dotenv from "dotenv";
import { useEffect, useState } from 'react';
import NotFoundProducts from '@/features/cart/components/not-found';
dotenv.config();
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const ProductsPage = () => {
    const apiKey: string = `${process.env.NEXT_PUBLIC_API_KEY}`;
    const pageSize = 12
    const searchParams = useSearchParams();
    
    const [products, setProducts] = useState([])
    const [allResults, setAllResults] = useState([])
    const [paginations, setPaginations] = useState<number[]>([])
    const [categoryParams, setCategoryParams] = useState<string>("")

    useEffect(() => {
       
            const category :string = searchParams.get('category')??""
            const page :string = searchParams.get('page')??""
            setCategoryParams(category)

            const fetchAllProducts = async (category:string) => {
                try {
                    const res = await getAllProducts(pageSize,category,apiKey,page)
                    const allResultsData = await getAllProducts(0,category,apiKey,page)
                    if(!res) throw new Error("Error fetchAllProducts")
                    setProducts(res)
                    setAllResults(allResultsData)                
                    const pages = Math.ceil(allResultsData.length / pageSize)
                    const arrayPages = []

                    for (let page = 1; page <= pages; page++) {
                        arrayPages.push(page)   
                    }
                    setPaginations(arrayPages)
                    
                } catch (error) {
                    console.log(error);  
                }
            }
            fetchAllProducts(category)

           

    },[searchParams.get('category'),searchParams.get('page')])
    
    
    if(allResults.length){
        return(
        <div className="products_container">
                <div className='text-sm flex flex-row justify-between text-[#48515b] mb-10'>
            <p>Showing 1-12 of {allResults.length} results</p>
            <p>Default sorting</p>
            </div> 
            <ProductGrid products={products} numOfProduct={6} cartRem={1} />
            <div className='pagination-container'>
            <div className='pagination-item flex flex-row justify-center'>
                {paginations.map((page,i) => {
                    return(
                        <a key={i} href={`${process.env.NEXT_PUBLIC_ROOT_URL}/products${categoryParams? `?category=${categoryParams}&&page=${page}`:`?page=${page}`} `}>
                            <div  className='mx-2 border-1 p-2 text-sm cursor-pointer hover:text-white hover:bg-[#0573f0] transition-color duration-300'>
                                    {page} 
                            </div>
                        </a>
                    )
                })}
            </div>
            </div>
          
        </div>
        )
    }
    return(
        <div className='notFoundProducts-container'>
            <NotFoundProducts />
          
        </div>
    )
    
}

export default ProductsPage;