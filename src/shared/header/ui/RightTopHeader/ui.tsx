import styles from './social.module.scss'
export const RightTopHeader = () => {
       return (
        <div className='flex gap-10 '>
            <ul className={`${styles.social} flex flex-row flex-wrap gap-10 text-sm`}>
                <li className={styles.social__facebook}>Shipping & return</li>
                <li>Track order</li>
            </ul>
        </div>
            
       )
    
}