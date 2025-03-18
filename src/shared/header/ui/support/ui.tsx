import styles from './supports.module.scss'

export const Supports = () => {
       return (
        <div className={`${styles.supports_container}`}>
            <ul className='supports flex flex-row flex-wrap gap-10 basis-1/3 '>
                <li className='supports__FAQ'>FAQs</li>
                <li className='supports__help'>Help</li>
                <li className='supports__support'>Support</li>
            </ul>

        </div>
            
       )
}