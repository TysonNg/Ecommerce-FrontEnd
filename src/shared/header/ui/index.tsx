'use client'
import { Logo } from "./logo";
import { Navbar } from "./navbar";
import { SearchBar } from "./search/ui";
import { RightTopHeader } from "./RightTopHeader";
import { Supports } from "./support";
import styles from "./ui.module.scss";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
export const Header = () => {
  const [quantity, setQuantity] = useState<number>(() : any => {
    if(typeof window !== 'undefined'){
      return Number(localStorage.getItem("cartQuantity")) || 0;

    }
  });
 
  useEffect(() =>{

    const handleStorageChange = () => {
      if(!Cookies.get('refreshToken')){
        localStorage.removeItem('cartQuantity')
      }
      const updatedQuantity = Number(localStorage.getItem('cartQuantity') || 0)
      setQuantity(updatedQuantity)
    }
    window.addEventListener('cartQuantityStorage', handleStorageChange)
    return () => window.removeEventListener("cartQuantityStorage", handleStorageChange)
  },[])

  return (
    <header>
      <div className="container-fluid">
        <div className=" bg-[#0769da]">
          <div
            className={`${styles.top_header_container} grid grid-cols-5 text-white `}
          >
            <div className=" col-start-1">
              <Supports />
            </div>
            <div className="col-end-13">
              <RightTopHeader />
            </div>
          </div>
        </div>

        <div className={`bg-[#0573f0] py-2 h-[150px]`}>
          <div
            className={`${styles.header_container} grid grid-cols-12 gap-4  text-white w-[1200px] `}
          >
            <div className="col-span-2 col-start-1 ">
              <Logo />
            </div>
            <div className="col-span-4 col-end-13 content-center ">
              <SearchBar />
            </div>
          </div>
        </div>

        <div className="bg-[#0573f0] text-white border-t border-[#4068d3]">
          <Navbar cart={quantity}/>
        </div>
      </div>
    </header>
  );
};
