"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface ToastProductInfo {
  name: string;
  price: number;
  thumb: string;
  quantity?: number;
}

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
  duration?: number;
  product?: ToastProductInfo;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
  product?: ToastProductInfo;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (options: ToastOptions & { type: "success" | "error" | "info" }) => string;
  removeToast: (id: string) => void;
  toast: {
    success: (options: ToastOptions) => string;
    error: (options: ToastOptions) => string;
    info: (options: ToastOptions) => string;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addToast = useCallback(
    (options: ToastOptions & { type: "success" | "error" | "info" }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = {
        id,
        duration: 4000,
        ...options,
      };

      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const toast = {
    success: useCallback(
      (options: ToastOptions) => addToast({ ...options, type: "success" }),
      [addToast]
    ),
    error: useCallback(
      (options: ToastOptions) => addToast({ ...options, type: "error" }),
      [addToast]
    ),
    info: useCallback(
      (options: ToastOptions) => addToast({ ...options, type: "info" }),
      [addToast]
    ),
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
