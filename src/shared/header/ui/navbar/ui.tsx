'use client'
import styles from './navbar.module.scss'
import { useModal } from '@/app/context/ModalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faChevronDown, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { logOut } from '@/features/users/actions/access';
import Cookies from "js-cookie";


export const Navbar = (props:any) => {
  const {openModal} = useModal()
  const {cart} = props
  const [name,setName] = useState<string>('')
  const [active, setActive] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const {openCartModal, isPageHaveCartTab} = useModal()
  const handleOpenDropDown = () => {
    setIsOpen(!isOpen)
    console.log(isOpen);
    
  }

  const handleLogOut = async() => {
    const res = await logOut()
    console.log('logOut', res);
    localStorage.removeItem('name')
    localStorage.removeItem('isActive')
    setActive('off')
  }

  useEffect(() => {
    if(!Cookies.get('refreshToken')){
      localStorage.removeItem('name')
      localStorage.removeItem('isActive')
    }
    const storedName = localStorage.getItem('name')
    const storedActive = String(localStorage.getItem('isActive') || 'off')
    setName(storedName? storedName: "")
    setActive(storedActive? storedActive: "")
  },[active])
  

  return (
    <nav className={`${styles.navbar} w-1200 grid-cols-12 grid items-center py-4 text-center`}>
      <ul className="col-span-11 gap-15 flex">
        <li><a href="/">Home</a></li>
        <li> <a href="/products?page=1">All products</a></li>
        <li><a href="/products?category=audioVideo&&page=1">Audio & video</a></li>
        <li><a href="#">New arrivals</a> </li>
        <li><a href="#">Today's deal</a> </li>
        <li> <a href="#">Gift cards</a></li>
      </ul>
      <ul className=" col-span-1 gap-10 pr-20 flex justify-center">
        <li className='relative'>
          {!isPageHaveCartTab? (
          <a href="/cart">
            <FontAwesomeIcon title='cart' className="text-white cursor-pointer" icon={faCartShopping} />
          </a> 
          ) : (
            <FontAwesomeIcon title='cart' onClick={openCartModal} className="text-white cursor-pointer" icon={faCartShopping} />
          )}
          {/* <a href="/cart" className={!isCartModalOpen?"pointer-events-none" : ""}>
            <FontAwesomeIcon title='cart' onClick={openCartModal} className="text-white cursor-pointer" icon={faCartShopping} />
          </a>  */}
          <span className='absolute font-bold text-xs text-[#0573f0] -right-4 -top-2 rounded rounded-full bg-white px-1 '>{cart}</span>
        </li>
        <li className='relative'>
          <button  className={`${active === 'true'? "hidden": ""} cursor-pointer`}  onClick={openModal}>
            Login
          </button>
          <div className={`${active === 'true'? "name": "hidden"} text-nowrap`}>
          <p onClick={handleOpenDropDown} className='cursor-pointer font-bold hover:opacity-80'> {name} <FontAwesomeIcon icon={faChevronDown}/></p>
            {isOpen && (
                  <div className='absolute top-7 right-0 w-[200px] text-left rounded-xl border-1 boder-[#c3c3c3] shadow-lg shadow-blue-100'>
                    <a href="/user/shop/product" title='http://localhost:3000/user/shop/product'>
                      <div className=' top-0 bg-white text-black text-sm w-full pl-4 py-2 font-bold hover:bg-gray-100 transition-color duration-300 rounded-t-lg'>
                        My shop
                      </div>
                    </a>  
                    <a href="/user/order" title='http://localhost:3000/user/order'>
                      <div className=' top-0 bg-white border-t-1 border-[#c3c3c3] text-black text-sm w-full pl-4 py-2 font-bold hover:bg-gray-100 transition-color duration-300'>
                        My orders
                      </div>
                    </a>
                    <div className='cursor-pointer bg-[#e5484d] border-t-1 border-[#c3c3c3] text-white text-sm w-full pl-4 py-2 font-bold hover:bg-[#ff6b6f] transition-color duration-300 rounded-b-lg' onClick={handleLogOut}>
                      Sign Out
                      <span className='ml-2'><FontAwesomeIcon icon={faRightFromBracket} /></span>
                    </div> 
                  </div>  
                    
            )}
          </div> 
        </li>
      </ul>
    </nav>
  )
}
