import { Logo } from "./logo";
import { Navbar } from "./navbar";
import { SearchBar } from "./search/ui";
import { Social } from "./social";
import { Supports } from "./support";
import styles from "./ui.module.scss";

export const Header = () => {
  return (
    <header>
      <div className="container-fluid">
        <div className=" bg-[#0769da]">
          <div
            className={`${styles.top_header_container} grid grid-cols-5 py-5 text-white`}
          >
            <div className=" col-start-1">
              <Supports />
            </div>
            <div className="col-end-13">
              <Social />
            </div>
          </div>
        </div>

        <div className={`bg-[#0573f0] py-5`}>
          <div
            className={`${styles.header_container} grid grid-cols-12 gap-4 items-center text-white`}
          >
            <div className="col-span-1 items-center col-start-1 ">
              <Logo />
            </div>
            <div className="col-span-3 col-end-13 ">
              <SearchBar />
            </div>
          </div>
        </div>

        <div className="bg-[#0573f0] text-white">
          <Navbar />
        </div>
      </div>
    </header>
  );
};
