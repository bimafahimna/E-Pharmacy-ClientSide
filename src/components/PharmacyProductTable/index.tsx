import * as constants from "../../constants/pharmacyProduct";
import * as formatTable from "../../utils/formatTable";
import Filter from "../Filter";
import Modal from "../Modal";
import Pagination from "../Pagination";
import Sort from "../Sort";
import SortButton from "../SortButton";
import headerStyle from "../../css/admin_header.module.css";
import tableStyle from "../../css/table.module.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RxDividerVertical } from "react-icons/rx";
import { pharmacyProduct, ResponseError } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addPharmacyPageNumber,
  deletePharmacyProductByID,
  getMasterProductPaginated,
  getPharmacyProductPaginated,
  reducePharmacyPageNumber,
  setPharmacyDeletedID,
  setPharmacyEditedID,
  setPharmacyFilters,
  setPharmacySortBy,
  togglePharmacySortBy,
} from "../../stores/PharmacyProductReducer";
import PharmacyProductEditForm from "../PharmacyProductEditForm";
import Prompt from "../DeletePrompt";
import LoaderCirle from "../Spinner/circle";
import clsx from "clsx";

export default function PharmacyProductsTable() {
  const { paginated } = useAppSelector(
    (state) => state.pharmacyProduct.pharmacyProduct
  );
  const AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const [shouldShowEditModal, onRequestCloseEditModal] =
    useState<boolean>(false);
  const [shouldShowDeleteModal, onRequestCloseDeleteModal] =
    useState<boolean>(false);
  const [onEditProductID, setOnEditProductID] = useState<
    pharmacyProduct | undefined
  >();

  const handleGetPage = async () => {
    try {
      await AppDispatch(getPharmacyProductPaginated()).unwrap();
      await AppDispatch(getMasterProductPaginated()).unwrap();
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleAddPage = () => {
    AppDispatch(addPharmacyPageNumber());
    handleGetPage();
  };

  const handleReducePage = () => {
    AppDispatch(reducePharmacyPageNumber());
    handleGetPage();
  };

  const handleDelete = () => {
    AppDispatch(deletePharmacyProductByID()).then(() => {
      onRequestCloseDeleteModal(false);
      handleGetPage();
    });
  };

  const handleSort = (sortBy: keyof pharmacyProduct, sort?: "asc" | "desc") => {
    if (sort !== undefined) AppDispatch(setPharmacySortBy({ sortBy, sort }));
    else AppDispatch(togglePharmacySortBy(sortBy));
    handleGetPage();
  };

  const handleFilter = (
    active: boolean,
    field: keyof pharmacyProduct,
    contain: string
  ) => {
    AppDispatch(setPharmacyFilters({ active, field, contain }));
  };

  useEffect(() => {
    const debounceTimeID = setTimeout(() => handleGetPage(), 1000);
    return () => {
      clearTimeout(debounceTimeID);
    };
  }, [paginated.query.filters]);

  const Headers = ({ item }: { item: keyof pharmacyProduct }) => (
    <th>
      <div className={tableStyle.sort_wrapper}>
        {formatTable.Header(item.toString())}
        {constants.PharmacyProductSortKeys.includes(item) && (
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
        <h2>Pharmacy Product</h2>
      </div>
      <div className={headerStyle.table_filter_wrapper}>
        <div className={headerStyle.filter_sort_wrapper}>
          <Sort<pharmacyProduct>
            properties={constants.PharmacyProductSortKeys}
            onSort={handleSort}
            isLoading={paginated.isLoading}
            sort={paginated.query.sort}
            sortBy={paginated.query.sortBy}
          />
          <RxDividerVertical size={"1.2rem"} />
          <Filter<pharmacyProduct>
            properties={constants.PharmacyProductKeys}
            onFilter={handleFilter}
            filters={paginated.query.filters}
          />
        </div>
        <div className={tableStyle.wrapper_table_sticky}>
          {paginated.data.length !== 0 && !paginated.isLoading && (
            <table className={tableStyle.table}>
              <thead>
                <tr>
                  {constants.PharmacyProductKeys.map((item, index) => (
                    <Headers item={item} key={index} />
                  ))}
                  <th className={tableStyle.static_action}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginated.data.map((content, index) => {
                  return (
                    <tr key={index}>
                      {constants.PharmacyProductKeys.slice(0, -1).map(
                        (item) => (
                          <td key={item} title={content[item].toString()}>
                            {content[item].toString()}
                          </td>
                        )
                      )}

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
                              AppDispatch(
                                setPharmacyEditedID(Number(content.product_id))
                              );
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
                              AppDispatch(
                                setPharmacyDeletedID(Number(content.product_id))
                              );
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
        <Pagination
          limit={paginated.query.limit}
          pagination={paginated.pagination}
          onAddPage={handleAddPage}
          onReducePage={handleReducePage}
          isLoading={paginated.isLoading}
          className={tableStyle.center}
        />
      </div>

      {shouldShowEditModal && (
        <Modal
          shouldShow={shouldShowEditModal}
          onRequestClose={onRequestCloseEditModal}
        >
          {onEditProductID !== undefined && (
            <PharmacyProductEditForm
              pharmacyProduct={onEditProductID}
              onRequestClose={onRequestCloseEditModal}
            />
          )}
        </Modal>
      )}
      {
        <Modal
          shouldShow={shouldShowDeleteModal}
          onRequestClose={onRequestCloseDeleteModal}
        >
          {onEditProductID !== undefined && (
            <Prompt
              entities={"Pharmacy Product"}
              name={onEditProductID.name}
              onRequestClose={onRequestCloseDeleteModal}
              onDelete={handleDelete}
            />
          )}
        </Modal>
      }
    </>
  );
}
