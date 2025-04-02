import api from "@/app/protected/protected";
import Cookies from "js-cookie";





export async function getCartById(){
    const userId = Cookies.get(`_id`)
    const guestId = Cookies.get('guestId')
    const cartUserId = Cookies.get(`guestId_${userId}`)
    try {
        const res = await api.get(`/cart/?userId=${cartUserId??`${guestId}`}`)      
        return res.data
    } catch (error) {
        console.log(error);
        
    }   
}