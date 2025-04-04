import Image from "next/image"
import { useRouter } from "next/navigation"
export const Logo = () => {
    const router = useRouter()
    const goToHomePage =() => {
        router.replace('/')
    }

    return (
            <Image 
            onClick={goToHomePage}
            alt= "e-shop"
            className="logo__image cursor-pointer"
            priority
            src="/logo-header.png"
            width={150}
            height={100}
            />
   )
}