"use client";

import React, { useEffect, useState } from "react";
import { useToast, ToastItem } from "@/app/context/ToastContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircleExclamation,
  faInfoCircle,
  faXmark,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

function ToastSingleItem({ toast }: { toast: ToastItem }) {
  const { removeToast } = useToast();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  const duration = toast.duration || 4000;

  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 40;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPaused, duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 250);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
            <FontAwesomeIcon icon={faCheck} className="text-sm" />
          </div>
        );
      case "error":
        return (
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-sm">
            <FontAwesomeIcon icon={faCircleExclamation} className="text-sm" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <FontAwesomeIcon icon={faInfoCircle} className="text-sm" />
          </div>
        );
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/10 p-4 transition-all duration-300 overflow-hidden ${
        isLeaving
          ? "opacity-0 translate-x-12 scale-95"
          : "animate-toast-enter opacity-100"
      }`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {getIcon()}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-800 tracking-tight">
              {toast.title}
            </h4>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close notification"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
          </div>

          {toast.message && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
              {toast.message}
            </p>
          )}

          {toast.product && (
            <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-50/80 border border-slate-100 rounded-xl">
              <div className="relative w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0 border border-slate-200/60">
                <Image
                  src={toast.product.thumb || "/banner.jpg"}
                  alt={toast.product.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">
                  {toast.product.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">
                    ${toast.product.price}.00
                  </span>
                  {toast.product.quantity && toast.product.quantity > 1 && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      x{toast.product.quantity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {toast.actionLabel && toast.onAction && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => {
                  toast.onAction?.();
                  handleClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer active:scale-95"
              >
                <FontAwesomeIcon icon={faCartShopping} className="text-[11px]" />
                {toast.actionLabel}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
        <div
          className={`h-full transition-all ease-linear ${
            toast.type === "success"
              ? "bg-emerald-500"
              : toast.type === "error"
              ? "bg-rose-500"
              : "bg-blue-600"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastSingleItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
