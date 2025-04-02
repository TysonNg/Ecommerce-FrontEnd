import Image from "next/image";

export default function NotFoundProducts() {
    return (
            <div className='text-center justify-items-center'>
                <Image src={'/no_products.png'} alt="noproducts" width={400} height={200} />
            </div>
    );
}