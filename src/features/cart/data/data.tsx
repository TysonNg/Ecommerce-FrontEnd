import api from "@/app/protected/protected";
import Cookies from "js-cookie";





export async function getCartById(){
    const userId = Cookies.get(`_id`)

    const tempId = Cookies.get('tempId')

    const cartUserId = Cookies.get(`cartId_${userId}`)
    
    
    try {
        const res = await api.get(`/cart/?userId=${cartUserId??`${tempId}`}`)   
           
        return res.data
    } catch (error) {
        console.log(error);
        
    }   
}