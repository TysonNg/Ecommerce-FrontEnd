'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faCircleXmark, faGem, faHeadphones, faHouse, faImage, faKitchenSet, faLaptop, faShapes, faShirt, faTabletScreenButton } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { CldUploadWidget, CloudinaryUploadWidgetResults} from 'next-cloudinary';
import { useEffect, useState } from "react";
import {v4 as uuidv4} from 'uuid'
import Cookies from "js-cookie";
import axios from "axios";
import { createProduct } from "@/features/products/actions/product";
import { CartTab } from "@/features/cart/components/cartTab";
import { useToast } from "@/app/context/ToastContext";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";


interface Product{
    product_name: string;
    product_prevPrice: number;
    product_price: number;
    product_type: string;
    product_description: string;
    product_thumb: string;
    product_images:string[];
    product_quantity: number;
    product_attributes:{
        brand: string,
        model: string,
        material: string
    }
}

const categories = [
    {
        img: faHouse,
        name: "Home Appliance",
        value: "homeAppliances"
    },
    {
        img: faBolt,
        name: "Electronics",
        value: "electronics"
    },
    {
        img: faGem,
        name: "Jewlrys",
        value: "jewelrys"
    },
    {
        img: faKitchenSet,
        name: "Kitchen Appliance",
        value: "kitchenAppliances"
    },
    {
        img: faHeadphones,
        name: "Audio & Video",
        value: "audioVideo"
    },
    {
        img: faLaptop,
        name: "PC&Laptop",
        value: "laptop"
    }, 
    {
        img: faShirt,
        name: "Clothing",
        value: "clothing"
    },
    {
        img: faTabletScreenButton,
        name: "Gadget",
        value: "gadget"
    },
    {
        img: faShapes,
        name: "Others",
        value: "others"
    },
]


const ProductPage = () => {
    const { toast } = useToast();
    const shopId = Cookies.get("_id")
    
    const defaultProduct = {
        product_name: '',
        product_prevPrice: 0,
        product_price: 1,
        product_type: '',
        product_description: '',
        product_thumb: localStorage.getItem("imgThumbUrl") || '',
        product_images: JSON.parse(`${localStorage.getItem("imgsUrl")}`)  ||[],
        product_quantity: 1,
        product_attributes:{
            brand: '',
            model: '',
            material: ''
        }
    }

    const [product, setProduct] = useState<Product>(defaultProduct)
    const [imgThumb, setImgThumb] = useState<string>()
    const [imgs, setImgs] = useState<string[]>([])
    const [publicIdThumb, setPublicIdThumb] = useState<string>("")
    const [publicIdImage, setPublicIdImage] = useState<string[]>([])
    const [selectItem, setSelectItem] = useState<number>(0)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    
    const select = (nameCategory: string, i: number) => {
        setSelectItem(i)
        setProduct((prev) : Product => ({...prev,product_type: nameCategory}))
    }

    const handleSuccessUploadThumb = (result : CloudinaryUploadWidgetResults)  => {
        const event = result.event ? result.event : ''
        if(event === 'success'){
            if (typeof result.info === 'object' && result.info !== null) {
                const info = result.info;
                const secureUrl = info?.secure_url || '';
                const publicId = info?.public_id || '';
    
                if (secureUrl && publicId) {
                    localStorage.setItem('imgThumbUrl', secureUrl);
                    localStorage.setItem('idThumb', publicId);
                    setImgThumb(secureUrl);
                    setPublicIdThumb(publicId);
    
                    setProduct((prev: Product) => ({
                        ...prev,
                        product_thumb: secureUrl,
                    }));
                } 
        }
        }
    }

    const handleSuccessUploadImage = (result : CloudinaryUploadWidgetResults)  => {
        const event = result.event ? result.event : ''
        if(event === 'success'){
            if(typeof result.info === 'object' && result.info !== null){
                const info = result.info
                const secureUrl = info?.secure_url || '';
                const publicId = info?.public_id || '';
                setImgs(prev => {
                    const updatedImgs = [...prev, secureUrl]
                    localStorage.setItem('imgsUrl',JSON.stringify(updatedImgs))
                    setProduct((prev): Product => ({...prev,product_images: updatedImgs}))
                    return updatedImgs
                })
                setPublicIdImage(prev => {
                    const safePrev = Array.isArray(prev) ? prev : []
                    const updatedPublicId = [...safePrev, publicId]
                    localStorage.setItem('idImg', JSON.stringify(updatedPublicId))
                    return updatedPublicId 
                })
            }  
        }
    }
    
    const handleDeleteImageThumb = async() => {
        if(!publicIdThumb){
            toast.error({ title: "Error", message: "Thumbnail image not found" })
            return;
        }
        try {
            const res = await axios.post("/api/deleteImageCloudinary", {publicId: publicIdThumb})
            if(res.data?.success){
                toast.success({ title: "Deleted", message: "Thumbnail removed successfully" })
                localStorage.removeItem('imgThumbUrl')
                setImgThumb("")
                setPublicIdThumb("")
                setProduct((prev):Product => ({...prev,product_thumb: ''}))
            }
        } catch (error) {
            console.log(error);
        }
    }
    

    const handleDeleteImage = async(imgUrl : string,i: number) => {
        if(!publicIdImage){
            toast.error({ title: "Error", message: "Image not found" })
            return;
        }
        try {
            const res = await axios.post("/api/deleteImageCloudinary", {publicId: publicIdImage[i]})
            if(res.data){
                toast.success({ title: "Deleted", message: "Image removed successfully" })
            }
            
            setPublicIdImage((prev) : string[] => {
                const updatedPublicIdImage = prev.filter(id => id !== publicIdImage[i])
                localStorage.setItem('idImg', JSON.stringify(updatedPublicIdImage))
                return updatedPublicIdImage
            })
            setImgs((prev) :string[] => {
                const updatedImgs = prev.filter(url => url !== imgUrl)
                localStorage.setItem('imgsUrl',JSON.stringify(updatedImgs))
                setProduct((prev): Product => ({...prev,product_images: updatedImgs}))
                return updatedImgs
            })
        } catch (error) {
            console.log(error);
        }
    }


    const handleCreateProduct = async() => {
        const {product_name,product_images,product_description,product_price,product_quantity,product_thumb,product_type, product_prevPrice} = product
        
        if(product_name === "" || product_price === 1 || product_description === "" || product_quantity === 0  || product_type === "" || product_thumb === "" || product_images.length === 0)
        {
            toast.error({ title: "Missing Fields", message: "Please fill in all product attributes and upload images." })
            return;
        }

        if (product_prevPrice > 1 && (product_prevPrice <= product_price)){
            toast.error({ title: "Invalid Pricing", message: "Previous price must be higher than the regular selling price." })
            return;
        }
        const res = await createProduct(product)
        if(res){
            toast.success({ title: "Product Created", message: "Your product has been added to drafts successfully!" })
            const keyRemove = ["imgThumbUrl","imgsUrl",'idThumb','idImg']
            keyRemove.forEach(key => localStorage.removeItem(key))
            setIsSuccess(true)
            setProduct(defaultProduct)
            window.dispatchEvent(new Event('ChangeQuantityDraftAndPublish'))
        return res
        }
        
    }
    
    useEffect(() => {
        const loadData = () => {
            const thumbUrl = localStorage.getItem("imgThumbUrl");
            const imgsUrl = localStorage.getItem("imgsUrl");
            const idThumb = localStorage.getItem('idThumb')
            const idImage = localStorage.getItem('idImg')
            setPublicIdThumb(idThumb??"")
            setPublicIdImage(JSON.parse(`${idImage}`) || "[]")
            setImgThumb(thumbUrl ?? "");
            setImgs(JSON.parse(imgsUrl || "[]"));
            
        
        };
        console.log('logggg');
        
        loadData();
        
    },[])

    
    console.log('product',product);

return (
    <div className="w-full my-4 sm:my-6">
        <div className="w-full">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Create a New Product</h1>
            <div className="flex flex-col lg:grid lg:grid-cols-6 gap-6">
                {/* Left Column: Thumb, Images, Status */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    {/* Product Thumb */}
                    <div className="productThumb bg-white rounded-xl shadow-2xs border border-slate-200 overflow-hidden">
                        <h2 className="text-sm font-bold p-3.5 border-b border-slate-200 text-slate-800 bg-slate-50/70">
                            Product Thumbnail
                        </h2>

                        <div className="p-4">
                            <div className={`${imgThumb ? `hidden` : ''} imgThumb w-full max-w-[160px] h-36 mx-auto outline-dashed outline-2 outline-slate-300 outline-offset-2 rounded-xl flex flex-col items-center justify-center text-center p-3`}>
                                <FontAwesomeIcon icon={faImage} className="text-slate-400 text-2xl mb-1" />
                                <p className="text-xs text-slate-500">
                                    Upload image 
                                    <CldUploadWidget options={{sources: ['local','url','unsplash'], publicId: `${shopId}_productThumb_${uuidv4()}`}} uploadPreset="ecommerce_images" onSuccess={(result) => handleSuccessUploadThumb(result)}>
                                        {({open}) => {
                                            return(
                                                <button className="text-[#0573f0] font-semibold cursor-pointer ml-1 underline" onClick={() => open()}>
                                                    here
                                                </button>
                                            )
                                        }}
                                    </CldUploadWidget>
                                </p>
                            </div>

                            <div className={`${imgThumb ? "" : 'hidden'} imgThumb w-full max-w-[160px] h-36 mx-auto outline-dashed outline-2 outline-slate-300 outline-offset-2 rounded-xl flex items-center justify-center relative bg-slate-50 overflow-hidden`}>
                                <Image width={160} height={144} className="object-contain w-full h-full p-2" src={imgThumb ? imgThumb : "/banner.jpg"} alt="Thumbnail"/>
                                <button className="cursor-pointer text-lg absolute top-1 right-1 text-red-500 hover:text-red-700 bg-white/80 rounded-full w-6 h-6 flex items-center justify-center" onClick={handleDeleteImageThumb}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Product Images */}
                    <div className="productImage bg-white rounded-xl shadow-2xs border border-slate-200 overflow-hidden">
                        <h2 className="text-sm font-bold p-3.5 border-b border-slate-200 text-slate-800 bg-slate-50/70">
                            Product Images
                        </h2>
                        <div className="p-4 flex flex-row gap-3 overflow-x-auto no-scrollbar">
                            <div className="shrink-0">
                                <div className="imgProduct w-28 h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col justify-center items-center text-center p-2">
                                    <FontAwesomeIcon icon={faImage} className="text-slate-400 text-xl mb-1" />
                                    <p className="text-xs text-slate-500">
                                        Add images
                                        <CldUploadWidget options={{sources: ['local','url','unsplash'], multiple: true}} uploadPreset="ecommerce_images" onSuccess={result => handleSuccessUploadImage(result)}>
                                            {({open}) => {
                                                return(
                                                    <button className="text-[#0573f0] font-semibold cursor-pointer ml-1 underline" onClick={() => open()}>
                                                        here
                                                    </button>
                                                )
                                            }}
                                        </CldUploadWidget>                                     
                                    </p>  
                                </div>
                            </div>
                           
                            {imgs?.map((img, i) => (
                                <div key={i} className="shrink-0">
                                    <div className="imgProduct w-28 h-28 border border-slate-200 rounded-xl overflow-hidden relative bg-slate-50">
                                        <Image width={112} height={112} className="object-contain w-full h-full p-1" src={`${img}`} alt="Product Image"/>
                                        <button className="cursor-pointer text-lg absolute top-1 right-1 text-red-500 hover:text-red-700 bg-white/80 rounded-full w-6 h-6 flex items-center justify-center" onClick={() => handleDeleteImage(img, i)}>
                                            <FontAwesomeIcon icon={faCircleXmark} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>             
                    </div>
                    
                    {/* Status */}
                    <div className="statusProduct bg-white rounded-xl shadow-2xs border border-slate-200 overflow-hidden">
                        <h2 className="text-sm font-bold p-3.5 border-b border-slate-200 text-slate-800 bg-slate-50/70">
                            Status
                        </h2>
                        <div className="p-4">
                            <select className="w-full border border-slate-200 py-2.5 px-3 rounded-lg text-sm bg-white text-slate-700 font-medium">
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                    </div>

                    {isSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold rounded-xl text-sm text-center">
                            Create Product Successfully ✅
                        </div>
                    )}
                </div>
                
                {/* Right Column: Category, Details, Description */}
                <div className="lg:col-span-4 flex flex-col gap-5">
                    {/* Category Selection */}
                    <div className="productType bg-white rounded-xl shadow-2xs border border-slate-200 overflow-hidden">
                        <h2 className="text-sm font-bold p-3.5 border-b border-slate-200 text-slate-800 bg-slate-50/70">
                            Select Category
                        </h2>
                        <div className="p-4">
                            <ul className="flex flex-row gap-2.5 overflow-x-auto py-1 no-scrollbar">
                                {categories.map((category, i) => (
                                    <li
                                        key={i}
                                        className={`min-w-[120px] shrink-0 p-3 rounded-xl cursor-pointer border text-center transition-all ${
                                            selectItem === i
                                                ? 'bg-[#0573f0] text-white border-[#0573f0] shadow-xs'
                                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                        }`}
                                        onClick={() => select(category.value, i)}
                                    >
                                        <FontAwesomeIcon icon={category.img} className="text-base" />
                                        <p className="mt-2 text-xs font-semibold whitespace-nowrap">{category.name}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Product Details Inputs */}
                    <div className="productDetail bg-white rounded-xl shadow-2xs border border-slate-200 overflow-hidden">
                        <h2 className="text-sm font-bold p-3.5 border-b border-slate-200 text-slate-800 bg-slate-50/70">
                            Product Details
                        </h2>
                        <div className="p-4 sm:p-5 flex flex-col gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 mb-1 block">Product Name *</label>
                                    <input className="border border-slate-200 rounded-lg outline-none w-full p-2 text-sm focus:border-[#0573f0]" type="text" placeholder="e.g. Wireless Headphones" onChange={(e) => setProduct((prev) :Product => ({...prev, product_name: e.target.value}))} />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700 mb-1 block">Quantity *</label>
                                    <input className="border border-slate-200 rounded-lg outline-none w-full p-2 text-sm focus:border-[#0573f0]" type="number" min="1" placeholder="1" onChange={(e) => setProduct((prev) : Product => ({...prev, product_quantity: parseInt(e.target.value) || 1}))}/>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 mb-1 block">Price ($) *</label>
                                    <input className="border border-slate-200 rounded-lg outline-none w-full p-2 text-sm focus:border-[#0573f0]" type="number" min="1" placeholder="99" onChange={(e) => setProduct((prev) : Product => ({...prev, product_price: parseInt(e.target.value) || 1}))} />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700 mb-1 block">Previous Price ($) (Optional)</label>
                                    <input className="border border-slate-200 rounded-lg outline-none w-full p-2 text-sm focus:border-[#0573f0]" type="number" min="1" placeholder="120" onChange={(e) => setProduct((prev) : Product => ({...prev, product_prevPrice: parseInt(e.target.value) || 0}))}/>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 mb-1 block">Brand</label>
                                    <input className="border border-slate-200 rounded-lg outline-none w-full p-2 text-sm focus:border-[#0573f0]" type="text" placeholder="Sony, Apple..." onChange={(e) => setProduct((prev) : Product => ({...prev, product_attributes: {...prev.product_attributes, brand: e.target.value}}))} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 mb-1 block">Model</label>
                                    <input className="border border-slate-200 rounded-lg outline-none w-full p-2 text-sm focus:border-[#0573f0]" type="text" placeholder="Pro 2026" onChange={(e) => setProduct((prev) : Product => ({...prev, product_attributes: {...prev.product_attributes, model: e.target.value}}))} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 mb-1 block">Material</label>
                                    <input className="border border-slate-200 rounded-lg outline-none w-full p-2 text-sm focus:border-[#0573f0]" type="text" placeholder="Aluminum..." onChange={(e) => setProduct((prev) : Product => ({...prev, product_attributes: {...prev.product_attributes, material: e.target.value}}))} />
                                </div>
                            </div>                              
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="productDescription bg-white rounded-xl shadow-2xs border border-slate-200 overflow-hidden">
                        <h2 className="text-sm font-bold p-3.5 border-b border-slate-200 text-slate-800 bg-slate-50/70">
                            Product Description
                        </h2> 
                        <div className="p-4">
                            <textarea className="border border-slate-200 rounded-xl outline-none p-3 w-full h-36 sm:h-44 resize-none text-sm focus:border-[#0573f0]" placeholder="Describe your product in detail..." onChange={(e) => setProduct((prev) : Product => ({...prev, product_description: e.target.value}))}/>
                        </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="mt-2">
                        <button className="w-full py-3.5 px-6 shadow-sm bg-[#0573f0] hover:bg-[#0769da] text-white font-bold transition-all duration-200 cursor-pointer rounded-xl active:scale-[0.99]" onClick={handleCreateProduct}>
                            Create Product
                        </button>
                    </div>
                </div>
            </div>
            <CartTab />
        </div>
    </div>
  );
}

export default ProductPage;