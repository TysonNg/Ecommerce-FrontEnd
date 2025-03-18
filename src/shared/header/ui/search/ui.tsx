
import styles from './search.module.scss'

export const SearchBar = () => {
    return (

        <div className={`${styles.searchBar}`}> 
            <form action="">
                <div className='flex flex-row justify-center '>
                    <input className={`${styles.searchBar__input} w-full bg-white text-black`} type="text" placeholder="Search for products..." />
                    <button className={`${styles.searchBar__btn} bg-zinc-400 text-white p-3 cursor-pointer hover:opacity-75`}>Search</button>
                </div>
            </form>
        </div>

    )
}