'use client'

import { useState } from "react";
import { addToCart } from "@/features/cart/actions/addToCart";
import Cookies from "js-cookie";
import { updateQuantityCart } from "@/features/cart/actions/updateQuantityCart";
import { getCartById } from "@/features/cart/data/data";

const HandleCart = (props: any) => {
    const {name,productId, shopId,price,imgThumb,cartTab, productQuantityCartTab, productIdCartTab, shopIdCartTab, onHandleChangePrice, slug} = props
    const [quantity, setQuantity] = useState(1);
    const [quantityCartTab, setQuantityCartTab] = useState(productQuantityCartTab)

    const inscreaseQuantity = () => {
        setQuantity((prev) => prev + 1 )
    }

    const decreaseQuantity= () => {
        if(quantity > 1) setQuantity((prev) => prev - 1)
    }

    const getProductOfCart = async() => {
        const res = await getCartById()        
        const result = res.metadata.cart_products.filter((item : any) => item.productId === `${cartTab? productIdCartTab : productId}`)
        return result
    }

    const handleAddToCart = async () => {
        const guestId : string | undefined = Cookies.get(`guestId`)
        if (!guestId){
            throw new Error('guestId is undefined')
        }
        const id : string | undefined = Cookies.get('_id')
        const cartUserId : string | undefined = Cookies.get(`guestId_${id}`)
        
        const res = await addToCart({
            userId: cartUserId? cartUserId:guestId,
            product:{
            name,
            price,
            productId,
            quantity,
            shopId,
            imgThumb,
            slug

        }})
        localStorage.setItem('cartQuantity',res.metadata.cart_products.length)
        window.dispatchEvent(new Event('cartQuantityStorage'))
        alert(`Successfully add ${quantity} product to cart!`)
        setTimeout(() => window.location.reload(),1000)
        return res
        
    }

    const handleUpdateCart = async(newQuantity:number) => {
        const guestId : string | undefined = Cookies.get(`guestId`)
        if (!guestId){
            throw new Error('guestId is undefined')
        }
        const id : string | undefined = Cookies.get('_id')
        const cartUserId : string | undefined = Cookies.get(`guestId_${id}`)
        
        if(!id){
            Cookies.set('tempIdCart', guestId)
        }
        const tempId: string | undefined = Cookies.get('tempIdCart')

        const product = await getProductOfCart()
        await updateQuantityCart({
            userId: cartUserId??tempId??'defaultId',
            shop_order_ids:[{
                shopId : shopIdCartTab?? "",
                item_products:[{
                    quantity: cartTab? newQuantity: quantity,
                    old_quantity: product[0].quantity,
                    productId: cartTab? productIdCartTab : productId
                }] 
            }]
        })
    }

    const handleClickDecrease = async() => {
        if(!cartTab){
            decreaseQuantity()
        }
        
        if(quantityCartTab > 1)
        {
            setQuantityCartTab((prev:any) =>prev - 1)
            const newQuantity = quantityCartTab - 1
            if(cartTab){
                onHandleChangePrice(newQuantity)
            }
            await handleUpdateCart(newQuantity)
        }
        
    }

    const handleClickIncrease = async() => {
        if(!cartTab){
            inscreaseQuantity()
        }
        setQuantityCartTab((prev:any) => prev + 1)
        const newQuantity = quantityCartTab + 1
        if(cartTab){
            onHandleChangePrice(newQuantity)
        }
        await handleUpdateCart(newQuantity)
    }

    return (
       <div className="flex items-center">
            <button onClick={handleClickDecrease} className="border-2 border-[#dce3e5]  bg-[#f8fbfc] py-1 px-3 cursor-pointer">-</button>
            <span className="border border-[#dce3e5] py-1 px-2 text-[#696969]">{cartTab? quantityCartTab: quantity}</span>
            <button onClick={handleClickIncrease} className="border-2 border-[#dce3e5] bg-[#f8fbfc] py-1 px-3 cursor-pointer">+</button>
            {/* addToCartBtn */}
            <button onClick={handleAddToCart} className={`${cartTab?"hidden":""} text-white bg-[#2b323e] px-4 py-1 ml-4 cursor-pointer hover:bg-[#0573f0] transition-colors duration-500 `}>
            <svg className="motion-reduce:hidden animate-spin ..." viewBox="0 0 24 24"> Processing...</svg>
            Add to cart
            </button>
       </div>
    );
}

export default HandleCart;