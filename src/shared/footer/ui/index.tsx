import styles from "./footer.module.scss";
import Image from "next/image";
import Link from "next/link";
export const Footer = () => {
  return (
    <section className={`${styles.footer}`}>
      <section className="bg-white">
        <div className={`${styles.top_footer} py-20 `}>
            
        
          <div className={`${styles.top_footer_container} w-full max-w-[1200px] mx-auto my-0 grid xl:grid-cols-8 sm:grid-cols-4 gap-30 text-nowrap`}>
            <div className={`${styles.logo} col-span-2`}>
              <Image src="/logo-footer.png" alt="e-shop" width={300} height={200} /> 
            </div>
            <div className={`${styles.shop} col-span-2  `}>
              <h6 className={`${styles.header_title}`}>Shop</h6>
              <ul className={`${styles.list_menu} content-center` }>
                <li className={`${styles.list_item}`}>
                  <Link href="#">Hot deals</Link>
                </li>
                <li className={`${styles.list_item}`}>
                  <Link href="#">Categories</Link>
                </li>

                <li className={`${styles.list_item}`}>
                  <Link href="#">Brands</Link>
                </li>

                <li className={`${styles.list_item}`}>
                  <Link href="#">Rebates</Link>
                </li>

                <li className={`${styles.list_item}`}>
                  <Link href="#">Weekly deals</Link>
                </li>
              </ul>
            </div>

            <div className={`${styles.need_help} col-span-2`}>
              <h6 className={`${styles.header_title}`}>Need help?</h6>
              <ul className={`${styles.list_menu} content-center`}>
                <li className={`${styles.list_item}`}>
                  <Link href="#">Contact</Link>
                </li>
                <li className={`${styles.list_item}`}>
                  <Link href="#">Order tracking</Link>
                </li>

                <li className={`${styles.list_item}`}>
                  <Link href="#">FAQs</Link>
                </li>

                <li className={`${styles.list_item}`}>
                  <Link href="#">Return policy</Link>
                </li>

                <li className={`${styles.list_item}`}>
                  <Link href="#">Privacy policy</Link>
                </li>
              </ul>
            </div>

            <div className={`${styles.contact} col-span-2 `}>
              <h6 className={`${styles.header_title}`}>Contact</h6>
              <ul className={`${styles.list_menu}  content-center`}>
                <li className={`${styles.list_item}`}>
                  <Link href="#">356 Cach Mang Thang 8, HCM city</Link>
                </li>
                <li className={`${styles.list_item}`}>
                  <Link href="#">tysonNg@gmail.com</Link>
                </li>

                <li className={`${styles.list_item}`}>
                  <Link href="#">929-242-6868</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.bottom_footer} `}>
        <div className={`${styles.bottom_footer_container} w-full max-w-[1200px] mx-auto my-0 flex justify-between`}>
            <div className={`${styles.text} grid-start-1 PropTypes.bool.isRequired,`}>
                <p>© 2025 Electronic Store. Powered by E-Shop Ecommerce</p>
            </div>
            <div className={`${styles.checkout} grid-end-13`}>
                <Image src="/icon-footer.png" width={200} height={200} alt="image" />
            </div>
        </div>
      </section>
    </section>
  );
};
