"use client";
import { ReactNode } from 'react';
import { ModalProvider } from "./ModalContext";
import { ToastProvider } from "./ToastContext";
import { ToastContainer } from "@/shared/toast/ToastContainer";

export const GlobalProvider = ({ children } :{ children: ReactNode }) => {
  return (
    <ModalProvider>
      <ToastProvider>
        {children}
        <ToastContainer />
      </ToastProvider>
    </ModalProvider>
  );
};