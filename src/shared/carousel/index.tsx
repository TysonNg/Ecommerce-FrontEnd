'use client';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image';
import styles  from './carousel.module.scss'
import React, { useEffect } from 'react'

export default function Carousel() {
    
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

    // const [emblaRef] = useEmblaCarousel()
    
    useEffect(() => {
      if (emblaApi) {
        console.log(emblaApi.slideNodes()) // Access API
      }
    }, [emblaApi])

    type Slide = {
        url: string,
        alt: string
    }
    
    const slides: Slide[] = [
        {
            url: '/banner.jpg' , alt: ""
        }
    ]
    
    return (
      
        <div className={`${styles.banner_container} object-contain`}>
         <Image className={`${styles.banner}`} alt='name' src={'/banner.jpg'} width={1920} height={800}/>
        </div>

    )
}


  {/* {slides.map(slide => {
                return (
                    <Image key={slides.indexOf(slide)} className={`${styles.embla__slide}`} src={slide.url} alt={slide.alt} width={1920} height={672} quality={100}/>
                )
            })} */}