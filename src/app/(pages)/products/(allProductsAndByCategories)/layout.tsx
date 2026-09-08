import { CartTab } from '@/features/cart/components/cartTab';
import { ProductSidebar } from '@/features/products/components/ProductSidebar';
import { Suspense } from 'react';

export const dynamic = "force-dynamic";

export default function Layout({children}: {children: React.ReactNode}) {

    return (
        <section className="min-h-screen bg-white pb-20">
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:grid lg:grid-cols-4 xl:grid-cols-5 lg:gap-8 items-start">
                <div className="hidden lg:block lg:col-span-1 sticky top-[148px] self-start transition-all">
                    <Suspense fallback={null}>
                        <ProductSidebar />
                    </Suspense>
                </div>
                <div className="w-full lg:col-span-3 xl:col-span-4 lg:pl-8 lg:border-l lg:border-slate-200">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6 text-[#0573f0] font-bold tracking-tight">SHOP</h1>
                    <Suspense fallback={null}>
                        {children}
                    </Suspense>
                </div>      
                <div>
                    <CartTab />
                </div>
            </div>
        </section>
    );
}