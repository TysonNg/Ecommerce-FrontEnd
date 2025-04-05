import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
    FontAwesomeIcon,
  } from "@fortawesome/react-fontawesome";

export default function Loading() {
    return (
        <div className="w-[1200px] mx-auto my-auto">
            <FontAwesomeIcon icon={faSpinner} spin/>
        </div>
    );
}