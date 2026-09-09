'use client';

import { useModal } from '@/app/context/ModalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faCartShopping,
  faChevronDown,
  faRightFromBracket,
  faXmark,
  faTruck,
  faCircleQuestion,
  faHeadset,
  faBoxOpen,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { logOut } from '@/features/users/actions/access';
import Cookies from "js-cookie";
import Link from 'next/link';
import { getCartById } from '@/features/cart/data/data';
import { useRouter } from 'next/navigation';

interface NavBarProps {
  cart: number;
}

export const Navbar = (props: NavBarProps) => {
  const { openModal } = useModal();
  const { cart } = props;
  const [name, setName] = useState<string>('');
  const [active, setActive] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenMenuCategory, setIsOpenMenuCategory] = useState<boolean>(false);
  const [mobileCategoryExpanded, setMobileCategoryExpanded] = useState<boolean>(false);
  const { openCartModal, isPageHaveCartTab, closeCartModal } = useModal();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();
  const [isBadgePopping, setIsBadgePopping] = useState<boolean>(false);

  useEffect(() => {
    if (cart > 0) {
      setIsBadgePopping(true);
      const timer = setTimeout(() => setIsBadgePopping(false), 450);
      return () => clearTimeout(timer);
    }
  }, [cart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleGoToCartPage = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      router.push('/cart');
      closeCartModal();
    }
  };

  const handleOpenSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleOpenDropDown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogOut = async () => {
    await logOut();
    localStorage.removeItem('name');
    localStorage.removeItem('isActive');
    setActive('off');
    setIsOpen(false);
  };

  useEffect(() => {
    if (!Cookies.get('refreshToken')) {
      localStorage.removeItem('name');
      localStorage.removeItem('isActive');

      const setQuantityOfTempCart = async () => {
        try {
          const res = await getCartById();
          if (res?.metadata?.cart_products) {
            localStorage.setItem('cartQuantity', res.metadata.cart_products.length);
          }
        } catch (e) {
          console.error("Cart quantity sync error:", e);
        }
      };
      setQuantityOfTempCart();
    }
    const storedName = localStorage.getItem('name');
    const storedActive = String(localStorage.getItem('isActive') || 'off');
    setName(storedName ? storedName : "");
    setActive(storedActive ? storedActive : "");

    const syncUserAuth = () => {
      const latestName = localStorage.getItem('name');
      const latestActive = String(localStorage.getItem('isActive') || 'off');
      setName(latestName ? latestName : "");
      setActive(latestActive ? latestActive : "");
    };

    window.addEventListener('user-auth-change', syncUserAuth);
    return () => {
      window.removeEventListener('user-auth-change', syncUserAuth);
    };
  }, [active]);

  return (
    <>
      <nav className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3 relative">
        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="xl:hidden flex items-center gap-2 text-white font-medium text-sm hover:opacity-85 transition-opacity cursor-pointer py-1 px-2 -ml-2 rounded-md hover:bg-white/10"
          onClick={handleOpenSidebar}
          aria-label="Toggle navigation menu"
        >
          <span className="text-xl leading-none">☰</span>
          <span className="tracking-wide">Menu</span>
        </button>

        {/* Desktop Navigation Links */}
        <ul className="hidden xl:flex items-center gap-8 text-sm font-medium text-white/95">
          <li>
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
          </li>
          <li
            className="relative py-2"
            onMouseEnter={() => setIsOpenMenuCategory(true)}
            onMouseLeave={() => setIsOpenMenuCategory(false)}
          >
            <Link
              href="/products?page=1"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span>All products</span>
              <FontAwesomeIcon icon={faAngleDown} className="text-xs text-white/70" />
            </Link>
            {isOpenMenuCategory && (
              <div className="absolute top-full left-0 w-[240px] pt-1 z-50 animate-toast-enter">
                <ul className="bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 p-2 font-medium text-sm flex flex-col gap-1">
                  <li>
                    <Link
                      href="/products?category=laptop&&page=1"
                      className="block px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      PCs & laptop
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?category=kitchenAppliances&&page=1"
                      className="block px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      Kitchen Appliances
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?category=homeAppliances&&page=1"
                      className="block px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      Home Appliances
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?category=gadget&&page=1"
                      className="block px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      Gadgets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?category=others&&page=1"
                      className="block px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      Others
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li>
            <Link
              href="/products?category=audioVideo&&page=1"
              className="hover:text-white transition-colors"
            >
              Audio & video
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:text-white transition-colors">
              New arrivals
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:text-white transition-colors">
              Today&apos;s deal
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:text-white transition-colors">
              Gift cards
            </Link>
          </li>
        </ul>

        {/* Right Action Icons (Cart & Login/User) */}
        <ul className="flex items-center gap-6 sm:gap-8 ml-auto">
          {/* Cart Icon */}
          <li className="relative flex items-center">
            {!isPageHaveCartTab ? (
              <Link href="/cart" className="p-1 hover:opacity-85 transition-opacity" aria-label="View Shopping Cart">
                <FontAwesomeIcon
                  className="text-white text-lg cursor-pointer hover:scale-110 transition-transform"
                  icon={faCartShopping}
                />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  openCartModal();
                  handleGoToCartPage();
                }}
                className="p-1 hover:opacity-85 transition-opacity cursor-pointer border-none bg-transparent"
                aria-label="Open Shopping Cart"
              >
                <FontAwesomeIcon
                  className="text-white text-lg hover:scale-110 transition-transform"
                  icon={faCartShopping}
                />
              </button>
            )}
            <span
              className={`absolute font-bold text-[11px] text-[#0573f0] -right-3 -top-1.5 rounded-full bg-white min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-xs transition-all duration-300 pointer-events-none ${
                isBadgePopping ? 'animate-badge-pop scale-125 bg-amber-300' : ''
              }`}
            >
              {cart}
            </span>
          </li>

          {/* User / Login */}
          <li className="relative">
            {active !== 'true' ? (
              <button
                type="button"
                className="text-sm font-medium text-white hover:text-white/90 bg-white/15 hover:bg-white/25 px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                onClick={openModal}
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={handleOpenDropDown}
                  className="flex items-center gap-1.5 font-semibold text-sm text-white hover:opacity-85 cursor-pointer bg-transparent border-none py-1"
                >
                  <span className="max-w-[110px] truncate">{name}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-toast-enter">
                    <Link
                      href="/user/shop/product"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      My shop
                    </Link>
                    <Link
                      href="/user/order"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-blue-50 hover:text-[#0573f0] transition-colors border-t border-slate-100"
                    >
                      My orders
                    </Link>
                    <button
                      type="button"
                      className="w-full text-left flex items-center justify-between px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 cursor-pointer"
                      onClick={handleLogOut}
                    >
                      <span>Sign Out</span>
                      <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Mobile Slide-Over Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[9990] xl:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={closeSidebar}
          />

          {/* Drawer Content */}
          <div className="fixed top-0 left-0 bottom-0 w-[300px] sm:w-[340px] bg-white text-slate-800 shadow-2xl z-[9995] flex flex-col animate-drawer-enter overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-[#0573f0] text-white">
              <span className="font-bold text-xl tracking-tight">E-Shop</span>
              <button
                type="button"
                onClick={closeSidebar}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={faXmark} className="text-base" />
              </button>
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 py-4 px-3 space-y-6">
              {/* Section 1: Shop Categories */}
              <div>
                <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Shopping
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/"
                      onClick={closeSidebar}
                      className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      Home
                    </Link>
                  </li>

                  {/* All products with accordion */}
                  <li>
                    <button
                      type="button"
                      onClick={() => setMobileCategoryExpanded(!mobileCategoryExpanded)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#0573f0] transition-colors text-left"
                    >
                      <span>All products</span>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-xs text-slate-400 transition-transform duration-200 ${
                          mobileCategoryExpanded ? 'rotate-180 text-[#0573f0]' : ''
                        }`}
                      />
                    </button>
                    {mobileCategoryExpanded && (
                      <ul className="pl-4 pr-1 py-1 space-y-1 text-sm font-normal text-slate-600 border-l-2 border-blue-100 ml-4 my-1">
                        <li>
                          <Link
                            href="/products?page=1"
                            onClick={closeSidebar}
                            className="block px-2 py-1.5 rounded-md hover:text-[#0573f0] hover:bg-blue-50/50"
                          >
                            All Categories
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/products?category=laptop&&page=1"
                            onClick={closeSidebar}
                            className="block px-2 py-1.5 rounded-md hover:text-[#0573f0] hover:bg-blue-50/50"
                          >
                            PCs & laptop
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/products?category=kitchenAppliances&&page=1"
                            onClick={closeSidebar}
                            className="block px-2 py-1.5 rounded-md hover:text-[#0573f0] hover:bg-blue-50/50"
                          >
                            Kitchen Appliances
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/products?category=homeAppliances&&page=1"
                            onClick={closeSidebar}
                            className="block px-2 py-1.5 rounded-md hover:text-[#0573f0] hover:bg-blue-50/50"
                          >
                            Home Appliances
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/products?category=gadget&&page=1"
                            onClick={closeSidebar}
                            className="block px-2 py-1.5 rounded-md hover:text-[#0573f0] hover:bg-blue-50/50"
                          >
                            Gadgets
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/products?category=others&&page=1"
                            onClick={closeSidebar}
                            className="block px-2 py-1.5 rounded-md hover:text-[#0573f0] hover:bg-blue-50/50"
                          >
                            Others
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>

                  <li>
                    <Link
                      href="/products?category=audioVideo&&page=1"
                      onClick={closeSidebar}
                      className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      Audio & video
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      onClick={closeSidebar}
                      className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      New arrivals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      onClick={closeSidebar}
                      className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      Today&apos;s deal
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      onClick={closeSidebar}
                      className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      Gift cards
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Section 2: Help & Utilities (Transferred from Topbar for mobile) */}
              <div className="pt-4 border-t border-slate-100">
                <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Customer Support & Help
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/orders"
                      onClick={closeSidebar}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      <FontAwesomeIcon icon={faTruck} className="w-4 h-4 text-[#0573f0]" />
                      <span>Track order</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/return-policy"
                      onClick={closeSidebar}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      <FontAwesomeIcon icon={faBoxOpen} className="w-4 h-4 text-[#0573f0]" />
                      <span>Shipping & return</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      onClick={closeSidebar}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      <FontAwesomeIcon icon={faCircleQuestion} className="w-4 h-4 text-[#0573f0]" />
                      <span>FAQs</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      onClick={closeSidebar}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-[#0573f0] transition-colors"
                    >
                      <FontAwesomeIcon icon={faHeadset} className="w-4 h-4 text-[#0573f0]" />
                      <span>Help & Support</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Drawer Footer info */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-center">
              <p>Hotline: <a href="tel:9292426868" className="text-[#0573f0] font-semibold">929-242-6868</a></p>
              <p className="mt-1 text-slate-400">© 2025 E-Shop Ecommerce</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
