'use client'

import { useState } from "react";
import { addToCart } from "@/features/cart/actions/addToCart";
import Cookies from "js-cookie";
import { updateQuantityCart } from "@/features/cart/actions/updateQuantityCart";
import { getCartById } from "@/features/cart/data/data";
import { useToast } from "@/app/context/ToastContext";
import { useModal } from "@/app/context/ModalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";

interface HandleCartProps {
    name: string;
    productId: string;
    shopId: string;
    price: number;
    imgThumb: string;
    cartTab: boolean;
    productQuantityCartTab: number;
    productIdCartTab: string;
    shopIdCartTab: string;
    slug: string;
    onHandleChangePrice: (newQuantity: number) => void
}
type PartialProps = Partial<HandleCartProps>

interface ProductOfCart {
    productId: string,
    shopId: string,
    quantity: number,
    imgThumb: string,
    name: string,
    price: number,
    slug: string
}

const HandleCart = (props: PartialProps) => {
    const {name, productId, shopId, price, imgThumb, cartTab, productQuantityCartTab, productIdCartTab, shopIdCartTab, onHandleChangePrice, slug} = props;

    const [quantity, setQuantity] = useState(1);
    const [quantityCartTab, setQuantityCartTab] = useState<number|undefined>(productQuantityCartTab);
    const [isAdding, setIsAdding] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { toast } = useToast();
    const { openCartModal } = useModal();
    
    const inscreaseQuantity = () => {
        setQuantity((prev) => prev + 1 );
    };

    const decreaseQuantity = () => {
        if(quantity > 1) setQuantity((prev) => prev - 1);
    };

    const getProductOfCart = async() => {
        const res = await getCartById();
        const result = res.metadata.cart_products.filter((item : ProductOfCart) => item.productId === `${cartTab? productIdCartTab : productId}`);
        return result;
    };

    const handleAddToCart = async () => {
        if (isAdding) return;
        setIsAdding(true);
        const tempId = Cookies.get(`tempId`);
        const id: string | undefined = Cookies.get('_id');
        const cartUserId: string | undefined = Cookies.get(`cartId_${id}`);
        
        try {
            const res = await addToCart({
                userId: cartUserId ? cartUserId : tempId ?? "",
                product: {
                    name: name ?? "",
                    price: price ?? 1,
                    productId: productId ?? "",
                    quantity: quantity ?? 1,
                    shopId: shopId ?? "",
                    imgThumb: imgThumb ?? "",
                    slug: slug ?? ""
                }
            });

            if (res?.metadata?.cart_products) {
                localStorage.setItem('cartQuantity', res.metadata.cart_products.length);
            }
            window.dispatchEvent(new Event('cartQuantityStorage'));
            
            setIsAdding(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 1600);

            // Trigger modern Toast feedback
            toast.success({
                title: "Added to cart!",
                message: `Successfully added ${quantity} item(s) to cart.`,
                product: {
                    name: name ?? "Product",
                    price: price ?? 0,
                    thumb: imgThumb ?? "",
                    quantity: quantity
                },
                actionLabel: "View Cart",
                onAction: () => openCartModal()
            });

            return res;
        } catch (error) {
            console.error("Error adding to cart:", error);
            setIsAdding(false);
            toast.error({
                title: "Could not add to cart",
                message: "Please try again shortly!"
            });
        }
    };

    const handleUpdateCart = async(newQuantity:number) => {
        const guestId: string | undefined = Cookies.get(`guestId`);
        if (!guestId){
            throw new Error('guestId is undefined');
        }
        const id: string | undefined = Cookies.get('_id');
        const cartUserId: string | undefined = Cookies.get(`cartId_${id}`);
        const tempId: string | undefined = Cookies.get('tempId');

        const product = await getProductOfCart();
       
        await updateQuantityCart({
            userId: cartUserId ?? tempId ?? 'defaultId',
            shop_order_ids:[{
                shopId: shopIdCartTab ?? "",
                item_products:[{
                    quantity: cartTab ? newQuantity : quantity,
                    old_quantity: product[0]?.quantity ?? 1,
                    productId: cartTab ? productIdCartTab ?? "" : productId ?? ""
                }] 
            }]
        });
    };

    const handleClickDecrease = async() => {
        if(!cartTab){
            decreaseQuantity();
        }
        
        if((quantityCartTab ?? 0) > 1) {
            setQuantityCartTab((prev:number|undefined) => (prev ?? 1) - 1);
            const newQuantity = (quantityCartTab ?? 1) - 1;
            if(cartTab){
                onHandleChangePrice?.(newQuantity);
            }
            await handleUpdateCart(newQuantity);
        }
    };

    const handleClickIncrease = async() => {
        if(!cartTab){
            inscreaseQuantity();
        }
        setQuantityCartTab((prev: number|undefined) => (prev ?? 1) + 1);
        const newQuantity = (quantityCartTab ?? 1) + 1;
        if(cartTab){
            onHandleChangePrice?.(newQuantity);
        }
        await handleUpdateCart(newQuantity);
    };

    return (
       <div className={`flex items-center gap-2.5 sm:gap-3 ${!cartTab ? "w-full sm:w-auto" : ""}`}>
            <div className="inline-flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs shrink-0">
                <button
                    onClick={handleClickDecrease}
                    aria-label="Decrease quantity"
                    className="w-8 sm:w-9 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200/80 font-bold transition-colors cursor-pointer text-base"
                >
                    -
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-800 select-none">
                    {cartTab ? quantityCartTab : quantity}
                </span>
                <button
                    onClick={handleClickIncrease}
                    aria-label="Increase quantity"
                    className="w-8 sm:w-9 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200/80 font-bold transition-colors cursor-pointer text-base"
                >
                    +
                </button>
            </div>

            {/* addToCartBtn */}
            {!cartTab && (
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`inline-flex items-center justify-center gap-2 flex-1 sm:flex-initial px-6 py-2.5 h-10 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 text-center ${
                        isSuccess
                            ? "bg-emerald-600 text-white"
                            : isAdding
                            ? "bg-blue-500 text-white"
                            : "bg-[#0573f0] hover:bg-[#0769da] text-white"
                    }`}
                >
                    {isAdding ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} spin className="text-xs" />
                            <span>Adding...</span>
                        </>
                    ) : isSuccess ? (
                        <>
                            <FontAwesomeIcon icon={faCheck} className="text-xs" />
                            <span>Added!</span>
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faCartShopping} className="text-xs" />
                            <span>Add to cart</span>
                        </>
                    )}
                </button>
            )}
       </div>
    );
};

export default HandleCart;