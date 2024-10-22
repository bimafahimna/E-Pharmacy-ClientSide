import * as constants from "../../../constants/user";
import * as formatTable from "../../../utils/formatTable";
import Filter from "../../../components/Filter";
import Pagination from "../../../components/Pagination";
import Sort from "../../../components/Sort";
import SortButton from "../../../components/SortButton";
import tableStyle from "../../../css/table.module.css";
import headerStyle from "../../../css/admin_header.module.css";
import { ResponseError, user } from "../../../utils/types";
import {
  getUserPaginated,
  toggleSortBy,
  setSortBy,
  addPageNumber,
  reducePageNumber,
  setFilters,
} from "../../../stores/UserReducer";
import { useAppDispatch, useAppSelector } from "../../../hooks/useApp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { RxDividerVertical } from "react-icons/rx";
import LoaderCirle from "../../../components/Spinner/circle";

export default function UsersPage() {
  const { paginated } = useAppSelector((state) => state.user);
  const AppDispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleGetPage = async () => {
    try {
      await AppDispatch(getUserPaginated()).unwrap();
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

  const handleSort = (sortBy: keyof user, sort?: "asc" | "desc") => {
    if (sort !== undefined) AppDispatch(setSortBy({ sortBy, sort }));
    else AppDispatch(toggleSortBy(sortBy));
    handleGetPage();
  };

  const handleFilter = (
    active: boolean,
    field: keyof user,
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
    constants.UserKeys.map((item, index) => (
      <th key={index}>
        <div className={tableStyle.sort_wrapper}>
          {formatTable.Header(item.toString())}
          {constants.UserSortKeys.includes(item) && (
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
      <h1>Users Management</h1>

      <div className={headerStyle.table_filter_wrapper}>
        <div className={headerStyle.filter_sort_wrapper}>
          <Sort<user>
            properties={constants.UserSortKeys}
            onSort={handleSort}
            sort={paginated.query.sort}
            sortBy={paginated.query.sortBy}
            isLoading={paginated.isLoading}
          />
          <RxDividerVertical size={"1.2rem"} />
          <Filter<user>
            properties={constants.UserFilterKeys}
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
                </tr>
              </thead>
              <tbody>
                {paginated.data.map((content, index) => {
                  return (
                    <tr key={index}>
                      <td title={content.email}>{content.email}</td>
                      <td title={content.role}>{content.role}</td>
                      <td title={content.is_verified}>
                        <div>
                          <p
                            className={clsx({
                              [tableStyle.true]: content.is_verified == "true",
                              [tableStyle.false]:
                                content.is_verified == "false",
                            })}
                          >
                            {content.is_verified}
                          </p>
                        </div>
                      </td>
                      <td title={content.is_verified}>{content.created_at}</td>
                      <td>{content.updated_at}</td>
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
    </>
  );
}
