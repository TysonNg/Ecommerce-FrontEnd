'use client'

import { useState, useEffect  } from "react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { getAllDraft } from "@/features/products/actions/draft";
import { getAllPublish } from "@/features/products/actions/publish";
import Cookies from "js-cookie";
import NotFound from "@/app/not-found";
import { getMyShop, type Shop } from "@/features/shop/actions/shop";
import { getShopAccess } from "@/features/shop/utils/shop-access";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBoxArchive, faCircleCheck } from "@fortawesome/free-solid-svg-icons";




export default function Layout({children}: {children: React.ReactNode}) {
    const [id, setId] = useState<string | null>()

    const [activeItem, setActiveItem] = useState<string>('')
    const [draftItems, setDraftItems] = useState<number>()
    const [publishItems, setPublishItems] = useState<number>()
    const [shop, setShop] = useState<Shop | null | undefined>(undefined)
    const [shopError, setShopError] = useState(false)

    const router = useRouter()
    const pathname = usePathname()
    const handleItemClick = (item: string) =>{
        setActiveItem(item)
        router.push(`/user/shop/${item}`)
    }

    const getItemClass = (item: string | undefined) => {
        return (activeItem === item? "border-y border-[#d3d3d3]" :"")
    }

    useEffect(() => {
        setId(Cookies.get('_id') || null)
    }, [])
  
    useEffect(() => {
        if(id) {
            let cancelled = false
            const fetchShop = async() => {
                try {
                    setShopError(false)
                    const currentShop = await getMyShop()
                    if (!cancelled) setShop(currentShop)
                } catch {
                    if (!cancelled) setShopError(true)
                }
            }
            void fetchShop()
            window.addEventListener('shop-status-updated', fetchShop)
            return () => {
                cancelled = true
                window.removeEventListener('shop-status-updated', fetchShop)
            }
        }
    }, [id])

    useEffect(() => {
        if (id && shop?.status === 'active') {
            let cancelled = false
            const fetchDraftItems = async() => {
                const res = await getAllDraft()
                if (!cancelled) setDraftItems(res?.length || 0)
            }
            const fetchPublishItems = async() => {
                const res = await getAllPublish()
                if (!cancelled) setPublishItems(res?.length || 0)
            }

            fetchDraftItems()
            fetchPublishItems()
            
            const handleEvent = () => {
                fetchDraftItems();
                fetchPublishItems();
            }
            
            window.addEventListener('ChangeQuantityDraftAndPublish',handleEvent)
            return () => {
                cancelled = true
                window.removeEventListener('ChangeQuantityDraftAndPublish', handleEvent)
            }
        }
        
    }, [id, shop?.status])

    useEffect(() => {
        if (!id || shop === undefined || shopError) return
        const access = getShopAccess(shop)
        if (!access.canManage && pathname !== access.route) router.replace(access.route)
        if (access.canManage && pathname === '/user/shop/register') router.replace(access.route)
    }, [id, pathname, router, shop, shopError])

    if (id === undefined) {
        return <section className="mx-auto max-w-xl py-16 text-center text-sm text-[#7f7d7d]">Loading shop...</section>
    }
   
    if(!id){
        return(
            <NotFound />
        )
    }

    if (shop === undefined && !shopError) {
        return <section className="mx-auto max-w-xl py-16 text-center text-sm text-[#7f7d7d]">Loading shop...</section>
    }

    if (shopError) {
        return <section className="mx-auto max-w-xl py-16 text-center text-sm text-[#dd3b3b]">Unable to load your shop status. Please refresh and try again.</section>
    }

    if (!shop) return pathname === '/user/shop/register' ? <>{children}</> :
        <section className="mx-auto max-w-xl py-16 text-center text-sm text-[#7f7d7d]">Loading shop...</section>

    if (shop.status !== 'active') {
        const isRejected = shop.status === 'rejected'
        return (
            <section className="mx-auto mt-10 max-w-xl border border-[#d3d3d3] bg-white p-6 text-[#333] sm:p-8">
                <p className={`text-xs font-bold uppercase tracking-[0.2em] ${isRejected ? 'text-[#dd3b3b]' : 'text-[#0573f0]'}`}>Seller account</p>
                <h1 className="mt-2 text-2xl font-bold">{isRejected ? 'Shop application was not approved' : 'Shop application is pending'}</h1>
                <p className="mt-3 text-sm leading-6 text-[#7f7d7d]">
                    {isRejected ? 'Your shop cannot manage products at this time. Please contact an administrator for the next steps.' : 'An administrator is reviewing your shop. Product and discount management will be available after approval.'}
                </p>
                {isRejected && shop.rejectionReason && <p className="mt-4 whitespace-pre-wrap break-words border-t border-[#dce3e5] pt-4 text-sm"><strong>Reason for rejection</strong><br />{shop.rejectionReason}</p>}
            </section>
        )
    }

    const currentTab = pathname.includes('/user/shop/draft')
        ? 'draft'
        : pathname.includes('/user/shop/publish')
        ? 'publish'
        : pathname.includes('/user/shop/product')
        ? 'product'
        : 'product';

    return (
        <section className="min-h-screen bg-slate-50/50 pb-20">
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Mobile / Tablet Horizontal Navigation Tabs (< 1024px) */}
                <div className="lg:hidden mb-6 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                        <button
                            onClick={() => handleItemClick("product")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                                currentTab === "product"
                                    ? "bg-[#0573f0] text-white shadow-xs"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                            <span>Create Product</span>
                        </button>

                        <button
                            onClick={() => handleItemClick("draft")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                                currentTab === "draft"
                                    ? "bg-[#0573f0] text-white shadow-xs"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                            <FontAwesomeIcon icon={faBoxArchive} className="text-xs" />
                            <span>Drafts</span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                currentTab === "draft" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                            }`}>
                                {draftItems ?? 0}
                            </span>
                        </button>

                        <button
                            onClick={() => handleItemClick("publish")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                                currentTab === "publish"
                                    ? "bg-[#0573f0] text-white shadow-xs"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                            <FontAwesomeIcon icon={faCircleCheck} className="text-xs" />
                            <span>Published</span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                currentTab === "publish" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                            }`}>
                                {publishItems ?? 0}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
                    {/* Desktop Sidebar (>= 1024px) */}
                    <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 sticky top-[148px] pr-6 border-r border-slate-200">
                        <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Shop Catalog</p>
                        </div>
                        <nav className="flex flex-col gap-1.5 text-sm">
                            <button
                                onClick={() => handleItemClick("product")}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                                    currentTab === "product"
                                        ? "bg-blue-50 text-[#0573f0] font-bold shadow-2xs border border-blue-100"
                                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                    <span>Create Product</span>
                                </div>
                            </button>

                            <button
                                onClick={() => handleItemClick("draft")}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                                    currentTab === "draft"
                                        ? "bg-blue-50 text-[#0573f0] font-bold shadow-2xs border border-blue-100"
                                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <FontAwesomeIcon icon={faBoxArchive} className="text-xs" />
                                    <span>Drafts</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                    currentTab === "draft" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
                                }`}>
                                    {draftItems ?? 0}
                                </span>
                            </button>

                            <button
                                onClick={() => handleItemClick("publish")}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                                    currentTab === "publish"
                                        ? "bg-blue-50 text-[#0573f0] font-bold shadow-2xs border border-blue-100"
                                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <FontAwesomeIcon icon={faCircleCheck} className="text-xs" />
                                    <span>Published</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                    currentTab === "publish" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
                                }`}>
                                    {publishItems ?? 0}
                                </span>
                            </button>
                        </nav>
                    </aside>

                    {/* Content Body */}
                    <div className="w-full lg:col-span-9 xl:col-span-10">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
