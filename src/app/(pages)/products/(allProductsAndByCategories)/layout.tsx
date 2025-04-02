import { CartTab } from '@/features/cart/components/cartTab';
import styles from './products.module.scss'


export default function Layout({children}: {children: React.ReactNode}) {

    return (
        <section className={`${styles.product_body} pb-30 bg-white`}>
            <div className={`${styles.produuct_body_container} w-[1200px] mx-auto my-0 flex flex-row grid grid-cols-6 mt-10 items-start `}>
                <div className={`${styles.categories} col-span-1 sticky top-0`}>
                    <h2 className='font-bold  '>Categories</h2>
                    <ul className='pl-5 mt-15 flex flex-col gap-2 text-sm text-[#5e6d73]'>
                        <li><a href="/products?category=audioVideo&&page=1">Audio & video</a></li>
                        <li><a href="/products?category=homeAppliances&&page=1">Home appliances</a></li>
                        <li><a href="/products?category=kitchenAppliances&&page=1">Kitchen appliances</a></li>
                        <li><a href="/products?category=laptop&&page=1">PC&laptop</a></li>
                        <li><a href="/products?category=clothing&&page=1">Clothing</a></li>
                        <li><a href="/products?category=electronics&&page=1">Electronics</a></li>
                        <li><a href="/products?category=jewelrys&&page=1">Jewerlys</a></li>
                        <li><a href="/products?category=gadget&&page=1">Gadget</a></li>
                        <li><a href="/products?category=others&&page=1">Others</a></li>
                    </ul>

                    <h2 className='mt-20 font-bold'>Filter by price</h2>
                    <h2 className='mt-20 font-bold'>Average rating</h2>
                </div>
                <div className={`${styles.products} col-span-5 pl-10 border-l-2 border-[#c3c3c3]`}>
                    <h1 className='text-5xl mb-15 mt-15 text-[#0573f0] font-bold'>SHOP</h1>
                        {children}
                </div>      
                <div className={`${styles.cartTab} `}>
                    <CartTab />
                 </div>
            </div>

        </section>
       
    );
}