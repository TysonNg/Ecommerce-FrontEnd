import api from "@/app/protected/protected";





export async function getAllDiscountOfProduct(productId: string){
    try {
        
        const res = await api.get(`/discount/codes?productId=${productId}`)        
        return res.data.metadata
    } catch (error) {
        console.log(error);
    }   
}