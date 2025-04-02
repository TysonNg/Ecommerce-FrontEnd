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
    product_price:number;
    product_thumb: string;
    product_prevPrice: string;
    product_slug: string;
    product_shop: string;
    cartRem: Number;
    
}

interface Products {
    products: ProductCardProps[],
    cartRem: Number,
    numOfProduct: Number;
}

interface CartResponse{
    message: string;
    status: Number;
    metadata:{
        _id: string;
        cart_state: string;
        __v: Number;
        cart_count_product: string;
        cart_products: [
            {
                productId: string;
                shopId: string;
                name: string;
                price: Number;
            }
        ]
    }
}


export  function ProductGrid(props : Products) {
    const {products,cartRem, numOfProduct} = props
    
    return (
        <div className={`${styles.productCard_container} `}>
            <ul className={`${styles.prroductCart_list} grid ${numOfProduct===4?'grid-cols-16' : 'grid-cols-12'}  mb-20`}>
                {products.map(product => (
                    <ProductCard key={product._id} {...product} cartRem = {cartRem} />
                ))}          
            </ul>
           
        </div>
    )
}
    


export  function ProductCard(props: ProductCardProps) {
    const {_id,product_name,product_price, product_thumb, product_prevPrice, product_slug, product_shop,cartRem} = props;
    const [isHovered, setIsHovered] = useState<Boolean>(false)
    
    const handleAddToCart= async() : Promise<CartResponse | undefined>  => {
        const guestId : string | undefined = Cookies.get(`guestId`)
        const userId = Cookies.get(`_id`)

        if (!guestId){
            throw new Error('guestId is undefined')
        }
        const cartUserId : string | undefined = Cookies.get(`guestId_${userId}`)
        try {
            const res = await addToCart({
                userId: cartUserId? cartUserId:guestId,
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
        <li key={_id} className="col-span-4 rounded-lg bg-white text-dark gap-2 p-4" onMouseEnter={() => setIsHovered(true)}  onMouseLeave={() => setIsHovered(false)}>
            <div className={`${styles.thumbnail} relative`}>
                <a href={`/products/${_id}/${product_slug}`}>
                    <span className={`${styles.saleTag} absolute top-3 left-3 border border-[#dce3e5] bg-white rounded-2xl text-xs text-[#48515b] p-1.5`}>Sale!</span>
                    <Image src={product_thumb} alt={product_name} width= {300} height={300} />                           
                </a>
                <FontAwesomeIcon title="Add to cart" onClick={() => handleAddToCart()} className={`${isHovered?"opacity-100":"opacity-0"}  transition-opacity duration-300 hover:opacity-80 text-[#48515b] text-sm cursor-pointer absolute rounded rounded-full py-1.5 px-1.5 top-3 bg-[#f1e0e0]`} style={{right: `${cartRem}rem`}} icon={faCartShopping} />
            
            </div>
            <div>
                <a href={`/products/${_id}`} className={`${styles.productName} text-sm font-semibold`}>{product_name}</a>
                <p>
                    <span className="text-xs line-through text-[#48515b]">${product_prevPrice}.00</span>
                    <span className="text-xs font-semibold pl-2">${product_price}.00</span> 
                </p>
            </div>
            
        </li>
        )
    }
    return (
        <li key={_id} className=" col-span-4 rounded-lg bg-white text-dark gap-2 p-4" onMouseEnter={() => setIsHovered(true)}  onMouseLeave={() => setIsHovered(false)}>
            <div className={`${styles.thumbnail} relative`}>
                <a href={`/products/${_id}/${product_slug}`}>
                <Image src={product_thumb} alt={product_name} width= {300} height={300} />
                </a>
                <FontAwesomeIcon title="Add to cart" onClick={() => handleAddToCart()} className={`${isHovered?"opacity-100":"opacity-0"}  transition-opacity duration-300 hover:opacity-80 text-[#48515b] text-sm cursor-pointer absolute rounded rounded-full py-1.5 px-1.5 top-3 bg-[#f1e0e0]`} style={{right: `${cartRem}rem`}} icon={faCartShopping} />
            </div>
            
            <a href={`/products/${_id}/`} className={`${styles.productName} text-sm font-semibold`}>{product_name}</a>
            <p className="text-xs font-semibold">${product_price}.00</p>
        </li>
    )
}
