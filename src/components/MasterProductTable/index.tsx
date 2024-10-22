import * as constants from "../../constants/masterProduct";
import * as formatTable from "../../utils/formatTable";
import Filter from "../Filter";
import Modal from "../Modal";
import Pagination from "../Pagination";
import PharmacyProductForm from "../PharmacyProductForm";
import Sort from "../Sort";
import SortButton from "../SortButton";
import headerStyle from "../../css/admin_header.module.css";
import tableStyle from "../../css/table.module.css";
import { RxDividerVertical } from "react-icons/rx";
import { masterProduct, ResponseError } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addMasterPageNumber,
  getMasterProductPaginated,
  reduceMasterPageNumber,
  setMasterEditedID,
  setMasterFilters,
  setMasterSortBy,
  toggleMasterSortBy,
} from "../../stores/PharmacyProductReducer";
import LoaderCirle from "../Spinner/circle";
import clsx from "clsx";

export default function MasterProductTable() {
  const { paginated } = useAppSelector(
    (state) => state.pharmacyProduct.masterProduct
  );
  const AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const [shouldShowAddModal, onRequestCloseAddModal] = useState<boolean>(false);
  const [onEditProductID, setOnEditProductID] = useState<
    masterProduct | undefined
  >();

  const handleGetPage = async () => {
    try {
      await AppDispatch(getMasterProductPaginated()).unwrap();
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleAddPage = () => {
    AppDispatch(addMasterPageNumber());
    handleGetPage();
  };

  const handleReducePage = () => {
    AppDispatch(reduceMasterPageNumber());
    handleGetPage();
  };

  const handleSort = (sortBy: keyof masterProduct, sort?: "asc" | "desc") => {
    if (sort !== undefined) AppDispatch(setMasterSortBy({ sortBy, sort }));
    else AppDispatch(toggleMasterSortBy(sortBy));
    handleGetPage();
  };

  const handleFilter = (
    active: boolean,
    field: keyof masterProduct,
    contain: string
  ) => {
    AppDispatch(setMasterFilters({ active, field, contain }));
  };

  useEffect(() => {
    const debounceTimeID = setTimeout(() => handleGetPage(), 1000);
    return () => {
      clearTimeout(debounceTimeID);
    };
  }, [paginated.query.filters]);

  const Headers = ({ item }: { item: keyof masterProduct }) => (
    <th>
      <div className={tableStyle.sort_wrapper}>
        {formatTable.Header(item.toString())}
        {constants.MasterProductSortKeys.includes(item) && (
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
    </th>
  );

  return (
    <>
      <div className={headerStyle.wrapper}>
        <h2>Master Products</h2>
      </div>
      <div className={headerStyle.table_filter_wrapper}>
        <div className={headerStyle.filter_sort_wrapper}>
          <Sort<masterProduct>
            properties={constants.MasterProductSortKeys}
            onSort={handleSort}
            isLoading={paginated.isLoading}
            sort={paginated.query.sort}
            sortBy={paginated.query.sortBy}
          />
          <RxDividerVertical size={"1.2rem"} />
          <Filter<masterProduct>
            properties={constants.MasterProductKeys}
            onFilter={handleFilter}
            filters={paginated.query.filters}
          />
        </div>
        <div className={tableStyle.wrapper_table_sticky}>
          {paginated.data.length !== 0 && !paginated.isLoading && (
            <table className={tableStyle.table}>
              <thead>
                <tr>
                  {constants.MasterProductKeys.map((item, index) => (
                    <Headers item={item} key={index} />
                  ))}
                  <th className={tableStyle.static_action}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginated.data.map((content, index) => {
                  return (
                    <tr key={index}>
                      {constants.MasterProductKeys.slice(0, -1).map((item) => (
                        <td key={item} title={content[item].toString()}>
                          {content[item].toString()}
                        </td>
                      ))}
                      <td title={content.is_active.toString()}>
                        <div>
                          <p
                            className={clsx({
                              [tableStyle.true]: content.is_active,
                              [tableStyle.false]: !content.is_active,
                            })}
                          >
                            {content.is_active.toString()}
                          </p>
                        </div>
                      </td>

                      <td className={tableStyle.static_action}>
                        <div className={headerStyle.buttons}>
                          <button
                            title="Add to pharmacy product"
                            className={headerStyle.edit_button}
                            onClick={() => {
                              onRequestCloseAddModal(true);
                              setOnEditProductID(content);
                              AppDispatch(
                                setMasterEditedID(Number(content.id))
                              );
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
        </div>
        <Pagination
          limit={paginated.query.limit}
          pagination={paginated.pagination}
          onAddPage={handleAddPage}
          onReducePage={handleReducePage}
          isLoading={paginated.isLoading}
          className={tableStyle.center}
        />
      </div>
      {onRequestCloseAddModal && (
        <Modal
          shouldShow={shouldShowAddModal}
          onRequestClose={onRequestCloseAddModal}
        >
          {onEditProductID !== undefined && (
            <PharmacyProductForm
              onRequestClose={onRequestCloseAddModal}
              masterProduct={onEditProductID}
            />
          )}
        </Modal>
      )}
    </>
  );
}
