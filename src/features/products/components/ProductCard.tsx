"use client"
import Image from "next/image";
import styles from './productCard.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import Cookies from "js-cookie";
import { addToCart } from "@/features/cart/actions/addToCart";

interface ProductCardProps {
    _id: string;
    product_name: string;
    product_prevPrice: string;
    product_price:number;
    product_shop: string;
    product_slug: string;
    product_thumb: string;
    cartRem: number;
    
}

interface Products {
    products: ProductCardProps[],
    cartRem: number,
    numOfProduct: number;
}

interface CartResponse{
    message: string;
    status: number;
    metadata:{
        _id: string;
        cart_state: string;
        __v: number;
        cart_count_product: string;
        cart_products: [
            {
                productId: string;
                shopId: string;
                name: string;
                price: number;
            }
        ]
    }
}


export  function ProductGrid(props : Products) {
    const {products,cartRem, numOfProduct} = props
    
    return (
        <div className={`${styles.productCard_container} `}>
            <ul className={`${styles.prroductCart_list} grid ${numOfProduct===4? 'xl:grid-cols-16 sm:grid-cols-8' : 'xl:grid-cols-12 sm:grid-cols-8'}  mb-20`}>
                {products.map(product => (
                    <ProductCard key={product._id} {...product} cartRem = {cartRem} />
                ))}          
            </ul>
           
        </div>
    )
}
    


export  function ProductCard(props: ProductCardProps) {
    const {_id,product_name,product_price, product_thumb, product_prevPrice, product_slug, product_shop,cartRem} = props;
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const guestId = Cookies.get('guestId')
    const tempId = Cookies.get('tempId')
    if (!tempId){
        Cookies.set('tempId', guestId??"",{expires:365*100})
    }
    
    const handleAddToCart= async() : Promise<CartResponse | undefined>  => {
        const userId = Cookies.get(`_id`)
        const cartUserId : string | undefined = Cookies.get(`cartId_${userId}`)
        try {
            const res = await addToCart({
                userId: cartUserId? cartUserId:tempId??"",
                product:{
                    productId: _id,
                    shopId: product_shop,
                    name: product_name,
                    price: product_price,
                    imgThumb: product_thumb,
                    slug: product_slug,
                    quantity: 1
                }
            })
            
            
            localStorage.setItem('cartQuantity',res.metadata.cart_products.length)
            window.dispatchEvent(new Event('cartQuantityStorage'))

            return res
         
            
        } catch (error) {
            console.log('error addToCart', error);
        }
        
    }

    
    if(product_prevPrice){
        return(
        <li key={_id} className="col-span-4 gap-2 p-4 bg-white rounded-lg text-dark place-items-center" onMouseEnter={() => setIsHovered(true)}  onMouseLeave={() => setIsHovered(false)}>
            <div className={`${styles.thumbnail} relative`}>
                <a href={`/products/${_id}/${product_slug}`}>
                    <span className={`${styles.saleTag} absolute top-3 left-3 border border-[#dce3e5] bg-white rounded-2xl text-xs text-[#48515b] p-1.5`}>Sale!</span>
                    <Image src={product_thumb} alt={product_name} width= {300} height={300} />                           
                </a>
                <FontAwesomeIcon onClick={() => handleAddToCart()} className={`${isHovered?"opacity-100":"opacity-0"}  transition-opacity duration-300 hover:opacity-80 text-[#48515b] text-sm cursor-pointer absolute rounded rounded-full py-1.5 px-1.5 top-3 bg-[#f1e0e0]`} style={{right: `${cartRem}rem`}} icon={faCartShopping} />
            
            </div>
            <div>
                <a href={`/products/${_id}`} className={`${styles.productName} text-sm font-semibold`}>{product_name}</a>
                <p>
                    <span className="text-xs line-through text-[#48515b]">${product_prevPrice}.00</span>
                    <span className="pl-2 text-xs font-semibold">${product_price}.00</span> 
                </p>
            </div>
            
        </li>
        )
    }
    return (
        <li key={_id} className="col-span-4 gap-2 p-4 bg-white rounded-lg text-dark" onMouseEnter={() => setIsHovered(true)}  onMouseLeave={() => setIsHovered(false)}>
            <div className={`${styles.thumbnail} relative`}>
                <a href={`/products/${_id}/${product_slug}`}>
                <Image src={product_thumb} alt={product_name} width= {300} height={300} />
                </a>
                <FontAwesomeIcon  onClick={() => handleAddToCart()} className={`${isHovered?"opacity-100":"opacity-0"}  transition-opacity duration-300 hover:opacity-80 text-[#48515b] text-sm cursor-pointer absolute rounded rounded-full py-1.5 px-1.5 top-3 bg-[#f1e0e0]`} style={{right: `${cartRem}rem`}} icon={faCartShopping} />
            </div>
            
            <a href={`/products/${_id}/`} className={`${styles.productName} text-sm font-semibold`}>{product_name}</a>
            <p className="text-xs font-semibold">${product_price}.00</p>
        </li>
    )
}
