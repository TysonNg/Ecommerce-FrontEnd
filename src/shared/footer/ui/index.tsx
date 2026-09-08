'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faPhone,
  faEnvelope,
  faChevronDown,
  faArrowUp,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faInstagram,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import styles from './footer.module.scss';

export const Footer = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    shop: false,
    help: false,
    contact: false,
  });

  const toggleSection = (section: 'shop' | 'help' | 'contact') => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Top Footer */}
      <section className={styles.top_footer}>
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* Column 1: Brand & Social */}
            <div className="flex flex-col items-start">
              <Link href="/" className="inline-block relative w-[160px] h-[55px] mb-3">
                <Image
                  src="/logo-footer.png"
                  alt="E-Shop Ecommerce"
                  fill
                  sizes="160px"
                  className="object-contain object-left"
                />
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed mb-5 max-w-sm">
                Your premier destination for high-quality electronics, smart gadgets, and everyday technology at competitive prices.
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0573f0] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105"
                >
                  <FontAwesomeIcon icon={faFacebookF} className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0573f0] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105"
                >
                  <FontAwesomeIcon icon={faInstagram} className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0573f0] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105"
                >
                  <FontAwesomeIcon icon={faXTwitter} className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0573f0] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105"
                >
                  <FontAwesomeIcon icon={faYoutube} className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Column 2: Shop */}
            <div className="border-b border-slate-200 md:border-b-0 pb-3 md:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('shop')}
                className="flex items-center justify-between w-full text-left md:pointer-events-none md:cursor-default"
                aria-expanded={openSections.shop}
              >
                <h6 className="font-bold text-slate-900 text-sm md:text-base uppercase tracking-wider">
                  Shop
                </h6>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 md:hidden ${
                    openSections.shop ? 'rotate-180 text-[#0573f0]' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 md:!block md:!max-h-none md:opacity-100 ${
                  openSections.shop
                    ? 'max-h-96 opacity-100 pt-3'
                    : 'max-h-0 opacity-0 md:pt-4'
                }`}
              >
                <ul className="space-y-2.5">
                  <li>
                    <Link
                      href="/products"
                      className="text-sm text-[#48515b] hover:text-[#0573f0] hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Hot deals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="text-sm text-[#48515b] hover:text-[#0573f0] hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="text-sm text-[#48515b] hover:text-[#0573f0] hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Brands
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="text-sm text-[#48515b] hover:text-[#0573f0] hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Rebates
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      className="text-sm text-[#48515b] hover:text-[#0573f0] hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Weekly deals
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 3: Need help? */}
            <div className="border-b border-slate-200 md:border-b-0 pb-3 md:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('help')}
                className="flex items-center justify-between w-full text-left md:pointer-events-none md:cursor-default"
                aria-expanded={openSections.help}
              >
                <h6 className="font-bold text-slate-900 text-sm md:text-base uppercase tracking-wider">
                  Need help?
                </h6>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 md:hidden ${
                    openSections.help ? 'rotate-180 text-[#0573f0]' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 md:!block md:!max-h-none md:opacity-100 ${
                  openSections.help
                    ? 'max-h-96 opacity-100 pt-3'
                    : 'max-h-0 opacity-0 md:pt-4'
                }`}
              >
                <ul className="space-y-2.5">
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm text-[#48515b] hover:text-[#0573f0] hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders"
                      className="text-sm text-[#48515b] hover:text-[#0573f0] hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Order tracking
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="text-sm text-[#48515b] hover:text-[#0573f0] hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/return-policy"
                      className="text-sm text-[#48515b] hover:text-[#0573f0] hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Return policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-sm text-[#48515b] hover:text-[#0573f0] hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Privacy policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 4: Contact Info */}
            <div className="border-b border-slate-200 md:border-b-0 pb-3 md:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('contact')}
                className="flex items-center justify-between w-full text-left md:pointer-events-none md:cursor-default"
                aria-expanded={openSections.contact}
              >
                <h6 className="font-bold text-slate-900 text-sm md:text-base uppercase tracking-wider">
                  Contact
                </h6>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 md:hidden ${
                    openSections.contact ? 'rotate-180 text-[#0573f0]' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 md:!block md:!max-h-none md:opacity-100 ${
                  openSections.contact
                    ? 'max-h-96 opacity-100 pt-3'
                    : 'max-h-0 opacity-0 md:pt-4'
                }`}
              >
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-[#48515b]">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="w-4 h-4 text-[#0573f0] mt-0.5 shrink-0"
                    />
                    <span>356 Cach Mang Thang 8, HCM city</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#48515b]">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="w-4 h-4 text-[#0573f0] shrink-0"
                    />
                    <a
                      href="mailto:tysonNg@gmail.com"
                      className="hover:text-[#0573f0] transition-colors"
                    >
                      tysonNg@gmail.com
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#48515b]">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="w-4 h-4 text-[#0573f0] shrink-0"
                    />
                    <a
                      href="tel:9292426868"
                      className="hover:text-[#0573f0] transition-colors font-medium"
                    >
                      929-242-6868
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="w-3.5 h-3.5 text-slate-400 shrink-0"
                    />
                    <span>Mon - Sat: 8:00 AM - 9:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Footer */}
      <section className={styles.bottom_footer}>
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="text-xs text-slate-400">
            <p>© 2025 Electronic Store. Powered by E-Shop Ecommerce</p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-[#0573f0] px-4 py-2 rounded-full transition-all duration-200 border border-slate-700 hover:border-[#0573f0] shadow-xs cursor-pointer group"
          >
            <span>Back to top</span>
            <FontAwesomeIcon
              icon={faArrowUp}
              className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform duration-200"
            />
          </button>

          <div className="relative w-[180px] h-[28px] opacity-90 hover:opacity-100 transition-opacity">
            <Image
              src="/icon-footer.png"
              alt="Accepted Payment Methods"
              fill
              sizes="180px"
              className="object-contain object-center md:object-right"
            />
          </div>
        </div>
      </section>
    </footer>
  );
};
