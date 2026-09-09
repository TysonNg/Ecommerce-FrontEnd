'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getMyShop } from '@/features/shop/actions/shop'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function ShopIndexPage() {
    const router = useRouter()

    useEffect(() => {
        let isMounted = true
        const checkShopAndRedirect = async () => {
            try {
                const shop = await getMyShop()
                if (!isMounted) return
                if (shop && shop.status === 'active') {
                    router.replace('/user/shop/product')
                } else {
                    router.replace('/user/shop/register')
                }
            } catch (error) {
                if (isMounted) {
                    router.replace('/user/shop/register')
                }
            }
        }

        checkShopAndRedirect()
        return () => {
            isMounted = false
        }
    }, [router])

    return (
        <div className="w-full min-h-[350px] flex flex-col items-center justify-center gap-3 text-slate-500">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-[#0573f0]" />
            <p className="text-sm font-medium">Navigating to Shop Management...</p>
        </div>
    )
}
