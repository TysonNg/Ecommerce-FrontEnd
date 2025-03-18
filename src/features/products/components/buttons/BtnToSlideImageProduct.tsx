'use client'
import { useState, useRef, useEffect } from "react"
import styles from '../../../../app/(pages)/products/[productId]/[slug]/detail.module.scss'



export function BtnToSlideImagesProduct ( props: any) {
    const {productDetails} = props
    const showcaseRef = useRef<any>(null)
    const [imgId, setImgId] = useState(1)
  
    const handleImageClick = (id:any) => {
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
              {productDetails.product_images.map((image : any,i : any) => {
                return (
                    <img key={i} className="img" src={image} alt={image} />
                );
              })}
            </div>
          </div>

          {/* slide images */}
          
          <div className={`${styles.image_select}`}>
            {productDetails.product_images.length === 1 ? " ":productDetails.product_images.map((image : any,i : any) => {
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