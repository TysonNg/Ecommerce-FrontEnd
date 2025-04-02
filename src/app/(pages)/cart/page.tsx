'use client'
import { getCartById } from "@/features/cart/data/data";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { deleteItemOfCart } from "@/features/cart/actions/deleteItemOfCart";
import Image from "next/image";
import HandleCart from "@/features/products/components/buttons/HandleCart";
import {
    FontAwesomeIcon,
  } from "@fortawesome/react-fontawesome";
import {  faCaretDown, faTicket } from "@fortawesome/free-solid-svg-icons";
import NotFoundProducts from "@/features/cart/components/not-found";
import { checkoutReview } from "@/features/cart/actions/reviewCheckout";
import { getAllDiscountOfProduct } from "@/features/discount/data/data";
import ListDiscountsOfProduct from "@/features/discount/components/ListDiscountsOfProduct";
import { amountDiscount } from "@/features/discount/actions/amountDiscount";
import { cancelDiscount } from "@/features/discount/actions/cancelDiscount";
import { useModal } from "@/app/context/ModalContext";

interface ProductsCart{
    name: string;
    price: number | undefined;
    productId: string;
    shopId: string;
    imgThumb: string;
    quantity: number | undefined;
    slug: string | undefined;
}

interface Checkout {
    checkout_order:{
        totalPrice: number;
        feeShip: number;
        totalDiscount: number;
        totalCheckout: number;
    };
    shop_order_ids: {
        shopId: string;
        shop_discount: [];
        item_products:[
            {
                price: number;
                quantity: number;
                productId: string
            }
        ]
    }[];
    shop_order_ids_new: {
        shopId: string;
        shop_discount: [];
        priceRaw: number;
        priceApplyDiscount:number;
        item_products:[
            {
                price: number;
                quantity: number;
                productId: string
            }
        ]
    }[]
 }

interface CheckoutRequest{
    userId: string;
    cartId: string;
    shop_order_ids:{
            shopId: string;
            shop_discount: string[];
            item_products:[
                {
                    price: number;
                    quantity: number;
                    productId: string
                }
            ] 
    }[]
}
interface DiscountsShop{
    discount_name: string;
    discount_description: string;
    discount_code: string;
    discount_start_date: Date ;
    discount_end_date: Date;
    discount_shopId: string;
    discount_product_ids:[];

}

interface CodeDiscount{
    codeId: string;
    shopId: string
}

export default function cartPage() {

    const id: string | undefined = Cookies.get('_id')
    const cartUserId : string|undefined = Cookies.get(`guestId_${id}`)
    const tempId : string|undefined = Cookies.get('tempId')

    const {noCartTab} = useModal()
    const [cart, setCart] = useState<Array<ProductsCart | undefined>>([])
    const [checkoutData, setCheckoutData] = useState<Checkout>()
    const [discounts,setDiscounts] = useState<DiscountsShop[]>()
    const [activeItem, setActiveItem] = useState<string>()
    const [toggleDown, setTogleDown] = useState<boolean>(false)
    const [checkout, setCheckout] = useState<CheckoutRequest>({
        userId: id??"",
        cartId: cartUserId??"",
        shop_order_ids: cart.map(item => (
            {
                shopId: item?.shopId??"",
                shop_discount:[],
                item_products:[
                    {
                        price: item?.price??0,
                        quantity: item?.quantity??0,
                        productId: item?.productId??""
                    }
                ]
            }
        ))
    })
    const [codeIdState, setCodeIdState] = useState<CodeDiscount>()

    
    //get Cart
    useEffect(() => {
        noCartTab()
        const fetchCart = async() => {
            try {
                const res = await getCartById()
                setCart(res.metadata.cart_products)
                return res
            } catch (err) {
                console.log('err: cartPage', err);
            }
        }
        fetchCart()
    },[])

    //get checkoutReview after updated cart
    useEffect(() => {
        const fetchCheckout = async() => {
            try {
                const res = await checkoutReview(checkout?.shop_order_ids[0]? checkout:{
                    userId: id??"",
                    cartId: cartUserId??"",
                    shop_order_ids: cart.map(item => (
                        {
                            shopId: item?.shopId??"",
                            shop_discount:[],
                            item_products:[
                                {
                                    price: item?.price??0,
                                    quantity: item?.quantity??0,
                                    productId: item?.productId??""
                                }
                            ]
                        }
                    ))
                })
                
                if(res.metadata){
                    sessionStorage.setItem(`reviewCheckout_${cartUserId}`,JSON.stringify(res.metadata))

                }
                console.log('checkout', res.metadata);
                
                setCheckoutData(res.metadata)                
                return res.metadata

            } catch (error) {
                console.log('checkout', error);
            }
        }
        fetchCheckout()

    },[cart,checkout])

    //when changing price => update quantity
    const handleChangePrice = (newQuantity:number, productId: any) =>{
        setCart((prevCart) : any => {

        const updatedCart = prevCart.map((item) => item?.productId === productId? {...item, quantity: newQuantity} : {...item})
        
        setCheckout((prevCheckout) : any => {
            const updateCheckout = {
                ...prevCheckout,
                shop_order_ids: prevCheckout.shop_order_ids.map((item : any) => ({
                    ...item,
                    item_products: item.item_products.map((product : any) => 
                        product.productId === productId? {...product,quantity: newQuantity} : {...product}
                    )
                }))
            }

            return updateCheckout
            }
        )

        return updatedCart
        })
    }

    //delete Item of cart
    const handleDeleteItem = async(productId: string) => {
        setCart((prevCart) => prevCart.filter(item => item?.productId !== productId))
        const res = await deleteItemOfCart({
            userId: cartUserId??tempId,
            productId
        })
        if(res) 
            {
                localStorage.setItem('cartQuantity', `${cart.length - 1}`)
                window.dispatchEvent(new Event('cartQuantityStorage'))
            }
        return res 
    }

    const getDiscountsOfProduct = async(productId: string) => {
        const res = await getAllDiscountOfProduct(productId)
        
        setActiveItem(productId)
        setDiscounts(res)
        setTogleDown(prev => !prev)
        return res
    }

    //add Discount to reduce value of product
    const addDiscountToProduct = async(productId:string,price: number,quantity: number, codeId: string, shopId: string, 
        newDiscount : {
        codeId: string,
        userId: string,
        shopId: string
    }) => {
       
        await amountDiscount({
            codeId,
            userId: id??"", 
            shopId,
            products:[{
                productId,
                quantity,
                price
            }]
        })

        if(codeId !== codeIdState?.codeId){
            await cancelDiscount({codeId: codeIdState?.codeId??"", userId: id??"", shopId: codeIdState?.shopId??""})
        }

        setCodeIdState({
            codeId,
            shopId
        })

        if(!checkout?.shop_order_ids[0])
        {
            setCheckout((prevCheckout:any) => {
                const updateCheckout = {
                    ...prevCheckout,
                    shop_order_ids: cart.map((item:any, i : any) => (
                        {
                            shopId: item?.shopId??"",
                            shop_discount:[],
                            item_products:[
                                {
                                    price: item?.price??0,
                                    quantity: item?.quantity??0,
                                    productId: item?.productId??""
                                }
                            ]
    
                        }
                    ))
                }
                
                return updateCheckout
            })
        }       

        setCheckout((prevCheckout: any) => {
            const updateCheckout = {
                ...prevCheckout,
                shop_order_ids: prevCheckout.shop_order_ids.map((order:any) =>
                    order.item_products[0].productId === productId? {...order,shop_discount: [newDiscount]}:{...order})
                }
            //save into sesstionStotage
            sessionStorage.setItem(`reviewCheckout_${cartUserId}`,JSON.stringify(updateCheckout))
            return updateCheckout
        })
    }

    const removeDiscountFromProduct = async(productId: string) => {
        setCheckout((prevCheckout:any) => {

            const updateCheckout = {
                ...prevCheckout,
                shop_order_ids: prevCheckout.shop_order_ids.map((order:any) =>
                    order.item_products[0].productId === productId? {...order,shop_discount: []}:{...order})
            }
            //save into sesstionStotage
            sessionStorage.setItem(`reviewCheckout_${cartUserId}`, JSON.stringify(updateCheckout))            
            return updateCheckout
        })
    }
    
    if(cart[0]){
        return (
            <section>
                <div className="w-[1200px] mx-auto my-0 mt-[3rem] pb-50">
                    <h1 className="font-bold text-xl mb-[1.2rem]">Cart</h1>
                    <div className="flex flex-row justify-between gap-5">
                        <div className="cart-products border-1 border-[#9b9b9b] w-2/3 h-full">
                            <div className="grid grid-cols-12 text-center text-[#696969] text-sm font-bold  py-2">
                                <h3 className="col-span-1"></h3>
                                <h3 className="col-span-6">Product</h3>
                                <h3 className="col-span-1">Price</h3>
                                <h3 className="col-span-2">Quantity</h3>
                                <h3 className="col-span-2">Subtotal</h3>
                            </div>
                            {cart?.map((product,i) => {
                                return(
                                    <div key={i}>
                                        <div className="flex flex-row content-center grid-cols-12 items-center gap-2 border-t border-[#9b9b9b] p-4 w-full">
                                            <button  className='text-[#d2dcdf] text-base place-self-end col-span-1 
                                            cursor-pointer  px-1  border
                                            rounded-full bg-white hover:opacity-80 self-center' onClick={() => handleDeleteItem(product?.productId??"")}>X</button>
                                            <Image src={`${product?.imgThumb}`} className="col-span-1" alt="imageProduct" width={100} height={50}/>
                                            <a href={`http://localhost:3000/products/${product?.productId}/${product?.slug}`} className="col-span-4 w-[300px] text-sm text-[#0573f0]">{product?.name}</a>
                                            <p className="col-span-2 text-[#696969]">${product?.price}.00</p>
                                            <div className="col-span-2 ml-5">
                                                <HandleCart cartTab={true}  productQuantityCartTab={product?.quantity} productIdCartTab = {product?.productId} shopIdCartTab = {product?.shopId} onHandleChangePrice={(newQuantity:number) => {
                                                                handleChangePrice(newQuantity, product?.productId)
                                                            }}/>
                                            </div>
                                            <div className="col-span-2 ml-12 text-[#696969]">
                                                ${(product?.price?? 0) * (product?.quantity??1)}.00
                                            </div>
                                        </div>

                                        <div className="voucher-container w-full px-5 py-2 text-white flex flex-row justify-between cursor-pointer
                                         border-t border-[#9b9b9b] bg-[#d15454] hover:bg-[#b34747] transition-colors duration-500 " onClick={() => getDiscountsOfProduct(product?.productId??"")}>
                                            <div>
                                                <FontAwesomeIcon className="text-white pr-5" icon={faTicket} />
                                                <span className="font-bold">Voucher's product</span>
                                            </div>
                                            
                                            <span><FontAwesomeIcon icon={faCaretDown} /></span>
                                            
                                        </div>
                                        <div className={` relative `}>
                                            <ListDiscountsOfProduct discounts={discounts} productId={product?.productId} activeItem={activeItem} toggleDown={toggleDown} addDiscountToProduct={addDiscountToProduct}
                                             removeDiscountFromProduct={removeDiscountFromProduct} userId ={id} quantity={product?.quantity} price={product?.price}/>
                                        </div>
                                    </div>
                                                                   
                                )
                            })}
                        </div>
                        <div className="cart-totals border-1 border-[#9b9b9b] h-full w-1/3">
                            <h2 className="p-2 text-sm font-bold border-b border-[#9b9b9b]">Cart totals</h2>
                            <div className="flex flex-col gap-5 p-5">
                                <div className="flex flex-row justify-between border-b border-[#9b9b9b] text-sm text-[#696969]">
                                    <p>Subtotal</p>
                                    <span>$ {checkoutData?.checkout_order.totalPrice}</span>
                                </div>
                                <div className="flex flex-row justify-between border-b border-[#9b9b9b] text-sm text-[#696969]">
                                    <p>Discount</p>
                                    <span>$ {`${checkoutData?.checkout_order.totalDiscount? `-${checkoutData?.checkout_order.totalDiscount}`: 0}`}</span>
                                </div>
                                <div className="flex flex-row justify-between border-b border-[#9b9b9b] text-sm text-[#696969]">
                                    <p>Total</p>
                                    <span>$ {checkoutData?.checkout_order.totalCheckout}</span>
                                </div>
                                <a href="/cart/checkout" >
                                    <button className="p-5 w-full bg-black text-white hover:bg-[#0573f0] transition-colors duration-500 cursor-pointer">Proceed to checkout</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>    
            </section>
        );
    }
    return(
        <div className="mt-20">
            <NotFoundProducts />
        </div>
    )
    
}
