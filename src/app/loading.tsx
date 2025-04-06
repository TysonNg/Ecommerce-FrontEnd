import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
    FontAwesomeIcon,
  } from "@fortawesome/react-fontawesome";

export default function Loading() {
    return (
        <div className="xl:w-[1200px] sm:w-[700px] mx-auto my-auto text-center text-3xl">
            <FontAwesomeIcon icon={faSpinner} spin/>
        </div>
    );
}