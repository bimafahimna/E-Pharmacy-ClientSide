import * as constants from "../../../constants/masterProduct";
import * as formatTable from "../../../utils/formatTable";
import Filter from "../../../components/Filter";
import MasterProductForm from "../../../components/MasterProductForm";
import Modal from "../../../components/Modal";
import Pagination from "../../../components/Pagination";
import Sort from "../../../components/Sort";
import SortButton from "../../../components/SortButton";
import headerStyle from "../../../css/admin_header.module.css";
import tableStyle from "../../../css/table.module.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RxDividerVertical } from "react-icons/rx";
import { masterProduct, ResponseError } from "../../../utils/types";
import { useAppDispatch, useAppSelector } from "../../../hooks/useApp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addPageNumber,
  getMasterProductPaginated,
  reducePageNumber,
  setDeletedID,
  setEditedID,
  setFilters,
  setSortBy,
  toggleSortBy,
} from "../../../stores/MasterProductReducer";
import clsx from "clsx";
import LoaderCirle from "../../../components/Spinner/circle";
import CategoryProductForm from "../../../components/ProductCategoryForm";

export default function ProductsPage() {
  const { paginated } = useAppSelector((state) => state.masterProduct);
  const AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const [shouldShowAddModal, onRequestCloseAddModal] = useState<boolean>(false);
  const [shouldShowAddCategoryModal, onRequestCloseAddCategoryModal] =
    useState<boolean>(false);
  const [_shouldShowEditModal, onRequestCloseEditModal] =
    useState<boolean>(false);
  const [_shouldShowDeleteModal, onRequestCloseDeleteModal] =
    useState<boolean>(false);
  const [_onEditProductID, setOnEditProductID] = useState<
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
  useEffect(() => {
    handleGetPage();
  }, []);

  const handleAddPage = () => {
    AppDispatch(addPageNumber());
    handleGetPage();
  };

  const handleReducePage = () => {
    AppDispatch(reducePageNumber());
    handleGetPage();
  };

  const handleSort = (sortBy: keyof masterProduct, sort?: "asc" | "desc") => {
    if (sort !== undefined) AppDispatch(setSortBy({ sortBy, sort }));
    else AppDispatch(toggleSortBy(sortBy));
    handleGetPage();
  };

  const handleFilter = (
    active: boolean,
    field: keyof masterProduct,
    contain: string
  ) => {
    AppDispatch(setFilters({ active, field, contain }));
  };

  useEffect(() => {
    const debounceTimeID = setTimeout(() => handleGetPage(), 1000);
    return () => {
      clearTimeout(debounceTimeID);
    };
  }, [paginated.query.filters]);

  const Headers = () =>
    constants.MasterProductKeys.map((item, index) => (
      <th key={index}>
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
    ));

  return (
    <>
      <div className={headerStyle.wrapper}>
        <h1>Product Management</h1>
        <button onClick={() => onRequestCloseAddCategoryModal(true)}>
          Add new product category
        </button>
        <button onClick={() => onRequestCloseAddModal(true)}>
          Add new product
        </button>
      </div>
      <div className={headerStyle.table_filter_wrapper}>
        <div className={headerStyle.filter_sort_wrapper}>
          <Sort<masterProduct>
            properties={constants.MasterProductSortKeys}
            onSort={handleSort}
            sort={paginated.query.sort}
            sortBy={paginated.query.sortBy}
            isLoading={paginated.isLoading}
          />
          <RxDividerVertical size={"1.2rem"} />
          <Filter<masterProduct>
            properties={constants.MasterProductKeys}
            onFilter={handleFilter}
            filters={paginated.query.filters}
            className={tableStyle.filter_wrapper}
          />
          <Pagination
            limit={paginated.query.limit}
            pagination={paginated.pagination}
            onAddPage={handleAddPage}
            onReducePage={handleReducePage}
            isLoading={paginated.isLoading}
          />
        </div>
        <div className={tableStyle.wrapper_table_sticky}>
          {paginated.data.length !== 0 && !paginated.isLoading && (
            <table className={tableStyle.table}>
              <thead>
                <tr>
                  <Headers />
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
                            title="Edit"
                            className={headerStyle.edit_button}
                            onClick={() => {
                              onRequestCloseEditModal(true);
                              setOnEditProductID(content);
                              AppDispatch(setEditedID(Number(content.id)));
                            }}
                          >
                            <MdEdit />
                          </button>
                          <button
                            title="Delete"
                            className={headerStyle.delete_button}
                            onClick={() => {
                              onRequestCloseDeleteModal(true);
                              setOnEditProductID(content);
                              AppDispatch(setDeletedID(Number(content.id)));
                            }}
                          >
                            <FaRegTrashAlt />
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
      </div>
      {shouldShowAddCategoryModal && (
        <Modal
          shouldShow={shouldShowAddCategoryModal}
          onRequestClose={onRequestCloseAddCategoryModal}
        >
          <CategoryProductForm
            onRequestClose={onRequestCloseAddCategoryModal}
          />
        </Modal>
      )}
      {shouldShowAddModal && (
        <Modal
          shouldShow={shouldShowAddModal}
          onRequestClose={onRequestCloseAddModal}
        >
          <MasterProductForm onRequestClose={onRequestCloseAddModal} />
        </Modal>
      )}
    </>
  );
}
