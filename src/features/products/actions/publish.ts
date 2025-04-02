import api from "@/app/protected/protected"


//get All Drafts
export const getAllPublish = async() => {
    try {
        const res = await api.get('/product/published/all')
        console.log(res.data);
        
       return res.data.metadata
        
    } catch (error) {
        console.log(error)

    }
}

export const unPublish = async(productId: string) => {
    try {
        const res = await api.post(`/product/unPublish/${productId}`)
        console.log(res.data)
        return res.data.metadata
        
    } catch (error) {
        console.log(error)
        
    }
}