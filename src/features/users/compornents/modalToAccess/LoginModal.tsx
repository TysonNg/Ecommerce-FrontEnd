'use client'
import React, { useState } from 'react'
import { useModal } from '@/app/context/ModalContext'
import { useToast } from '@/app/context/ToastContext'
import { logIn, signUp } from '@/features/users/actions/access'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faCheck, faEnvelope, faLock, faSpinner, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'

const LoginModal = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const { isModalOpen, closeModal } = useModal()
    const { toast } = useToast()
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    if (!isModalOpen) return null

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) closeModal()
    }

    const registerForm = () => {
        setIsLogin(false)
    }

    const loginForm = () => {
        setIsLogin(true)
    }

    const handleQuickDemoFill = async () => {
        const demoEmail = 'demo@ecommerce.com'
        const demoPass = 'demo123456'
        setEmail(demoEmail)
        setPassword(demoPass)
        setIsLoading(true)
        try {
            const fetchLogin = await logIn({ email: demoEmail, password: demoPass })
            if (!fetchLogin || fetchLogin.status !== 200) {
                toast.error({
                    title: 'Demo Login Error',
                    message: 'Could not log in with demo account. Please try again.',
                })
            } else {
                toast.success({
                    title: 'Demo Login Successful!',
                    message: 'Welcome, Demo Customer (User + Seller permissions)',
                })
                if (typeof window !== 'undefined') {
                    localStorage.setItem('isActive', 'true')
                    localStorage.setItem('name', fetchLogin.metadata.user.name)
                    window.dispatchEvent(new Event('user-auth-change'))
                    setTimeout(() => {
                        closeModal()
                        location.reload()
                    }, 600)
                }
            }
        } catch (error) {
            console.error('Demo login error:', error)
            toast.error({
                title: 'Login Error',
                message: 'Connection failed. Please check backend server.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmitLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim() || !password.trim()) {
            toast.error({
                title: 'Missing Credentials',
                message: 'Please enter your email and password.',
            })
            return
        }

        setIsLoading(true)
        try {
            const fetchLogin = await logIn({ email, password })

            if (!fetchLogin || fetchLogin.status !== 200) {
                toast.error({
                    title: 'Login Failed',
                    message: 'Please check your email and password.',
                })
            } else {
                toast.success({
                    title: 'Login Successful!',
                    message: `Welcome back, ${fetchLogin.metadata.user.name}!`,
                })
                if (typeof window !== 'undefined') {
                    localStorage.setItem('isActive', 'true')
                    localStorage.setItem('name', fetchLogin.metadata.user.name)
                    window.dispatchEvent(new Event('user-auth-change'))
                    setTimeout(() => {
                        closeModal()
                        location.reload()
                    }, 600)
                }
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error({
                title: 'Error',
                message: 'An unexpected error occurred during login.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmitSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !email.trim() || !password.trim()) {
            toast.error({
                title: 'Incomplete Form',
                message: 'Please fill in all required fields.',
            })
            return
        }

        setIsLoading(true)
        try {
            const fetchSignUp = await signUp({ name, email, password })
            if (
                fetchSignUp.message === 'Error: Shop already registered' ||
                fetchSignUp.message === 'Error::keyStore error' ||
                fetchSignUp.message === 'Error: Email not valid'
            ) {
                toast.error({
                    title: 'Sign Up Failed',
                    message: fetchSignUp.message,
                })
            } else {
                toast.success({
                    title: 'Account Created!',
                    message: `Welcome to E-Shop, ${fetchSignUp.metadata.user.name}!`,
                })
                localStorage.setItem('isActive', 'true')
                localStorage.setItem('name', fetchSignUp.metadata.user.name)
                window.dispatchEvent(new Event('user-auth-change'))
                setTimeout(() => {
                    closeModal()
                    location.reload()
                }, 600)
            }
        } catch (error) {
            console.error('Signup error:', error)
            toast.error({
                title: 'Error',
                message: 'Could not create account. Please try again.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs z-[1000] p-4 animate-in fade-in duration-200"
            onClick={handleOverlayClick}
        >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-10"
                    aria-label="Close modal"
                >
                    <FontAwesomeIcon icon={faXmark} className="text-sm" />
                </button>

                {/* Header Tabs */}
                <div className="flex border-b border-slate-100 bg-slate-50/50 pt-3 px-4 gap-2">
                    <button
                        type="button"
                        onClick={loginForm}
                        className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 cursor-pointer ${
                            isLogin
                                ? 'border-[#0573f0] text-[#0573f0]'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={registerForm}
                        className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 cursor-pointer ${
                            !isLogin
                                ? 'border-[#0573f0] text-[#0573f0]'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Create Account
                    </button>
                </div>

                <div className="p-6 sm:p-8">
                    {/* Quick Demo Button */}
                    <div className="mb-5">
                        <button
                            type="button"
                            onClick={handleQuickDemoFill}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-300 font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faBolt} className="text-amber-500 animate-pulse text-sm" />
                            <span>Quick Demo: Đăng nhập 1-Click (Tài khoản mẫu)</span>
                        </button>
                        <p className="text-[11px] text-center text-slate-400 mt-1.5">
                            Email: <code className="text-slate-600 font-mono">demo@ecommerce.com</code> | Pass: <code className="text-slate-600 font-mono">demo123456</code>
                        </p>
                    </div>

                    <div className="relative flex py-2 items-center mb-4">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink mx-3 text-slate-400 text-xs uppercase tracking-wider font-semibold">Hoặc tự nhập</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* LOGIN FORM */}
                    {isLogin ? (
                        <form onSubmit={handleSubmitLogin} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                    <input
                                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0573f0] focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder:text-slate-400"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
                                        <FontAwesomeIcon icon={faLock} />
                                    </span>
                                    <input
                                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0573f0] focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder:text-slate-400"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-[#0573f0] hover:bg-[#0461cc] shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>

                            <div className="text-center mt-2">
                                <p className="text-xs text-slate-500">
                                    Don&apos;t have an account?{' '}
                                    <button
                                        type="button"
                                        className="text-[#0573f0] font-bold hover:underline cursor-pointer"
                                        onClick={registerForm}
                                    >
                                        Register here
                                    </button>
                                </p>
                            </div>
                        </form>
                    ) : (
                        /* REGISTER FORM */
                        <form onSubmit={handleSubmitSignUp} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                    <input
                                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0573f0] focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder:text-slate-400"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                    <input
                                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0573f0] focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder:text-slate-400"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
                                        <FontAwesomeIcon icon={faLock} />
                                    </span>
                                    <input
                                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0573f0] focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder:text-slate-400"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-[#0573f0] hover:bg-[#0461cc] shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <span>Create Account</span>
                                )}
                            </button>

                            <div className="text-center mt-2">
                                <p className="text-xs text-slate-500">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        className="text-[#0573f0] font-bold hover:underline cursor-pointer"
                                        onClick={loginForm}
                                    >
                                        Sign in here
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LoginModal