'use client'
import React, { useState } from 'react'
import { useModal } from '@/app/context/ModalContext'
import { logIn, signUp } from '@/features/users/actions/access'

const LoginModal = ()=>{

    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name,setName] = useState('')
    const {isModalOpen,closeModal} = useModal()
    const [isLogin, setIsLogin] = useState(true)
    
    if(!isModalOpen) return null

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if(e.target === e.currentTarget) closeModal()
    }

    const registerForm = () => {
        setIsLogin(false)
        
    }

    const loginForm = () => {
        setIsLogin(true)    
    }

    const handleSubmitLogin= async (e:React.FormEvent) => {
        
        e.preventDefault()
        try {
        const fetchLogin = await logIn({email,password})
        console.log('fetchLogin', fetchLogin);
        
        if(!fetchLogin){
            alert("pls check email or password")
        }else{
            alert('Login Successfully!!!')
            if(typeof window !== 'undefined'){
                localStorage.setItem('isActive', "true")
        
                localStorage.setItem("name", fetchLogin.metadata.user.name )
                setTimeout(() => {
                    location.reload();
                },1000)
                   
            }
           
        }
        
            
        } catch (error) {       
            console.log(error);
                 
        }   
    }
    const handleSubmitSignUp = async (e:React.FormEvent) => {
        e.preventDefault()
        try {
            const fetchSignUp = await signUp({name,email,password})
            if(fetchSignUp.message === "Error: Shop already registered" || fetchSignUp.message === "Error::keyStore error" || fetchSignUp.message==="Error: Email not valid"){
                alert(fetchSignUp.message)
            }
            else{
                alert('Register successfully')
                localStorage.setItem('isActive', "true")
                localStorage.setItem("name", fetchSignUp.metadata.user.name)
                setTimeout(() => {
                    location.reload();
                },1000)
            }
        } catch (error) {
            console.log('error',error);
        }
    }
   

    
    

    return(
        <div className='fixed inset-0 flex items-center justify-center bg-opacity-25 z-2 backdrop-blur-sm' onClick={handleOverlayClick}>
            <div className='w-full max-w-[300px] max-h-[250px] sm:max-w-[500px] sm:max-h-[400px] md:max-w-[600px] md:max-h-[500px] flex flex-col relative'>
                <button onClick={closeModal} className='absolute px-2 text-sm text-xl text-white bg-red-700 border rounded-full cursor-pointer -1 place-self-end top-5 right-5 hover:opacity-80'>X</button>
                
                <div className={` bg-[#f3f3f3]  h-screen  max-h-[350px] sm:max-h-[400px]  md:max-h-[500px] p-2 content-center`}>
                    {/* login form */}
                    <div className={`${isLogin? "": 'hidden'} login-container justify-items-center`}>
                        <form onSubmit={(e) => handleSubmitLogin(e)}>
                            <h2 className='pb-10 text-base font-bold text-center sm:text-xl xl:text-2xl 2xl:text-4xl'>LOGIN</h2>
                            <div className='flex flex-col gap-5 login-input w-100'>
                                <input className='p-3 mx-3 text-sm border outline-none sm:mx-0' type="text" placeholder='Email' onChange={(e) =>setEmail(e.target.value)}/>
                                <input className='p-3 mx-3 text-sm border outline-none sm:mx-0' type="password" placeholder='Password' onChange={(e) =>setPassword(e.target.value)} />
                            </div>
                            <div className='w-full justify-self-center max-w-60 sm:max-w-100'>
                                <button className='mt-10 border w-full py-5 cursor-pointer text-white bg-[#4b7af7] hover:opacity-80' type='submit'>Login</button>
                            </div>
                        </form>
                        <div className='mt-5'>
                            <p>Don&apos;t have an account? <span className='text-[#4b7af7] cursor-pointer hover:opacity-80' onClick={registerForm}>Register here</span> </p>
                        </div>

                    </div>

                        {/* register form */}
                    <div className={`${isLogin?"hidden":""} register-container justify-items-center`}>
                        <form onSubmit={handleSubmitSignUp}>
                            <h2 className='pb-10 font-bold text-center sm:text-xl xl:text-2xl 2xl:text-4xl'>Sign Up</h2>
                            <div className='flex flex-col gap-5 login-input w-100'>
                                <input className='p-3 mx-3 text-sm border outline-none sm:mx-0' type="text" placeholder='Name' onChange={(e) =>setName(e.target.value)}/>
                                <input className='p-3 mx-3 text-sm border outline-none sm:mx-0' type="text" placeholder='Email' onChange={(e) =>setEmail(e.target.value)}/>
                                <input className='p-3 mx-3 text-sm border outline-none sm:mx-0' type="password" placeholder='Password' onChange={(e) =>setPassword(e.target.value)}/>
                            </div>
                            <div className='w-full justify-self-center max-w-60 sm:max-w-100'>
                                <button className='mt-10 border w-full py-5 cursor-pointer text-white bg-[#4b7af7] hover:opacity-80' type='submit'>Register</button>
                            </div>
                        </form>
                        <div className='mt-5'>
                            <p>Already have account? <span className='text-[#4b7af7] cursor-pointer hover:opacity-80' onClick={loginForm}>Login here</span> </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginModal