'use client'
import Image from "next/image"
import { useState } from "react"

export const ChangeStateAtDetailPage = (props:any) => {
    const {product_description, product_thumb, product_images, styles, product_name} = props
    const [state, setState] = useState("Description")
    const changeReviewState = () => {
        if(state === "Description")
            setState("Reviews")
    }

    const changeDescriptionState = () => {
        if(state === "Reviews")
            setState("Description")
    }


    const renderByState =() => {
        if(state === "Description")
        {
            return(
                <div className={`${styles.description_container} pt-10`}>
                    <h1 className="text-3xl font-bold pb-20">More about the product</h1>
                    <Image src={product_thumb} alt={product_description} width={1200} height={650}/>
                    <div className="features flex flex-row grid-cols-6 py-20">
                    
                        <h2 className="col-span-3 text-2xl font-bold text-nowrap pr-60 underline underline-offset-8 decoration-[#0573f0] ">Product's Features</h2>
                
                        <div className="description col-span-3">{product_description}</div>
                    </div>
                    <Image src={product_images.length === 1?product_thumb:product_images[1]} alt={product_description} width={1200} height={650} />
                </div>
            )
        }
        return(
            <div className={`${styles.review_container} `}>
                <p className="text-sm text-[#7A7A7A] pt-5">There are no reviews yet.</p>
                <form action="">
                    <div className={`${styles.box_container} flex flex-col gap-1 border border-[#dce3e5] p-5 mt-5 bg-[#f7f7f7]`}>
                        <p>Be the first to review  " {product_name} "</p>
                        <p className="text-sm text-[#7A7A7A]">Your email address will not be published.Required fields are marked*</p>
                        <div className="pt-3">
                            <div className="text-[#3d3c3c]">Your rating*</div>
                            <div>
                            <p className="pt-3 text-[#3d3c3c]">Your review*</p> 
                                <textarea className=" w-full h-20 border border-[#dce3e5] caret-black p-2 pt-1 "/>
                            </div>
                            <div className="flex flex-row grid-cols-6 pt-5">
                                <div className=" col-span-3 w-full pr-5">
                                <p className="text-[#3d3c3c]">Name*</p>
                                <input className="w-full h-10 caret-black p-2 border border-[#dce3e5]" type="text " />
                                </div> 
                                <div className="col-span-3 w-full pr-5">
                                    <p className="text-[#3d3c3c]">Email*</p>
                                    <input className="w-full h-10 caret-black p-2 border border-[#dce3e5]" type="text" /> 
                                </div>                        
                            </div>
                            <div className="flex flex-row gap-2 pt-5"><input type="checkbox" /> <p>Save my name, email, and website in this browser for the next time I comment</p></div>
                            <div className="pt-5">
                                <button className="bg-black hover:opacity-80 active:opacity-100 text-white py-2 px-5  cursor-pointer ">Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )

    }
    return(
        <div className={`${styles.bottom_body_container}`}>
            <div className="btn-box">
            <span className="flex gap-5 border-t-1 border-[#dce3e5] text-sm">
                <button className={`${state === "Description" ? "border-t-3":""} border-[#0573f0] cursor-pointer`} onClick={changeDescriptionState}>Descriptions</button>
                <button className={`${state === "Description" ? "":"border-t-3"} border-[#0573f0] cursor-pointer`} onClick={changeReviewState}>Reviews</button>
            </span> 

            </div>
            {renderByState()}
        </div>
    )
}