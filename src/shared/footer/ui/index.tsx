import styles from "./footer.module.scss";
import Image from "next/image";
export const Footer = () => {
  return (
    <section className={`${styles.footer}`}>
      <section className="bg-white">
        <div className={`${styles.top_footer} py-20 `}>
            
        
          <div className={`${styles.top_footer_container} grid grid-cols-8 gap-30 text-nowrap`}>
            <div className={`${styles.logo} col-span-2`}>
              <Image src="/logo-footer.png" alt="e-shop" width={300} height={200} /> 
            </div>
            <div className={`${styles.shop} col-span-2  `}>
              <h6 className={`${styles.header_title}`}>Shop</h6>
              <ul className={`${styles.list_menu} content-center` }>
                <li className={`${styles.list_item}`}>
                  <a href="">Hot deals</a>
                </li>
                <li className={`${styles.list_item}`}>
                  <a href="">Categories</a>
                </li>

                <li className={`${styles.list_item}`}>
                  <a href="">Brands</a>
                </li>

                <li className={`${styles.list_item}`}>
                  <a href="">Rebates</a>
                </li>

                <li className={`${styles.list_item}`}>
                  <a href="">Weekly deals</a>
                </li>
              </ul>
            </div>

            <div className={`${styles.need_help} col-span-2`}>
              <h6 className={`${styles.header_title}`}>Need help?</h6>
              <ul className={`${styles.list_menu} content-center`}>
                <li className={`${styles.list_item}`}>
                  <a href="">Contact</a>
                </li>
                <li className={`${styles.list_item}`}>
                  <a href="">Order tracking</a>
                </li>

                <li className={`${styles.list_item}`}>
                  <a href="">FAQs</a>
                </li>

                <li className={`${styles.list_item}`}>
                  <a href="">Return policy</a>
                </li>

                <li className={`${styles.list_item}`}>
                  <a href="">Privacy policy</a>
                </li>
              </ul>
            </div>

            <div className={`${styles.contact} col-span-2 `}>
              <h6 className={`${styles.header_title}`}>Contact</h6>
              <ul className={`${styles.list_menu}  content-center`}>
                <li className={`${styles.list_item}`}>
                  <a href="">356 Cach Mang Thang 8, HCM city</a>
                </li>
                <li className={`${styles.list_item}`}>
                  <a href="">tysonNg@gmail.com</a>
                </li>

                <li className={`${styles.list_item}`}>
                  <a href="">929-242-6868</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.bottom_footer} `}>
        <div className={`${styles.bottom_footer_container} flex justify-between`}>
            <div className={`${styles.text} grid-start-1`}>
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
