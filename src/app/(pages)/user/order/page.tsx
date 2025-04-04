'use client'

import { getAllOrders } from "@/features/order/data/data";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
interface GetOrder{
    _id: string;
    order_userId: string;
    order_checkout:{
        totalPrice: number;
        feeShip: number;
        totalDiscount: number;
        totalCheckout: number
    };
    order_payment:{
        method: string
    };
    order_products:{
        price: number;
        quantity: number;
        productId: string
    }[];
    order_shipping:{
        name: string;
        street: string;
        city: string;
        country: string;
        phone: number
    };
    order_trackingNumber: string,
    order_status: string
    createdAt:  Date
}

interface Infor{
    name: string | undefined;
    street: string | undefined;
    city: string | undefined;
    country: string | undefined;
    phone: number | undefined
}
const OrderUserPage = () => {

    const [order,setOrder] = useState<GetOrder[]>()
    const [infor, setInfor] = useState<Infor[]>([])
    const [hoverIndex, setHoverIndex] = useState<number>()
    const [isHovered, setIsHovered] = useState<boolean>(false)

    useEffect(() => {

        const getOrders = async() => {
            const res = await getAllOrders()
            setOrder(res)
            
            setInfor(res.map((item :GetOrder) => ({
                name: item.order_shipping.name,
                street: item.order_shipping.street,
                city: item.order_shipping.city,
                country: item.order_shipping.country,
                phone: item.order_shipping.phone,
        })))
            
            return res
        }

        getOrders()
    },[])

   
    

    return (
        <div className="myOrder">
            <div className="myOrder-container w-[1200px] mx-auto mt-10">
                <h1 className="font-bold text-3xl">Order list</h1>
                <div className="w-full flex flex-row mt-5">
                    <div className="border-1 border-[#bbbbbb] bg-white px-20 py-4 flex flex-row items-center gap-2">
                        <span className=""><FontAwesomeIcon icon={faCalendar} /></span>
                        <h2 className=" text-xl font-bold ">Today</h2>
                    </div>
                    <div className="border-y border-r border-[#bbbbbb] bg-white px-20 py-4 flex flex-col ">
                        <h2 className="text-[#898888] font-bold">Total orders</h2>
                        <span className="text-3xl font-bold">{order?.length}</span>
                    </div>
                    <div className="border-y border-r border-[#bbbbbb] bg-white px-20 py-4 items-center">
                        <h2 className="text-[#898888] font-bold"> Ordered items</h2>
                        <span className="text-3xl font-bold">{order?.reduce((acc,item) => acc + item.order_products.length,0)}</span>
                    </div>
                     
                </div>
                <div className="myOrder-body w-full border-1 border-[#bbbbbb] mt-20">
                    <div className="myOrder-body_container bg-white py-5">
                        <div>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-[#898888] p-2">Order</th>
                                        <th className="text-[#898888] p-2">Date</th>
                                        <th className="text-[#898888] p-2">Customer</th>
                                        <th className="text-[#898888] p-2">Total</th>
                                        <th className="text-[#898888] p-2">Payment Status</th>
                                        <th className="text-[#898888] p-2">Items</th>
                                        <th className="text-[#898888] p-2">Method</th>
                                    </tr>
                                </thead>
                                <tbody className="space-y-4 relative">
                                    {order?.map((item,i) => {
                                        return(
                                            <tr key={i} className="">
                                                <td className="p-2 font-bold text-center cursor-pointer hover:underline hover:underline-offset-2 hover:text-[#0573f0] transition-color duration-300">{item.order_trackingNumber}</td>
                                                <td className="p-2 text-center">{new Date(item.createdAt).toLocaleString()}</td>
                                                <td className="p-2 relative text-center">{item.order_shipping.name} <span className="cursor-pointer ml-1"><FontAwesomeIcon icon={faCircleInfo} onMouseEnter={() => {setIsHovered(true), setHoverIndex(i)}} onMouseLeave={() => {setIsHovered(false),setHoverIndex(-1)}} /></span>
                                                <span className={`${isHovered && (hoverIndex===i) ? '': 'hidden'} absolute top-[-130px] -right-30 rounded-lg bg-white border-1 p-2`}>
                                                   <p className="font-bold text-xl text-left text-black">Information</p> 
                                                    <div className="information-container text-left">
                                                        <p className="text-sm text-[#870a0a] font-bold">name: <span className="text-base text-black font-thin">{infor[i].name}</span></p>
                                                        <p className="text-sm text-[#870a0a] font-bold">phone: <span className="text-base text-black font-thin">{infor[i].phone}</span></p>
                                                        <p className="text-sm text-[#870a0a] font-bold">street: <span className="text-base text-black font-thin">{infor[i].street}</span></p>
                                                        <p className="text-sm text-[#870a0a] font-bold">city:  <span className="text-base text-black font-thin">{infor[i].city}</span></p>
                                                        <p className="text-sm text-[#870a0a] font-bold">country: <span className="text-base text-black font-thin">{infor[i].country}</span></p>
                                                    </div>
                                                </span>
                                                </td>
                                                <td className="p-2 text-center">${item.order_checkout.totalCheckout}.00</td>
                                                <td className="p-2 text-center"><span className={`${item.order_status === 'pending'? `border-1 border-[#d7c318] text-[#d7c318] font-bold p-1` : ""}`}>{item.order_status}</span> </td>
                                                <td className="p-2 text-center">{item.order_products.length}</td>
                                                <td className="p-2 text-center">{item.order_payment.method}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default OrderUserPage;