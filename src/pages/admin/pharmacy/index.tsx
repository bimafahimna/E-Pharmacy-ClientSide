import * as constants from "../../../constants/pharmacy";
import * as formatTable from "../../../utils/formatTable";
import Filter from "../../../components/Filter";
import Modal from "../../../components/Modal";
import Pagination from "../../../components/Pagination";
import PharmacyForm from "../../../components/PharmacyForm";
import Sort from "../../../components/Sort";
import SortButton from "../../../components/SortButton";
import headerStyle from "../../../css/admin_header.module.css";
import tableStyle from "../../../css/table.module.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RxDividerVertical } from "react-icons/rx";
import { pharmacy, ResponseError } from "../../../utils/types";
import { useAppDispatch, useAppSelector } from "../../../hooks/useApp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addPageNumber,
  getPharmacyPaginated,
  reducePageNumber,
  setDeletedID,
  setEditedID,
  setFilters,
  setSortBy,
  toggleSortBy,
} from "../../../stores/PharmacyReducer";
import clsx from "clsx";
import LoaderCirle from "../../../components/Spinner/circle";

export default function PharmacyPage() {
  const { paginated } = useAppSelector((state) => state.pharmacy);
  const AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const [shouldShowAddModal, onRequestCloseAddModal] = useState<boolean>(false);
  const [_shouldShowEditModal, onRequestCloseEditModal] =
    useState<boolean>(false);
  const [_shouldShowDeleteModal, onRequestCloseDeleteModal] =
    useState<boolean>(false);
  const [_onEditPharmacyID, setOnEditPharmacyID] = useState<
    pharmacy | undefined
  >();

  const handleGetPage = async () => {
    try {
      await AppDispatch(getPharmacyPaginated()).unwrap();
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  const handleAddPage = () => {
    AppDispatch(addPageNumber());
    handleGetPage();
  };

  const handleReducePage = () => {
    AppDispatch(reducePageNumber());
    handleGetPage();
  };

  const handleSort = (sortBy: keyof pharmacy, sort?: "asc" | "desc") => {
    if (sort !== undefined) AppDispatch(setSortBy({ sortBy, sort }));
    else AppDispatch(toggleSortBy(sortBy));
    handleGetPage();
  };

  const handleFilter = (
    active: boolean,
    field: keyof pharmacy,
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
    constants.PharmacyTableKeys.map((item, index) => (
      <th key={index}>
        <div className={tableStyle.sort_wrapper}>
          {formatTable.Header(item.toString())}
          {constants.PharmacySortKeys.includes(item) && (
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
  const PharmacyActions = ({ content }: { content: pharmacy }) => (
    <div className={headerStyle.buttons}>
      <button
        title="Edit"
        className={headerStyle.edit_button}
        onClick={() => {
          onRequestCloseEditModal(true);
          setOnEditPharmacyID(content);
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
          setOnEditPharmacyID(content);
          AppDispatch(setDeletedID(Number(content.id)));
        }}
      >
        <FaRegTrashAlt />
      </button>
    </div>
  );

  return (
    <>
      <div className={headerStyle.wrapper}>
        <h1>Pharmacy Management</h1>
        <button onClick={() => onRequestCloseAddModal(true)}>
          Add new pharmacy
        </button>
      </div>
      <div className={headerStyle.table_filter_wrapper}>
        <div className={headerStyle.filter_sort_wrapper}>
          <Sort<pharmacy>
            properties={constants.PharmacySortKeys}
            onSort={handleSort}
            sort={paginated.query.sort}
            sortBy={paginated.query.sortBy}
            isLoading={paginated.isLoading}
          />
          <RxDividerVertical size={"1.2rem"} />
          <Filter<pharmacy>
            properties={constants.PharmacyFilterKeys}
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
                {paginated.data.map((content, index) => (
                  <tr key={index}>
                    <td title={content.name}>{content.name}</td>
                    <td title={content.pharmacist.name}>
                      {content.pharmacist.name}
                    </td>
                    <td title={content.partner.name}>{content.partner.name}</td>
                    <td title={content.address}>{content.address}</td>
                    <td title={content.city.name}>{content.city.name}</td>
                    <td>
                      <div>
                        <p
                          className={clsx({
                            [tableStyle.true]: content.is_active == "true",
                            [tableStyle.false]: content.is_active == "false",
                          })}
                        >
                          {content.is_active}
                        </p>
                      </div>
                    </td>
                    <td className={tableStyle.static_action}>
                      <PharmacyActions content={content} />
                    </td>
                  </tr>
                ))}
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
      {shouldShowAddModal && (
        <Modal
          shouldShow={shouldShowAddModal}
          onRequestClose={onRequestCloseAddModal}
        >
          <PharmacyForm onRequestClose={onRequestCloseAddModal} />
        </Modal>
      )}
    </>
  );
}
