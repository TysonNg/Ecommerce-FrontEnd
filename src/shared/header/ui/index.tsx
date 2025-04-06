'use client'
import { Navbar } from "./navbar";
import { SearchBar } from "./search/ui";
import { RightTopHeader } from "./RightTopHeader";
import { Supports } from "./support";
import { useEffect, useState } from "react";
import Link from "next/link";


export const Header = () => {
  const [quantity, setQuantity] = useState<number>(0);
 
  useEffect(() =>{

    if (typeof window !== 'undefined') {
      const value = localStorage.getItem("cartQuantity");
      setQuantity(value ? Number(value) : 0);
    }
    
    const handleStorageChange = () => {
      
      const updatedQuantity = Number(localStorage.getItem('cartQuantity') || 0)
      setQuantity(updatedQuantity)
    }

    window.addEventListener('cartQuantityStorage', handleStorageChange)
    return () => window.removeEventListener("cartQuantityStorage", handleStorageChange)
  },[])

  return (
    <header>
      <div className="">
        <div className="bg-[#0769da] w-full  ">
          <div
            className={` xl:w-[1200px] lg:w-[700px] mx-auto my-0  flex flex-row justify-between  text-white `}
          >
            <div className="">
              <Supports />
            </div>
            <div className="">
              <RightTopHeader />
            </div>
          </div>
        </div>  

        <div className={`bg-[#0573f0] w-full py-10 h-auto`}>
          <div
            className={`flex flex-row justify-between text-white xl:w-[1200px] lg:w-[700px] mx-auto`}
          >
            <div className="content-center">
              <Link href={"/"}>
                <p className="text-3xl font-bold cursor-pointer">E-Shop</p>
              </Link>
            </div>
            <div className="content-center ">
              <SearchBar />
            </div>
          </div>
        </div>

        <div className="text-white border-t border-[#4068d3] bg-[#0573f0] w-full">
          <Navbar cart={quantity}/>
        </div>
      </div>
    </header>
  );
};
