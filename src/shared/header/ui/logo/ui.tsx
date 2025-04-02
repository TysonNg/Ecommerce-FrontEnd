import Image from "next/image"
import Link from "next/link"

export const Logo = () => {
   return (
        <Link className="logo" href="/">
            <Image 
            alt= "e-shop"
            className="logo__image"
            priority
            src="/logo-header.png"
            width={150}
            height={100}
            />
        
        </Link>

   )
}