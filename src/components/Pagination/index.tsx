import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { pagination } from "../../utils/types";
import style from "./index.module.css";
import { ComponentProps } from "react";

interface paginationProps extends ComponentProps<"div"> {
  limit?: number;
  pagination: pagination;
  onAddPage: () => void;
  onReducePage: () => void;
  isLoading?: boolean;
}

const Pagination: React.FC<paginationProps> = ({
  pagination,
  onAddPage,
  onReducePage,
  isLoading = false,
  ...rest
}) => {
  return (
    <div className={[style.wrapper, rest.className].join(" ")}>
      <div className={style.nav_pages}>
        <button
          onClick={() => onReducePage()}
          disabled={
            !pagination.prev_page || isLoading || pagination.current_page === 1
          }
        >
          <MdKeyboardArrowLeft size={20} />
        </button>
        {pagination.current_page !== 1 &&
          pagination.current_page - 1 == 0 &&
          !pagination.next_page && <button>...</button>}
        {pagination.current_page !== 1 && (
          <button onClick={() => onReducePage()} disabled={isLoading}>
            {pagination.current_page - 1}
          </button>
        )}
        <button className={style.current_page} disabled={true}>
          {pagination.current_page}
        </button>
        {pagination.current_page >= 1 && pagination.next_page && (
          <button
            onClick={() => onAddPage()}
            disabled={!pagination.next_page || isLoading}
          >
            {pagination.current_page + 1}
          </button>
        )}
        {pagination.current_page === 1 && <button>...</button>}
        <button
          onClick={() => onAddPage()}
          disabled={!pagination.next_page || isLoading}
        >
          <MdKeyboardArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
