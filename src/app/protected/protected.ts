
import axios from 'axios'
import Cookies from 'js-cookie'

import dotenv from 'dotenv'
dotenv.config()


const id = Cookies.get('_id')

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    timeout: 10000,
    headers: {
        'Content-Type' : 'application/json',
        'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
        'x-client-id': id
    }
})

api.interceptors.request.use((config) => {
    const accessToken = Cookies.get('accessToken')
    if(accessToken) {
        config.headers.authorization = `${accessToken}`     
    }
    return config
},(err) => {
    return Promise.reject(err)
})

api.interceptors.response.use((res) => {
    return res   
}, async(err) => {
    alert(err.response.data.message)
    console.log(err.response.data.message);
    const originalRequest = err.config
    
    if(err.response.status=== 500 && !originalRequest._retry){
        originalRequest._retry= true
        
        const refreshToken = Cookies.get('refreshToken')
        if(!refreshToken) return Promise.reject(err)
        
        try {
            //Token expired => refresh token
            const res = await api.post('/user/handleRefreshToken',{refreshToken})

            //save new Token into cookies
            const newAccessToken = res.data.metadata.tokens.accessToken 
            const newRefreshToken = res.data.metadata.tokens.refreshToken
            Cookies.set('accessToken', newAccessToken)
            Cookies.set('refreshToken',newRefreshToken)

            originalRequest.headers.authorization = `${newAccessToken}`

            return api(originalRequest)
            
        } catch (error) {
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')

            return Promise.reject(error)
        }
    }
    
    
})

export default api