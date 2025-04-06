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
            alert("not found imgThumb")
            return;
        }
        try {
            const res = await axios.post("/api/deleteImageCloudinary", {publicId: publicIdThumb})
            if(res.data?.success){
                alert('Delete thumb successfully!')
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
            alert("not found imgThumb")
            return;
        }
        try {
            const res = await axios.post("/api/deleteImageCloudinary", {publicId: publicIdImage[i]})
            if(res.data){
                alert('Delete image successfully!')
                
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
        if(product_name === "" || product_price === 1 || product_description === "" || product_quantity === 1 || product_type === "" || product_thumb === "" || product_images.length === 0)
        {
            alert("Pls fill fully properties")
            return;
        }

        if (product_prevPrice > 1 && (product_prevPrice <= product_price)){
            alert("Previous price must higher than price")
            return;
        }
        const res = await createProduct(product)
        if(res){
            alert('Create Product Successfully !!!!')
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
    
        loadData();
        
    },[])

    

return(
    <div>

            <div className="px-5 mb-20 createProduct xl:w-full lg:w-[700px]">
                <h1 className="p-2 text-xl font-bold">Create a New Product</h1>
                <div className="grid grid-cols-6 gap-5 createProduct-container">
                    <div className="flex flex-col col-span-2 gap-5 p-2">
                        <div className="productThumb bg-white rounded-lg shadow border-[#d3d3d3] border-1">
                            <h2 className="text-sm font-bold p-3 border-b border-[#d3d3d3]">
                                Product Thumb
                            </h2>

                            <div className="">
                                <div className={`${imgThumb? `hidden`: ''} imgThumb w-32 h-32 ml-5 outline-dashed outline-2 outline-[#777b84] outline-offset-2
                                    rounded-lg content-center text-center my-5`}>
                                        <FontAwesomeIcon icon={faImage} />
                                        <p className="text-sm">
                                            Please drop your image 
                                            <CldUploadWidget options={{sources: ['local','url','unsplash'], publicId: `${shopId}_productThumb_${uuidv4()}`}} uploadPreset="ecommerce_images" onSuccess={(result) => handleSuccessUploadThumb(result)}>
                                                    {({open}) => {
                                                        return(
                                                            <button className="text-[#1612c3] cursor-pointer ml-1" onClick={() => open()}>
                                                                here
                                                            </button>
                                                        )
                                                    }}
                                            </CldUploadWidget>
                                        </p>
                                </div>

                                <div className={`${imgThumb? "" : 'hidden' } imgThumb w-32 h-32 ml-5 outline-dashed outline-2 outline-[#777b84] outline-offset-2
                                rounded-lg content-center text-center my-5 justify-self-center relative`}>
                                    <Image width={200} height={32} src={imgThumb? imgThumb : "https://websitedemos.net/electronic-store-04/wp-content/uploads/sites/1055/2022/03/electronic-store-product-image-21.jpg"} alt="image"/>
                                    <button className="cursor-pointer text-xl absolute top-[-15px] right-0  text-[#d95757] hover:text-[#ff6666]" onClick={handleDeleteImageThumb}><FontAwesomeIcon icon={faCircleXmark} /></button>
                                </div>
                            </div>
                            

                        </div>
                        
                        <div className="productImage bg-white rounded-lg shadow border-[#d3d3d3] border-1">
                            <h2 className="text-sm font-bold p-3 border-b border-[#d3d3d3]">
                                Product Images
                            </h2>
                            <div className="flex flex-row my-5 ml-5 overflow-x-auto">
                                <div>
                                    <div className="imgProduct w-32 h-32 border-2 border-dashed border-[#777b84] 
                                    rounded-lg flex flex-col justify-center items-center text-center">
                                        <FontAwesomeIcon icon={faImage} />
                                        <p className="text-sm ">
                                            Please drop your image  
                                            <CldUploadWidget options={{sources: ['local','url','unsplash'],multiple: true}} uploadPreset="ecommerce_images" onSuccess={result => handleSuccessUploadImage(result)}>
                                                    {({open}) => {
                                                        return(
                                                            <button className="text-[#1612c3] cursor-pointer ml-1 " onClick={() => open()}>
                                                                here
                                                            </button>
                                                        )
                                                    }}
                                        </CldUploadWidget>                                     
                                        </p>  
                                    </div>
                                </div>
                               
                                {imgs?.map((img,i) => {
                                    return (
                                        <div key={i}>
                                            <div className={` imgProduct w-32 h-32 ml-5 border-2 border-dashed border-[#777b84]
                                            rounded-lg  overflow-hidden relative`} >
                                                <Image width={128} height={128} src={`${img}`} alt="imageProduct"/>
                                                <button className="cursor-pointer text-xl absolute top-[-5px] right-0  text-[#d95757] hover:text-[#ff6666]" onClick={() => handleDeleteImage(img,i)}><FontAwesomeIcon className="" icon={faCircleXmark} /></button>
                                            </div>
                                        </div>
                                        
                                    )
                                })}

                            
                            </div>             
                            
                            
                        </div>
                        
                    <div className="statusProduct bg-white rounded-lg shadow border-[#d3d3d3] border-1">
                        <h2 className="text-sm font-bold p-3 border-b border-[#d3d3d3]">
                            Status
                        </h2>
                        <div className="content-center px-3 pb-4 mt-5 ">
                            <select className="w-full border-1 border-[#d3d3d3] py-2 px-3 rounded-lg">
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                    </div>
                    <div className={`${isSuccess? "": "hidden"} text-[#40c520] font-bold`}>
                        Create Product Successfully ✅
                    </div>
                        
                    </div>
                    
                    <div className="col-span-4 p-2">
                        <div className="productType bg-white rounded-lg shadow border-[#d3d3d3] border-1">
                            <h2 className="text-sm font-bold p-3 border-b border-[#d3d3d3]">Product Type</h2>
                            <div className="types">
                                <ul className="flex flex-row gap-3 px-5 py-3 overflow-x-auto listTypes">
                                    {categories.map((category,i) => {
                                        return (
                                            <div key={i} className={`${selectItem === i?'bg-[#4467df] text-white' :'bg-[#ededed]'} border-1 h-25 w-full p-3 rounded-lg  cursor-pointer`} onClick={() => select(category.value,i)}>
                                            
                                                    <FontAwesomeIcon icon={category.img} />
                                                    <p className="mt-3 text-sm font-bold text-nowrap">{category.name}</p>
                                                
                                            </div>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>

                        <div className="productDetail bg-white rounded-lg shadow border-[#d3d3d3] border-1 mt-5">
                                <h2 className="text-sm font-bold border-b border-[#d3d3d3] p-3">Product Detail</h2>
                                <div className="grid gap-5 p-3 detail">
                                    <div className="grid gap-3 xl:grid-cols-6 sm:grid-cols-3">
                                        <div className="col-span-3">
                                            <p className="text-sm font-bold">Product Name</p>
                                            <input className="border-1 border-[#d3d3d3] outline-none w-full p-1" type="text" onChange={(e) => setProduct((prev) :Product => ({...prev,product_name: e.target.value}))} />
                                        </div>

                                        <div className="col-span-3">
                                            <p className="text-sm font-bold">Quantity</p>
                                            <input className="border-1 border-[#d3d3d3] outline-none w-full p-1 " type="number" onChange={(e) => setProduct((prev) : Product => ({...prev,product_quantity: parseInt(e.target.value) }))}/>
                                        </div>
                                    </div>

                                    <div className="grid xl:grid-cols-6 sm:grid-cols-3gap-3">
                                        <div className="col-span-3">
                                            <p className="text-sm font-bold">Price</p>
                                            <input className="border-1 border-[#d3d3d3] outline-none w-full p-1" type="text" onChange={(e) => setProduct((prev) : Product => ({...prev,product_price: parseInt(e.target.value)}))} />
                                        </div>

                                        <div className="col-span-3">
                                            <p className="text-sm font-bold">Previous Price (optional)</p>
                                            <input className="border-1 border-[#d3d3d3] outline-none w-full p-1" type="text"  onChange={(e) => setProduct((prev) : Product => ({...prev,product_prevPrice: parseInt(e.target.value)}))}/>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 lg:grid-cols-4 xl:grid-cols-6 sm:grid-cols-2">
                                        <div className="col-span-2">
                                            <p className="text-sm font-bold">Brand</p>
                                            <input className="border-1 border-[#d3d3d3] outline-none p-1" type="text" onChange={(e) => setProduct((prev) : Product => ({...prev, product_attributes: {...prev.product_attributes,brand: e.target.value}}))} />
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm font-bold">Model</p>
                                            <input className="border-1 border-[#d3d3d3] outline-none p-1"  type="text" onChange={(e) => setProduct((prev) : Product => ({...prev, product_attributes: {...prev.product_attributes,model: e.target.value}}))} />
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm font-bold">Material</p>
                                            <input className="border-1 border-[#d3d3d3] outline-none p-1" type="text" onChange={(e) => setProduct((prev) : Product => ({...prev, product_attributes: {...prev.product_attributes,material: e.target.value}}))} />
                                        </div>
                                    </div>                              
                                </div>
                        </div>

                        <div className="productDecription bg-white rounded-lg shadow border-[#d3d3d3] border-1 mt-5 h-[400px] w-full">
                            <h2 className="text-sm font-bold border-b border-[#d3d3d3] p-3">Product Description</h2> 
                            <div className="decription-container p-5 h-[350px]">
                                <textarea  className="border-1 border-[#d3d3d3] rounded-lg outline-none p-3 w-full h-full resize-none" placeholder="Decriptions of Product..." onChange={(e) => setProduct((prev) : Product => ({...prev,product_description: e.target.value}))}/>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
                <div className="mt-5 btnCreateProduct">
                    <div>
                        <button className="w-full border-1 py-4 shadow bg-black text-white hover:bg-[#0573f0] transition-colors duration-300 cursor-pointer rounded-lg" onClick={handleCreateProduct}>Create Product</button>
                    </div>
                </div>
            <CartTab />

            </div>
    </div>
    
    )

}

export default ProductPage;