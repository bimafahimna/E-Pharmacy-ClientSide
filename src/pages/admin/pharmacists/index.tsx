import * as constants from "../../../constants/pharmacist";
import * as formatTable from "../../../utils/formatTable";
import Prompt from "../../../components/DeletePrompt";
import Filter from "../../../components/Filter";
import Modal from "../../../components/Modal";
import Pagination from "../../../components/Pagination";
import PharmacistsEditForm from "../../../components/PharmacistsEditForm";
import PharmacistsForm from "../../../components/PharmacistsForm";
import Sort from "../../../components/Sort";
import SortButton from "../../../components/SortButton";
import headerStyle from "../../../css/admin_header.module.css";
import tableStyle from "../../../css/table.module.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RxDividerVertical } from "react-icons/rx";
import { pharmacist, ResponseError } from "../../../utils/types";
import { useAppDispatch, useAppSelector } from "../../../hooks/useApp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addPageNumber,
  deletePharmacistByID,
  getPharmacistsPaginated,
  reducePageNumber,
  setDeletedID,
  setEditedID,
  setFilters,
  setSortBy,
  toggleSortBy,
} from "../../../stores/PharmacistReducer";
import LoaderCirle from "../../../components/Spinner/circle";
import clsx from "clsx";

export default function PharmacistsPage() {
  const { paginated } = useAppSelector((state) => state.pharmacist);
  const AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const [shouldShow, onRequestCloseAddModal] = useState<boolean>(false);
  const [shouldShowEditModal, onRequestCloseEditModal] =
    useState<boolean>(false);
  const [shouldShowDeleteModal, onRequestCloseDeleteModal] =
    useState<boolean>(false);
  const [onEditPharmacistID, setOnEditPharmacistID] = useState<
    pharmacist | undefined
  >();

  const handleGetPage = async () => {
    try {
      await AppDispatch(getPharmacistsPaginated()).unwrap();
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

  const handleDelete = () => {
    AppDispatch(deletePharmacistByID()).then(() => {
      onRequestCloseDeleteModal(false);
      handleGetPage();
    });
  };

  const handleSort = (sortBy: keyof pharmacist, sort?: "asc" | "desc") => {
    if (sort !== undefined) AppDispatch(setSortBy({ sortBy, sort }));
    else AppDispatch(toggleSortBy(sortBy));
    handleGetPage();
  };

  const handleFilter = (
    active: boolean,
    field: keyof pharmacist,
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
    constants.PharmacistKeys.map((item, index) => (
      <th key={index}>
        <div className={tableStyle.sort_wrapper}>
          {formatTable.Header(item.toString())}

          {constants.PharmacistSortKeys.includes(item) && (
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
        <h1>Pharmacists Management</h1>
        <button onClick={() => onRequestCloseAddModal(true)}>
          Add new pharmacist
        </button>
      </div>
      <div className={headerStyle.table_filter_wrapper}>
        <div className={headerStyle.filter_sort_wrapper}>
          <Sort<pharmacist>
            properties={constants.PharmacistSortKeys}
            onSort={handleSort}
            sort={paginated.query.sort}
            sortBy={paginated.query.sortBy}
            isLoading={paginated.isLoading}
          />
          <RxDividerVertical size={"1.2rem"} />
          <Filter<pharmacist>
            properties={constants.PharmacistFilterKeys}
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
                    {constants.PharmacistKeys.slice(0, -1).map(
                      (item, index) => (
                        <td title={content[item].toString()} key={index}>
                          {content[item].toString()}
                        </td>
                      )
                    )}

                    <td title={content.is_assigned.toString()}>
                      <div>
                        <p
                          className={clsx({
                            [tableStyle.true]: content.is_assigned,
                            [tableStyle.false]: !content.is_assigned,
                          })}
                        >
                          {content.is_assigned.toString()}
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
                            setOnEditPharmacistID(content);
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
                            setOnEditPharmacistID(content);
                            AppDispatch(setDeletedID(Number(content.id)));
                          }}
                        >
                          <FaRegTrashAlt />
                        </button>
                      </div>
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
      <Modal
        shouldShow={shouldShowEditModal}
        onRequestClose={onRequestCloseEditModal}
      >
        {onEditPharmacistID !== undefined && (
          <PharmacistsEditForm
            onRequestClose={onRequestCloseEditModal}
            ID={onEditPharmacistID.id}
          />
        )}
      </Modal>
      <Modal shouldShow={shouldShow} onRequestClose={onRequestCloseAddModal}>
        <PharmacistsForm onRequestClose={onRequestCloseAddModal} />
      </Modal>
      <Modal
        shouldShow={shouldShowDeleteModal}
        onRequestClose={onRequestCloseDeleteModal}
      >
        {onEditPharmacistID !== undefined && (
          <Prompt
            entities={"Pharmacist"}
            name={onEditPharmacistID.name}
            onRequestClose={onRequestCloseDeleteModal}
            onDelete={handleDelete}
          />
        )}
      </Modal>
    </>
  );
}
