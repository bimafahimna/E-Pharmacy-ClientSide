import { RiArrowDownSLine } from "react-icons/ri";
import { BiSortAlt2 } from "react-icons/bi";
import style from "../../css/util.module.css";
import { ComponentProps, useState } from "react";
import * as formatTable from "../../utils/formatTable";

interface SortProps<T extends object> extends ComponentProps<"div"> {
  onSort: (sortBy: keyof T, sort: "asc" | "desc") => void;
  properties: (keyof T)[];
  sort: "asc" | "desc";
  sortBy: keyof T;
  isLoading?: boolean;
}

export default function Sort<T extends object>({
  onSort,
  properties,
  sort,
  sortBy,
  isLoading = false,
  ...rest
}: SortProps<T>) {
  const [isOpen, setOpen] = useState<boolean>(false);

  const AddSortButton = ({ item }: { item: keyof T }) => (
    <div className={style.sort_button}>
      <button
        onClick={() => {
          onSort(item, formatTable.ToggleSort(sort));
        }}
        disabled={isLoading}
      >
        {formatTable.Filter(item.toString())}
      </button>
      {item === sortBy && (
        <button
          onClick={() => {
            onSort(item, formatTable.ToggleSort(sort));
          }}
          disabled={isLoading}
        >
          {sort}
        </button>
      )}
    </div>
  );

  const SortDisplay = () => {
    if (sortBy !== null)
      return (
        <button
          onClick={() => setOpen(!isOpen)}
          className={style.add_filter_button}
        >
          {formatTable.Filter(sortBy.toString())}
          <RiArrowDownSLine />
        </button>
      );
    return (
      <button
        onClick={() => setOpen(!isOpen)}
        className={style.add_filter_button}
      >
        + add sort
      </button>
    );
  };

  return (
    <div {...rest} className={[style.wrapper, rest.className].join(" ")}>
      <BiSortAlt2 />
      <SortDisplay />
      {isOpen && (
        <div className={style.add_filter_dropdown_buttons}>
          <p>Sort by</p>
          {properties.map((item, index) => (
            <AddSortButton item={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
