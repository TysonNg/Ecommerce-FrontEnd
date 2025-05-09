'use client'
import { useModal } from '@/app/context/ModalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCartShopping, faChevronDown, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { logOut } from '@/features/users/actions/access';
import Cookies from "js-cookie";
import Link from 'next/link';
import { getCartById } from '@/features/cart/data/data';
import { useRouter } from 'next/navigation';


interface NavBarProps {
  cart: number
}

export const Navbar = (props: NavBarProps) => {
  const {openModal} = useModal()
  const {cart} = props
  const [name,setName] = useState<string>('')
  const [active, setActive] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isOpenMenuCategory, setIsOpenMenuCategory] = useState<boolean>(false)
  const {openCartModal, isPageHaveCartTab} = useModal()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const router = useRouter();
  const {closeCartModal} = useModal()
  const handleGoToCartPage = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 465) {
      router.push('/cart');
      closeCartModal()
    } 
  }
  const handleOpenSidebar= () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  const handleOpenMenu = () => {
    setIsOpenMenuCategory(!isOpenMenuCategory)
  }

  const handleOpenDropDown = () => {
    setIsOpen(!isOpen)
  }

  const handleLogOut = async() => {
    await logOut()
    localStorage.removeItem('name')
    localStorage.removeItem('isActive')
    setActive('off')
  }

  useEffect(() => {
    if(!Cookies.get('refreshToken')){
      localStorage.removeItem('name')
      localStorage.removeItem('isActive')

      const setQuantityOfTempCart = async() => {
        const res = await getCartById()
        localStorage.setItem('cartQuantity',res.metadata.cart_products.length)
      } 
      setQuantityOfTempCart()
    }
    const storedName = localStorage.getItem('name')
    const storedActive = String(localStorage.getItem('isActive') || 'off')
    setName(storedName? storedName: "")
    setActive(storedActive? storedActive: "")
  },[active])
  

  return (
    <nav className={`max-w-[350px] xl:max-w-[1200px] lg:max-w-[700px] sm:max-w-[500px] mx-auto my-0 flex flex-row justify-between  items-center px-2 xs:px-0 py-4 text-center relative`}>
      <button className="text-lg toggle-btn xl:hidden sm:block sm:relative" onClick={handleOpenSidebar}>☰ Menu</button>
      <ul className={`col-span-11 xl:flex xl:flex-row justify-items-start ${sidebarOpen?'absolute top-10 flex flex-col gap-2 p-2 items-start' : 'hidden'} xl:relative xl:top-0 z-1 bg-[#0573f0] xl:gap-15`}>
        <li> <Link href={'/'}>Home</Link>  </li>
        <li className='relative' onMouseEnter={handleOpenMenu} onMouseLeave={handleOpenMenu}>
          <Link href="/products?page=1" >All products <span className='ml-1'><FontAwesomeIcon icon={faAngleDown} /></span></Link>
          <div className={`${isOpenMenuCategory? '' : 'hidden'} absolute w-[250px] `} >
            <ul className='bg-[#0573f0] w-full p-5 items-start font-bold text-sm flex flex-col gap-3'>
              <li><Link href="/products?category=laptop&&page=1">PCs & laptop</Link></li>
              <li><Link href="/products?category=kitchenAppliances&&page=1">Kitchen Appliances</Link></li>
              <li><Link href="/products?category=homeAppliances&&page=1">Home Appliances</Link></li>
              <li><Link href="/products?category=gadget&&page=1">Gadgets</Link></li>
              <li><Link href="/products?category=others&&page=1">Others</Link></li>
            </ul>
          </div>
        </li>
        <li><Link  href="/products?category=audioVideo&&page=1">Audio & video</Link></li>
        <li><Link href="#">New arrivals</Link> </li>
        <li><Link href="#">Today&apos;s deal</Link> </li>
        <li> <Link href="#">Gift cards</Link></li>
      </ul>
      <ul className="flex justify-center col-span-1 gap-10 ">
        <li className='relative'>
          {!isPageHaveCartTab? (
          <Link href="/cart">
            <FontAwesomeIcon className="text-white cursor-pointer" icon={faCartShopping} />
          </Link> 
          ) : (
            <FontAwesomeIcon  onClick={() => {openCartModal();handleGoToCartPage();}} className="text-white cursor-pointer" icon={faCartShopping} />
          )}
          <span className='absolute font-bold text-xs text-[#0573f0] -right-4 -top-2 rounded rounded-full bg-white px-1 '>{cart}</span>
        </li>
        <li className='relative'>
          <button  className={`${active === 'true'? "hidden": ""} cursor-pointer`}  onClick={openModal}>
            Login
          </button>
          <div className={`${active === 'true'? "name": "hidden"} text-nowrap`}>
          <p onClick={handleOpenDropDown} className='font-bold cursor-pointer hover:opacity-80'> {name} <FontAwesomeIcon icon={faChevronDown}/></p>
            {isOpen && (
                  <div className='absolute top-7 z-1 right-0 w-[200px] text-left rounded-xl border-1 boder-[#c3c3c3] shadow-lg shadow-blue-100'>
                    <a href="/user/shop/product">
                      <div className='top-0 w-full py-2 pl-4 text-sm font-bold text-black duration-300 bg-white rounded-t-lg hover:bg-gray-100 transition-color'>
                        My shop
                      </div>
                    </a>  
                    <a href="/user/order">
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
