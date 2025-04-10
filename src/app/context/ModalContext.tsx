'use client'

import {createContext, useContext, useEffect, useState} from 'react'
import { usePathname } from "next/navigation";

interface ModalContextType  {
    isModalOpen: boolean;
    isCartModalOpen: boolean;
    isPageHaveCartTab: boolean;
    openCartModal: () => void;
    closeCartModal: () => void;
    openModal: () => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false)
    const [isPageHaveCartTab, setIsPageHaveCartTab] = useState(true)


    const openCartModal = () => setIsCartModalOpen(true)
    const closeCartModal = () => setIsCartModalOpen(false)


    const openModal = () => {
      setIsModalOpen(true)
      document.body.classList.add("overflow-hidden")
    }
    const closeModal = () =>{
      setIsModalOpen(false)
      document.body.classList.remove("overflow-hidden")
    } 
  

    useEffect(() => {
      if(pathname === '/cart' || pathname === '/cart/checkout'){
        setIsPageHaveCartTab(false)
      }else{
        setIsPageHaveCartTab(true)
      }
    })
    
    return (
      <ModalContext.Provider value={{ isModalOpen, openModal, closeModal ,isCartModalOpen,openCartModal,closeCartModal,isPageHaveCartTab}}>
        {children}
      </ModalContext.Provider>
    );
  }

  export function useModal(){
    const context = useContext(ModalContext);
    if (!context) {
      throw new Error('useModal phải được sử dụng bên trong ModalProvider');
    }
    return context;
  }