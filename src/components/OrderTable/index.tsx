import * as constants from "../../constants/order";
import * as formatTable from "../../utils/formatTable";
import { LuEye } from "react-icons/lu";
import Modal from "../Modal";
import Pagination from "../Pagination";
import SortButton from "../SortButton";
import headerStyle from "../../css/admin_header.module.css";
import tableStyle from "../../css/table.module.css";
import style from "./index.module.css";
import {
  pharmacistOrder,
  pharmacistOrderItems,
  ResponseError,
} from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addOrdersPageNumber,
  cancelPharmacistOrder,
  getPharmacistOrderPaginated,
  reduceOrdersPageNumber,
  sentPharmacistOrder,
  setOrdersFilters,
  setOrdersPatchID,
  setOrdersSortBy,
  toggleOrdersSortBy,
} from "../../stores/PharmacyProductReducer";
import Prompt from "../DeletePrompt";
import clsx from "clsx";
import formatPrice from "../../utils/formatPrice";
import LoaderCirle from "../Spinner/circle";

export default function OrderTable() {
  const { paginated } = useAppSelector((state) => state.pharmacyProduct.orders);
  const AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const [shouldShowAddModal, onRequestCloseAddModal] = useState<boolean>(false);
  const [shouldShowCancelModal, onRequestCloseCancelModal] =
    useState<boolean>(false);
  const [onEditOrderID, setOnEditOrderID] = useState<
    pharmacistOrder | undefined
  >();
  const [dropdown, setDropdown] = useState<number>(-1);
  const [activeField, setActiveField] = useState<number>(
    constants.PharmacistOrderStatus.findIndex(
      (item) => item == paginated.query.filters.status[1]
    )
  );

  const handleGetPage = async () => {
    try {
      await AppDispatch(getPharmacistOrderPaginated()).unwrap();
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleAddPage = () => {
    AppDispatch(addOrdersPageNumber());
    handleGetPage();
  };

  const handleReducePage = () => {
    AppDispatch(reduceOrdersPageNumber());
    handleGetPage();
  };

  const handleSort = (sortBy: keyof pharmacistOrder, sort?: "asc" | "desc") => {
    if (sort !== undefined) AppDispatch(setOrdersSortBy({ sortBy, sort }));
    else AppDispatch(toggleOrdersSortBy(sortBy));
    handleGetPage();
  };

  const handleFilter = (
    active: boolean,
    field: keyof pharmacistOrder,
    contain: string
  ) => {
    AppDispatch(setOrdersFilters({ active, field, contain }));
  };

  useEffect(() => {
    handleGetPage();
  }, [paginated.query.filters]);

  const RowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${
      constants.PharmacistOrderTableKeys.length
    }, ${100 / constants.PharmacistOrderTableKeys.length}%)`,
    maxWidth: "100%",
  };

  const Headers = ({ items }: { items: (keyof pharmacistOrder)[] }) => (
    <th style={RowStyle}>
      {items.map((item, index) => (
        <div className={tableStyle.sort_wrapper} key={index}>
          {formatTable.Header(item.toString())}
          {constants.PharmacistOrderTableSortKeys.includes(item) && (
            <button
              className={tableStyle.sort_button}
              onClick={() => handleSort(item)}
            >
              {paginated.query.sortBy === item && (
                <SortButton variant={paginated.query.sort} />
              )}
              {paginated.query.sortBy !== item && <SortButton />}
            </button>
          )}
        </div>
      ))}
    </th>
  );

  const OrderDetails = ({
    index,
    content,
  }: {
    index: number;
    content: pharmacistOrder;
  }) => (
    <tr
      style={{
        visibility: dropdown === index ? "visible" : "hidden",
        maxHeight: dropdown === index ? "max-content" : "0",
        display: dropdown === index ? "table-row" : "block",
        overflow: "hidden",
      }}
    >
      <td
        style={{
          maxWidth: "100%",
        }}
      >
        <div className={style.dropdown}>
          <div className={style.contact}>
            <div className={style.products}>
              <h3>{content.contact_name}</h3>
              <p>{content.contact_phone}</p>
            </div>
            <div>
              <p>{content.address}</p>
            </div>
          </div>
          <OrderItems orderItems={content.order_items} />
          <div className={style.products}>
            <p>
              <b>Order</b> Amount
            </p>
            <p>{formatPrice(Number(content.order_amount))}</p>
          </div>
          <div className={style.products}>
            <p>
              <b>Logistic</b> {content.logistic_name}
            </p>
            <p>{formatPrice(Number(content.logistic_cost))}</p>
          </div>
        </div>
      </td>
    </tr>
  );

  const OrderItems = ({ orderItems }: { orderItems: pharmacistOrderItems[] }) =>
    orderItems.map((item, index) => (
      <div className={style.products} key={index}>
        <div>
          <p>{item.id}</p>
          <p>{item.name}</p>
          <img src={item.image_url} />
        </div>
        <div>
          <p>{item.quantity} x</p>
          <p>{formatPrice(Number(item.price))}</p>
        </div>
      </div>
    ));

  const OrderActions = ({
    index,
    content,
  }: {
    index: number;
    content: pharmacistOrder;
  }) => (
    <div className={headerStyle.buttons}>
      <button
        title="See details"
        className={headerStyle.edit_button}
        onClick={() => {
          setOnEditOrderID(content);
          setDropdown(dropdown === index ? -1 : index);
        }}
      >
        <LuEye />
      </button>
      {activeField === 1 && !paginated.isLoading && (
        <>
          <button
            title="Mark as sent"
            className={headerStyle.edit_button}
            onClick={() => {
              onRequestCloseAddModal(true);
              setOnEditOrderID(content);
              AppDispatch(setOrdersPatchID(Number(content.order_id)));
            }}
            disabled={paginated.isLoading}
          >
            Mark as sent
          </button>
          <button
            title="Cancel"
            className={headerStyle.delete_button}
            onClick={() => {
              onRequestCloseCancelModal(true);
              setOnEditOrderID(content);
              AppDispatch(setOrdersPatchID(Number(content.order_id)));
            }}
            disabled={paginated.isLoading}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );

  const OrderRows = ({
    pharmacistOrder,
  }: {
    pharmacistOrder: pharmacistOrder[];
  }) =>
    pharmacistOrder.map((content, index) => (
      <Fragment key={index}>
        <tr>
          <td style={RowStyle}>
            {constants.PharmacistOrderTableKeys.map((item, index) => (
              <div key={index}>{content[item].toString()}</div>
            ))}
          </td>
          <td className={tableStyle.static_action}>
            <div className={headerStyle.buttons}>
              <OrderActions index={index} content={content} />
            </div>
          </td>
        </tr>
        <OrderDetails index={index} content={content} />
      </Fragment>
    ));

  const StatusButtons = () =>
    constants.PharmacistOrderStatus.map((item, index) => (
      <button
        onClick={() => {
          handleFilter(true, "status", item);
          setDropdown(-1);
          setActiveField(index);
        }}
        className={clsx(style.status_button, {
          [style.is_active]: item === paginated.query.filters.status[1],
        })}
        key={index}
      >
        <p
          style={{
            color:
              index === activeField
                ? constants.OrderStatusColor[activeField][0]
                : "var(--quarternary-color)",
          }}
        >
          {item}
        </p>
      </button>
    ));

  return (
    <>
      <div className={headerStyle.wrapper}>
        <h2>Order Management</h2>
      </div>
      <div className={headerStyle.table_filter_wrapper}>
        <div className={headerStyle.tab_slider}>
          <StatusButtons />
          <div
            className={style.line}
            style={{
              transform: `translateX(${activeField * 100}%)`,
              borderBottom:
                "1px solid " + constants.OrderStatusColor[activeField][0],
              backgroundColor: constants.OrderStatusColor[activeField][1],
            }}
          ></div>
        </div>
        <div className={tableStyle.wrapper_table_sticky}>
          {paginated.data.length !== 0 && !paginated.isLoading && (
            <table
              className={clsx(
                tableStyle.table,
                tableStyle.two_rows_alternating
              )}
            >
              <thead>
                <tr>
                  <Headers items={constants.PharmacistOrderTableKeys} />
                  <th className={tableStyle.static_action}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <OrderRows pharmacistOrder={paginated.data} />
              </tbody>
            </table>
          )}

          {paginated.data.length === 0 && !paginated.isLoading && (
            <div className={tableStyle.no_data}>
              <p>No data available</p>
            </div>
          )}
          {paginated.isLoading && (
            <div className={tableStyle.no_data}>
              <LoaderCirle />
            </div>
          )}

          <Pagination
            limit={paginated.query.limit}
            pagination={paginated.pagination}
            onAddPage={handleAddPage}
            onReducePage={handleReducePage}
            className={tableStyle.center}
          />
        </div>
      </div>
      {onRequestCloseAddModal && (
        <Modal
          shouldShow={shouldShowAddModal}
          onRequestClose={onRequestCloseAddModal}
        >
          {onEditOrderID !== undefined && (
            <Prompt
              entities="Order"
              name={"order with the id of " + onEditOrderID.order_id}
              onRequestClose={onRequestCloseAddModal}
              onDelete={() => {
                AppDispatch(sentPharmacistOrder()).then(() =>
                  onRequestCloseAddModal(false)
                );
              }}
              action="Mark as sent"
            />
          )}
        </Modal>
      )}

      {shouldShowCancelModal && (
        <Modal
          shouldShow={shouldShowCancelModal}
          onRequestClose={onRequestCloseCancelModal}
        >
          {onEditOrderID !== undefined && (
            <Prompt
              entities="Order"
              name={"order with the id of " + onEditOrderID.order_id}
              onRequestClose={onRequestCloseCancelModal}
              onDelete={() => {
                AppDispatch(cancelPharmacistOrder()).then(() =>
                  onRequestCloseCancelModal(false)
                );
              }}
              action="Proceed Cancel"
            />
          )}
        </Modal>
      )}
    </>
  );
}
