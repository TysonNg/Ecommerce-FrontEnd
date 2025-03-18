'use client'

import {createContext, ReactNode, useContext, useState} from 'react'

type AuthContextType = {
    userId: string;
    authorization: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children} : {children: ReactNode}) {
    const [accessToken, setAccessToken] = useState('')
    
    const auth = () => {
        if(!accessToken) throw new Error("Authorization failed!")
        
    }

}