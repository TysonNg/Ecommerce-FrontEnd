'use client'
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import {v4 as uuidv4} from 'uuid'

export function InitGuestId() {
    useEffect(() => {
        const createGuestId = async() => {
            let guestId =  Cookies.get(`guestId`);
            console.log('guestId', guestId);
            
            if(!guestId){
                guestId = uuidv4();
                Cookies.set('guestId', guestId, {expires: 7*24*60*60}); //save in 7 days
            }else{
                console.log('existed ', guestId);   
            }
            return guestId
        }
        createGuestId()
        
    },[])

    return null
}

