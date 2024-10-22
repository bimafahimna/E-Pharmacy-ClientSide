import * as constants from "../../../constants/partner";
import * as formatTable from "../../../utils/formatTable";
import Filter from "../../../components/Filter";
import Modal from "../../../components/Modal";
import Pagination from "../../../components/Pagination";
import PartnerForm from "../../../components/PartnerForm";
import Sort from "../../../components/Sort";
import SortButton from "../../../components/SortButton";
import headerStyle from "../../../css/admin_header.module.css";
import tableStyle from "../../../css/table.module.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RxDividerVertical } from "react-icons/rx";
import { partner, ResponseError } from "../../../utils/types";
import { useAppDispatch, useAppSelector } from "../../../hooks/useApp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addPageNumber,
  getPartnerByID,
  getPartnersPaginated,
  reducePageNumber,
  setDeletedID,
  setEditedID,
  setFilters,
  setSortBy,
  toggleSortBy,
} from "../../../stores/PartnerReducer";
import LoaderCirle from "../../../components/Spinner/circle";
import { initialDaysState } from "../../../hooks/usePartnerFormValidation";
import clsx from "clsx";
import PartnerEditForm from "../../../components/PartnerEditForm";

export default function PartnerPage() {
  const { paginated } = useAppSelector((state) => state.partner);
  const AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const [shouldShowAddModal, onRequestCloseAddModal] = useState<boolean>(false);
  const [shouldShowEditModal, onRequestCloseEditModal] =
    useState<boolean>(false);
  const [_shouldShowDeleteModal, onRequestCloseDeleteModal] =
    useState<boolean>(false);
  const [_onEditPharmacistID, setOnEditPharmacistID] = useState<
    partner | undefined
  >();

  const handleGetPage = async () => {
    try {
      await AppDispatch(getPartnersPaginated()).unwrap();
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

  const handleSort = (sortBy: keyof partner, sort?: "asc" | "desc") => {
    if (sort !== undefined) AppDispatch(setSortBy({ sortBy, sort }));
    else AppDispatch(toggleSortBy(sortBy));
    handleGetPage();
  };

  const handleFilter = (
    active: boolean,
    field: keyof partner,
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

  const Headers = ({ item }: { item: keyof partner }) => (
    <th>
      <div className={tableStyle.sort_wrapper}>
        {formatTable.Header(item.toString())}
        {item !== "logo_url" && item !== "active_days" && (
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
        <h1>Partner Management</h1>
        <button onClick={() => onRequestCloseAddModal(true)}>
          Add new partner
        </button>
      </div>
      <div className={headerStyle.table_filter_wrapper}>
        <div className={headerStyle.filter_sort_wrapper}>
          <Sort<partner>
            properties={constants.PartnerSortKeys}
            onSort={handleSort}
            sort={paginated.query.sort}
            sortBy={paginated.query.sortBy}
          />
          <RxDividerVertical size={"1.2rem"} />
          <Filter<partner>
            properties={constants.PartnerFiltersKeys}
            onFilter={handleFilter}
            filters={paginated.query.filters}
            className={tableStyle.filter_wrapper}
          />
          <Pagination
            limit={paginated.query.limit}
            pagination={paginated.pagination}
            onAddPage={handleAddPage}
            onReducePage={handleReducePage}
          />
        </div>
        <div className={tableStyle.wrapper_table_sticky}>
          {paginated.data.length !== 0 && !paginated.isLoading && (
            <table className={tableStyle.table}>
              <thead>
                <tr>
                  {constants.PartnerKeys.slice(1, 8).map((item, index) => (
                    <Headers item={item} key={index} />
                  ))}
                  <th className={tableStyle.static_action}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginated.data.map((content, index) => {
                  const formattedActiveDays = content.active_days
                    .split(",")
                    .map((item) =>
                      initialDaysState[Number(item)].name.slice(0, 3)
                    )
                    .join(", ");
                  return (
                    <tr key={index}>
                      <td>{content.name}</td>
                      <td>
                        <img
                          src={content.logo_url}
                          style={{ height: "3rem" }}
                        />
                      </td>
                      <td title={content.year_founded}>
                        {content.year_founded}
                      </td>
                      <td title={formattedActiveDays}>{formattedActiveDays}</td>
                      <td title={content.operational_start}>
                        {content.operational_start}
                      </td>
                      <td title={content.operational_stop}>
                        {content.operational_stop}
                      </td>
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
                              setOnEditPharmacistID(content);
                              AppDispatch(setEditedID(Number(content.id)));
                              AppDispatch(getPartnerByID());
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
      {shouldShowAddModal && (
        <Modal
          shouldShow={shouldShowAddModal}
          onRequestClose={onRequestCloseAddModal}
        >
          <PartnerForm onRequestClose={onRequestCloseAddModal} />
        </Modal>
      )}
      {shouldShowEditModal && (
        <Modal
          shouldShow={shouldShowEditModal}
          onRequestClose={onRequestCloseEditModal}
        >
          <PartnerEditForm onRequestClose={onRequestCloseEditModal} />
        </Modal>
      )}
    </>
  );
}
