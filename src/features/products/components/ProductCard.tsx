import Image from "next/image";
import styles from './productCard.module.scss'

interface ProductCardProps {
    _id: string;
    product_name: string;
    product_price:number;
    product_thumb: string;
    product_prevPrice: string;
    product_slug: string;
}

interface Products {
    products: ProductCardProps[]
}


export  function ProductGrid(props : Products) {
    const {products} = props
    console.log(products);
    
    return (
        <div className={`${styles.productCard_container} `}>
            <ul className={`${styles.prroductCart_list} grid grid-cols-12 mb-20`}>
                {products.map(product => (
                    <ProductCard key={product._id} {...product}/>
                ))}          
            </ul>
           
        </div>
    )
}

export  function ProductCard(props: ProductCardProps) {
    const {_id,product_name,product_price, product_thumb, product_prevPrice, product_slug} = props;
    if(product_prevPrice){
        return(
            <li key={_id} className=" col-span-3 rounded-lg bg-white text-dark gap-2 p-4" >
            <div className={`${styles.thumbnail} relative`}>
                <a href={`/products/${_id}/${product_slug}`}>
                    <span className={`${styles.saleTag} absolute top-3 left-3 border border-[#dce3e5] bg-white rounded-2xl text-xs text-[#48515b] p-1.5`}>Sale!</span>
                    <Image src={product_thumb} alt={product_name} width= {300} height={300} />                            
                </a>
            </div>
            <div>
                <a href={`/products/${_id}`} className={`${styles.productName} text-sm font-semibold`}>{product_name}</a>
                <p>
                    <span className="text-xs line-through text-[#48515b]">${product_prevPrice}.00</span>
                    <span className="text-xs font-semibold pl-2">${product_price}.00</span> 
                </p>
            </div>
            
        </li>
        )
    }
    return (
        <li key={_id} className=" col-span-3 rounded-lg bg-white text-dark gap-2 p-4" >
            <div className={`${styles.thumbnail}`}>
                <a href={`/products/${_id}/${product_slug}`}>
                <Image src={product_thumb} alt={product_name} width= {300} height={300} />
                </a>
            </div>
            
            <a href={`/products/${_id}/`} className={`${styles.productName} text-sm font-semibold`}>{product_name}</a>
            <p className="text-xs font-semibold">${product_price}.00</p>
        </li>
    )
}
