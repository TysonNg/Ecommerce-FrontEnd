'use client'

import { useState } from "react";
import { addToCart } from "../../actions/addToCart";


const AddToCart = (props: any) => {
    const {name,productId, shopId,price, userId} = props
    const [quantity, setQuantity] = useState(1);

    const inscreaseQuantity = () => {
        setQuantity((prev) => prev + 1 )
    }

    const decreaseQuantity= () => {
        if(quantity > 1) setQuantity((prev) => prev - 1)
    }

    const handleAddToCart = async () => {
        const add = await addToCart({userId,product:{
            name,
            price,
            productId,
            quantity,
            shopId
        }})
        await add()
        alert(`Successfully add ${quantity} product to cart!`)
    }
    return (
       <div className="flex items-center mt-4">
            <button onClick={decreaseQuantity} className="border-2 border-[#dce3e5]  bg-[#f8fbfc] py-1 px-3">-</button>
            <span className="border border-[#dce3e5] py-1 px-2">{quantity}</span>
            <button onClick={inscreaseQuantity} className="border-2 border-[#dce3e5] bg-[#f8fbfc] py-1 px-3">+</button>
            {/* addToCartBtn */}
            <button onClick={handleAddToCart} className="text-white bg-[#2b323e] px-4 py-1 ml-4">
            <svg className="motion-reduce:hidden animate-spin ..." viewBox="0 0 24 24"> Processing...</svg>
            Add to cart
            </button>
       </div>
    );
}

export default AddToCart;