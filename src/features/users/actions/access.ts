'use-client'
import Cookies from "js-cookie";
import api from "@/app/protected/protected";
import { getCartById } from "@/features/cart/data/data";
import { addToCart } from "@/features/cart/actions/addToCart";

interface LoginType {
    email: string;
    password: string;
}

interface SignUpType  {
    name: string;
    email: string;
    password: string;
}

interface Product{
    productId: string,
     shopId: string,
     quantity: number,
     imgThumb: string,
     name: string,
     price: number,
     slug: string
}
export async function logIn(formLogin:LoginType){
    try {
        const {email, password} = formLogin
        const res = await api.post('/user/login',{
            "email": `${email}`,
            "password": `${password}`
        })

        
        if(!res.data) throw new Error('Pls check email or password again!')
        else{
            const cartUserId: string | undefined = Cookies.get(`cartId_${res.data.metadata.user._id}`)
            const guestId: string | undefined = Cookies.get('guestId')
            
            
            Cookies.set('_id', `${res.data.metadata.user._id}`,{expires:7})
            Cookies.set('accessToken', `${res.data.metadata.tokens.accessToken}`,{expires: 1})
            Cookies.set('refreshToken', `${res.data.metadata.tokens.refreshToken}`,{expires: 7})

            if(!cartUserId){  
                const oldCart  = await getCartById()
                const productsOldCart = oldCart.metadata.cart_products
                console.log('oldCart', productsOldCart);
                Cookies.set(`cartId_${res.data.metadata.user._id}`,`${guestId? `${guestId}cart` :""}`,{expires:365 * 100})
                
                const getCartUserId = Cookies.get(`cartId_${res.data.metadata.user._id}`)

                //add from guestCart to userCart
                await productsOldCart.map((item : Product) => {
                     addToCart({product: item,userId: `${getCartUserId}`})
                })
            }

            if(cartUserId){
                const cart = await getCartById()

                if(cart.metadata === null){
                localStorage.setItem('cartQuantity','0')
                }else{
                    localStorage.setItem('cartQuantity',cart.metadata.cart_products.length)
                    window.dispatchEvent(new Event('cartQuantityStorage'))
                }
            }

            
            return res.data
        }
    } catch (error) {
        console.log('err Login',error)
    }
    
}

export async function signUp(formSigup: SignUpType){
    try {
        const res = await api.post('/user/signup', formSigup)
        if(!res.data) throw new Error('Fail to signUp!')
        
        
        const {metadata} = res.data
        
        
        const cartUserId: string | undefined = Cookies.get(`cartId_${metadata.metadata.user._id}`)
        const guestId: string | undefined = Cookies.get('guestId')

        if(!cartUserId){
            Cookies.set(`cartId_${metadata.metadata.user._id}`,`${guestId?`${guestId}cart`:""}`,{expires:365 * 100})
        }
       
        Cookies.set('_id', `${metadata.metadata.user._id}`,{expires:7})
        Cookies.set('accessToken', `${metadata.metadata.tokens.accessToken}`,{expires: 1})
        Cookies.set('refreshToken', `${metadata.metadata.tokens.refreshToken}`,{expires: 7})

       

        if(cartUserId){
            const cart = await getCartById()
            
            if(cart.metadata === null){
            localStorage.setItem('cartQuantity','0')
            }else{
                localStorage.setItem('cartQuantity',cart.metadata.cart_products.length)
            }

        }

        return metadata
    } catch (error) {
        console.log(error);
        
    }
}

export async function logOut(){

      
    try {
        const res = await api.post('/user/logout')        
        Cookies.remove('_id')
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('guestId')
        Cookies.remove('cartQuantity')
        setTimeout(() => {
            location.reload();
        },1000)
        return res.data
    } catch (error) {
        console.log(error);
        
    }
}
