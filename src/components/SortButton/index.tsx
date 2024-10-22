import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FaSort } from "react-icons/fa6";

const SortButton: React.FC<{ variant?: "asc" | "desc" }> = ({ variant }) => {
  if (variant === "asc")
    return <TiArrowSortedUp size={20} style={{ cursor: "pointer" }} />;
  if (variant === "desc")
    return <TiArrowSortedDown size={20} style={{ cursor: "pointer" }} />;
  return <FaSort size={20} style={{ cursor: "pointer" }} />;
};

export default SortButton;
