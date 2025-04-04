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
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";


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
            shop_discount: CodeDiscount[];
            item_products:{
                    price: number;
                    quantity: number;
                    productId: string
                }[]            
    }[]
}

interface ShopOrder{
    shopId: string;
    shop_discount: CodeDiscount[];
    item_products:
        {
            price: number;
            quantity: number;
            productId: string
        }[]
    
}

interface Product{
    price: number;
    quantity: number;
    productId: string;
    
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
    shopId: string;
    userId: string
}

interface RemoveDiscountParams {
    productId: string; 
    codeId: string;    
    userId: string;    
    shopId: string;   
}

export default function CartPage() {

    const guestId: string| undefined = Cookies.get('guestId')
    const id: string | undefined = Cookies.get('_id')
    const refreshToken: string|undefined = Cookies.get('refreshToken')
    const cartUserId : string|undefined = Cookies.get(`cartId_${id}`)
    const tempId : string|undefined = Cookies.get('tempId')

    const [cart, setCart] = useState<Array<ProductsCart>>([])
    const [checkoutData, setCheckoutData] = useState<Checkout>()
    const [discounts,setDiscounts] = useState<DiscountsShop[]>()
    const [activeItem, setActiveItem] = useState<string>('')
    const [toggleDown, setTogleDown] = useState<boolean>(false)
    const [checkout, setCheckout] = useState<CheckoutRequest>({
        userId: id??guestId??"",
        cartId: cartUserId??tempId??"",
        shop_order_ids: []
    })
    const [codeIdState, setCodeIdState] = useState<CodeDiscount>()

    
    //get Cart
    useEffect(() => {
        const fetchCart = async() => {
            try {
                const res = await getCartById()
                console.log('cart', res);
                
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
     
        if (cart.length > 0) {
            setCheckout(prev => {
              const updatedShopOrders = cart.map(item => {
                const prevShop = prev.shop_order_ids.find(shop => shop.shopId === item.shopId)
        
                return {
                  shopId: item.shopId ?? "",
                  shop_discount: prevShop?.shop_discount ?? [],
                  item_products: [
                    {
                      price: item.price ?? 0,
                      quantity: item.quantity ?? 0,
                      productId: item.productId ?? ""
                    }
                  ]
                };
              });
        
              return {
                userId: id??guestId?? "",
                cartId: cartUserId??tempId??"",
                shop_order_ids: updatedShopOrders
              };
            });
          }
    },[cart])
    
    useEffect(() => {
        const fetchCheckout = async () => {
            try {
            if(cart.length>0){
                if(checkout.shop_order_ids.length > 0) {
                    const res = await checkoutReview(checkout?.shop_order_ids.length > 0? checkout : {
                        userId: id ?? `${guestId}`,
                        cartId: cartUserId ? cartUserId : tempId??"",
                        shop_order_ids: cart.map(item => ({
                            shopId: item?.shopId ?? "",
                            shop_discount: [],
                            item_products: [
                                {
                                    price: item?.price ?? 0,
                                    quantity: item?.quantity ?? 0,
                                    productId: item?.productId ?? "",
                                }
                            ]
                        }))
                    });
    
                    if (res.metadata) {
                        sessionStorage.setItem(`reviewCheckout_${cartUserId}`, JSON.stringify(res.metadata));
                    }
                    console.log('checkoutData', checkout);
                    
                    setCheckoutData(res.metadata)                
                    return res.metadata

                }
            }
               
                
            } catch (error) {
                console.log('checkoutErr', error);
            }
        };
        fetchCheckout();
    },[checkout,cart])

    //when changing price => update quantity
    const handleChangePrice = (newQuantity:number, productId: string) =>{

        setCart((prevCart) : ProductsCart[] => {
        
        
        const updatedCart = prevCart.map((item) => item?.productId === productId? {...item, quantity: newQuantity} : {...item})
        
        return updatedCart
        })


        setCheckout((prevCheckout : CheckoutRequest)  => {
            console.log('prevCheck',prevCheckout);
            
            const updateCheckout = {
                ...prevCheckout,
                shop_order_ids: prevCheckout.shop_order_ids.map((order : ShopOrder) => ({
                    ...order,
                    item_products: order.item_products.map((product ) : Product => (
                        product.productId === productId? {...product, quantity: newQuantity} : product
                    )),
                    shop_discount: order.shop_discount                    
                }))
            }
            console.log('updatecheckout', updateCheckout);
            
            return updateCheckout
            }
        )        
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
        console.log('idProduct', productId);
        
        if(!id && !refreshToken){
            alert("Pls Login to use Discount!!!")
            return;
        }
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
            await cancelDiscount({codeId: (codeIdState?.codeId??""), userId: ((id??"")), shopId: (codeIdState?.shopId??"")})
        }

        setCodeIdState({
            codeId,
            shopId,
            userId: newDiscount.userId
        })

        if(!checkout?.shop_order_ids[0])
        {
            setCheckout((prevCheckout:CheckoutRequest) => {
                const updateCheckout = {
                    ...prevCheckout,
                    shop_order_ids: cart?.map((item) : ShopOrder => (
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

        setCheckout((prevCheckout : CheckoutRequest) => {
            const updateCheckout: CheckoutRequest = {
                ...prevCheckout,
                shop_order_ids: prevCheckout.shop_order_ids.map((order : ShopOrder) => (
                    order.item_products[0].productId === productId?{...order, shop_discount: [newDiscount]} : {...order}

                ))
            };

            //save into sesstionStotage
            sessionStorage.setItem(`reviewCheckout_${cartUserId}`,JSON.stringify(updateCheckout))
            return updateCheckout
        })
    }

    const removeDiscountFromProduct = async({productId, codeId, shopId} : RemoveDiscountParams) => {
        await cancelDiscount({codeId, userId: id??"" , shopId })
        
        setCheckout((prevCheckout: CheckoutRequest) => {
            const updateCheckout = {
                ...prevCheckout,
                shop_order_ids: prevCheckout.shop_order_ids.map((order:ShopOrder) =>
                    order.item_products[0].productId === productId? {...order,shop_discount: []}:{...order})
            }
            //save into sesstionStotage
            sessionStorage.setItem(`reviewCheckout_${cartUserId}`, JSON.stringify(updateCheckout))            
            return updateCheckout
        })
    }
    
    
    if(cart.length > 0){
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
                                                <HandleCart cartTab={true}  productQuantityCartTab={product?.quantity??1} productIdCartTab = {product?.productId} shopIdCartTab = {product?.shopId} onHandleChangePrice={(newQuantity:number) => {
                                                            handleChangePrice(newQuantity, product?.productId??"")
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
                                                <span className="font-bold">Voucher of product</span>
                                            </div>
                                            
                                            <span><FontAwesomeIcon icon={faCaretDown} /></span>
                                            
                                        </div>
                                        <div className={` relative `}>
                                            <ListDiscountsOfProduct discounts={discounts??[]} productId={product?.productId} activeItem={activeItem} toggleDown={toggleDown} addDiscountToProduct={addDiscountToProduct}
                                             removeDiscountFromProduct={removeDiscountFromProduct} userId ={id??""} quantity={product?.quantity??1} price={product?.price??1}/>
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
