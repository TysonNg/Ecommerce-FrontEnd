import styles from './navbar.module.scss'



export const Navbar = () => {
  return (
    <nav className={`${styles.navbar} w-1200 grid-cols-12 grid items-center `}>
      <ul className="col-span-11 gap-15 pl-5 flex">
        <li>Home</li>
        <li>All products</li>
        <li>Audio & video</li>
        <li>New arrivals</li>
        <li>Today's deal</li>
        <li>Gift cards</li>
      </ul>
      <ul className=" col-span-1 gap-15 pr-20 flex justify-center">
        <li>Login </li>
        <li>Register</li>
      </ul>
    </nav>
  )
}
