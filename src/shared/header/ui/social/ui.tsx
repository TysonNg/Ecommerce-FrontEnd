import styles from './social.module.scss'
export const Social = () => {
       return (
        <div className='flex gap-10 '>
            <p>Socials: </p>
            <ul className={`${styles.social} flex flex-row flex-wrap gap-10`}>
                <li className={styles.social__facebook}>fb</li>
                <li className='social__twitter'>tw</li>
                <li className='social__instagram'>ig</li>
                <li className='social__youtube'>yt</li>
            </ul>
        </div>
            
       )
    
}