import Image from "next/image"
import Link from "next/link"

export const Logo = () => {
   return (
        <Link className="logo flex justify-center" href="/">
            <Image 
            alt= "e-shop"
            className="logo__image"
            priority
            src="/logo1.png"
            width={300}
            height={300}
            />
        
        </Link>

   )
}