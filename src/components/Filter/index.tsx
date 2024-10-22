import { IoFilter } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { ComponentProps, Fragment, useState } from "react";
import * as formatTable from "../../utils/formatTable";
import style from "../../css/util.module.css";

interface FilterProps<T extends object> extends ComponentProps<"div"> {
  properties: (keyof T)[];
  onFilter: (active: boolean, field: keyof T, contain: string) => void;
  filters: {
    [properties in keyof T]: [boolean, string];
  };
}

type filterKeys<T extends object> = {
  [properties in keyof T]?: {
    active: boolean;
    field: boolean;
    contain: string;
  };
};

function Filter<T extends object>({
  properties,
  onFilter,
  filters,
  ...rest
}: FilterProps<T>) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpenFilters, setOpenFilters] = useState<filterKeys<T>>(
    properties.reduce<filterKeys<T>>(
      (prev, curr) => ({
        ...prev,
        [curr]: {
          active: false,
          field: false,
          contain: "",
        },
      }),
      {}
    )
  );

  const handleIsOpenFilters = (value: keyof T) => {
    setOpenFilters({
      ...isOpenFilters,
      [value]: {
        ...isOpenFilters[value],
        active: !isOpenFilters[value]!.active,
      },
    });
  };

  const handleSecondIsOpenFilters = (value: keyof T) => {
    setOpenFilters({
      ...isOpenFilters,
      [value]: {
        ...isOpenFilters[value],
        field: !isOpenFilters[value]!.field,
      },
    });
  };

  const handleOnChange = (field: keyof T, value: string) => {
    setOpenFilters({
      ...isOpenFilters,
      [field]: {
        ...isOpenFilters[field],
        contain: value,
      },
    });
  };

  const addFiltersButton = (item: keyof T) => (
    <button
      onClick={() => {
        handleIsOpenFilters(item);
        //onFilter(true, item, "");
        setOpen(false);
      }}
    >
      {formatTable.Filter(item.toString())}
    </button>
  );

  const addInputButton = (item: keyof T) => {
    if (
      (isOpenFilters[item] !== undefined && isOpenFilters[item].active) ||
      filters[item][0]
    )
      return (
        <div className={style.add_input_wrapper}>
          <button onClick={() => handleSecondIsOpenFilters(item)}>
            {formatTable.Filter(item.toString())}
          </button>
          <button
            onClick={() => {
              setOpenFilters({
                ...isOpenFilters,
                [item]: {
                  ...isOpenFilters[item],
                  active: false,
                  field: false,
                  contain: "",
                },
              });
              onFilter(false, item, "");
            }}
          >
            <IoMdClose />
          </button>
          {isOpenFilters[item]!.field && Input(item)}
        </div>
      );
    return <></>;
  };

  const Input = (item: keyof T) => (
    <div className={style.dropdown_inputs}>
      <p>
        <b>{formatTable.Filter(item.toString())}</b> contains
      </p>
      <input
        placeholder={"Type a value..."}
        onChange={(e) => {
          onFilter(true, item, e.target.value);
          handleOnChange(item, e.target.value);
        }}
        value={isOpenFilters[item]?.contain}
      ></input>
    </div>
  );

  return (
    <div {...rest} className={[style.wrapper, rest.className].join(" ")}>
      <IoFilter />
      <div className={style.wrapper}>
        <button
          onClick={() => setOpen(!isOpen)}
          className={style.add_filter_button}
        >
          + add filter
        </button>

        {isOpen && (
          <div className={style.add_filter_dropdown_buttons}>
            <p>Filter by</p>
            {properties.map((item, index) => (
              <Fragment key={index}>{addFiltersButton(item)}</Fragment>
            ))}
          </div>
        )}
      </div>
      {properties.map((item, index) => (
        <Fragment key={index}>{addInputButton(item)}</Fragment>
      ))}
    </div>
  );
}
export default Filter;
