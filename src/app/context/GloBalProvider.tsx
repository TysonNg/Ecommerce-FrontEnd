"use client";


import { ModalProvider } from "./ModalContext";


// Gộp tất cả context
export const GlobalProvider = ({ children } :any) => {
  return (
    <ModalProvider>
        {children}
    </ModalProvider>
  );
};