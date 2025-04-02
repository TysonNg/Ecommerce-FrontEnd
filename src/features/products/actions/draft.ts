import api from "@/app/protected/protected"


//get All Drafts
export const getAllDraft = async() => {
    try {
        const res = await api.get('/product/drafts/all')
        console.log(res.data);
        
       return res.data.metadata
        
    } catch (error) {
        console.log(error)

    }
}

export const publishProduct = async(productId: string) => {
    try {
        const res = await api.post(`/product/publish/${productId}`)
        console.log(res.data)
        return res.data.metadata
        
    } catch (error) {
        console.log(error)
        
    }
}