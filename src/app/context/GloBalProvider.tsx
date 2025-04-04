"use client";
import { ReactNode } from 'react'
import { ModalProvider } from "./ModalContext";


export const GlobalProvider = ({ children } :{ children: ReactNode }) => {
  return (
    <ModalProvider>
        {children}
    </ModalProvider>
  );
};