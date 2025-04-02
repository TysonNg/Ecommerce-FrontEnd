import api from "@/app/protected/protected";

interface CancelDiscount {
    codeId: string;
    userId: string;
    shopId: string;
 }


export async function cancelDiscount(payload:CancelDiscount) {
    try {                
        const res = await api.post('/discount/cancel',payload)
        if(!res.data) throw new Error('Fail to fetch cancelDiscount')
        console.log('cancelDiscount', res.data);
        return res.data
    } catch (error) {
        console.log('Fail to fetch cancelDiscount', error);
        
    }
}