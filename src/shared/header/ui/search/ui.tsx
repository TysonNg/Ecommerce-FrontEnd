'use client'
import {FontAwesomeIcon,} from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass
  } from "@fortawesome/free-solid-svg-icons";
import styles from './search.module.scss'
import { useState } from "react";
import { searchProducts } from "@/features/products/data/data";
import Image from "next/image";
interface ProductSearch{
    _id: string;
    product_name: string;
    product_thumb: string;
    product_slug: string;
}

export const SearchBar = () => {
    const apiKey: string = `${process.env.NEXT_PUBLIC_API_KEY}`;
    const [input,setInput] = useState<string>('');
    const [data, setData] = useState<ProductSearch[]>([])
   

    const handleChange = async (value:string) => {
        setInput(value)
        const datas= await searchProducts(value,apiKey)
        setData(datas)
        console.log(data);
                
    }

    return (

        <div className={`${styles.searchBar}`}> 
                <div className='flex flex-row justify-center '>
                    <input className={`${styles.searchBar__input} w-full bg-white text-black outline-none`} type="text" placeholder="Type to search..."  value={input}
                    onChange={(e) => handleChange(e.target.value)}/>
                    <button className={`${styles.searchBar__btn} text-white p-3 cursor-pointer hover:opacity-75 bg-white`}>
                    <FontAwesomeIcon className="text-[#0573f0]" icon={faMagnifyingGlass} />
                    </button>
                </div>
                <div className={`${styles.resultsList_container}`}>
                    <div className={`${styles.box} z-1 absolute max-w-[390px] sm:w-[190px] max-h-[220px] overflow-y-auto `}>
                    {data?.map((item,i) => {
                        return(
                            <div key={i} className={`${data?"":"hidden"} shadow-[0_2px_8px_0px_rgba(99,99,99,0.2)] px-3 py-5 bg-white text-black border-1 border-[#a9a9a9] hover:bg-[#E76F51] hover:text-[#98FF98] p-4 transition`}>
                                <a  href={`/products/${item._id}/${item.product_slug}`}>
                                    <div className="flex flex-row items-center gap-1">
                                        <Image src={item.product_thumb} alt={item.product_name} width={50} height={50}/>  
                                        <span className="text-sm font-bold truncate">{item.product_name}</span>
                                    </div>
                                </a>
                            </div>
                        )
                    })} 
                   </div>
                    
                   
                </div>
        </div>

    )
}