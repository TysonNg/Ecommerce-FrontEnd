'use client'
import { useState, useRef, useEffect } from "react"
import styles from '../../../../app/(pages)/products/[productId]/[slug]/detail.module.scss'

interface ProductInfo {
  _id: string;
  product_name: string;
  product_price: number;
  product_description: string;
  product_images: string[];
  product_prevPrice: string;
  product_attributes: {
    brand: string;
    material: string;
    model: string;
  };
  product_type: string;
  product_shop: string;
  product_thumb: string;
  product_slug: string;
  cartRem: number;
}


export function BtnToSlideImagesProduct ( {productDetails} : {productDetails : ProductInfo}) {
    const showcaseRef: React.RefObject<any> = useRef<any>(null)
    const [imgId, setImgId] = useState(1)
  
    const handleImageClick = (id: number) => {
        setImgId(id)
    }

    const slideImage = () => {
        if(showcaseRef.current){
            const displayWidth = showcaseRef.current.querySelector('img').clientWidth
            showcaseRef.current.style.transform = `translateX(${ - (imgId - 1) * displayWidth}px)`
        }     
    }
    
    useEffect(() => {
        slideImage();
        window.addEventListener('resize', slideImage);
        return () => window.removeEventListener('resize', slideImage);
    },[imgId])

    
    return(
        <div className={`${styles.detail_image} `}>
        <div className={`${styles.product_images_container}`}>
          <div className={`${styles.image_display}`}>
            <div className={`${styles.image_showcase}`} ref={showcaseRef}>
              {productDetails.product_images.map((image : string,i : number) => {
                return (
                    <img key={i} className="img" src={image} alt={image} />
                );
              })}
            </div>
          </div>

          {/* slide images */}
          
          <div className={`${styles.image_select}`}>
            {productDetails.product_images.length === 1 ? " ": productDetails.product_images.map((image : string,i : number) => {
              return (
                <div
                  key={i}
                  className={`${styles.image_item}`}
                >
                    <img className="" onClick={() => handleImageClick(i + 1)} src={image} alt={image} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
}