import React, { useEffect, useState } from "react";
import UserUnpaidOrders from "../../components/UserOrders/unpaid";
import style from "./index.module.css";
import { saveState } from "../../utils/localStorageUtil";
import { useLocation } from "react-router-dom";
import { RootState, StoreDispatch } from "../../stores/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import UserOrdersData from "../../components/UserOrders/others";
import { errorHandler } from "../../errorHandler/errorHandler";
import { getPaidUserOrders } from "../../stores/OrderReducer";

const activeTabIndex = [
  "Waiting For Payment",
  "Processed",
  "Sent",
  "Order Confirmed",
  "Canceled",
];

export default function OrderPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<number>(0);
  const location = useLocation();

  const dispatchRedux: StoreDispatch = useDispatch();

  const {
    userOrderProccessedData,
    userOrderSentData,
    userOrderConfirmedData,
    userOrderCancelledData,
    userOrderLoading,
    userOrderError,
  } = useSelector((state: RootState) => state.order);

  const handleActiveTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (activeTab !== Number(e.currentTarget.name)) {
      setActiveTab(Number(e.currentTarget.name));
    }
  };

  useEffect(() => {
    if (userOrderError !== null) {
      errorHandler(new Error(userOrderError));
    }
  }, [userOrderError]);

  useEffect(() => {
    saveState("lastVisitedPage", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (activeTab !== 0) {
      dispatchRedux(getPaidUserOrders(activeTabIndex[activeTab]));
    }
  }, [dispatchRedux, activeTab]);

  return (
    <div className={style.order_section}>
      <div className={style.order_tabs}>
        <div className={style.tabs_list}>
          {activeTabIndex.map((tab, idx) => {
            return (
              <button
                key={idx + tab + "tab"}
                onClick={handleActiveTab}
                className={
                  activeTab === idx ? style.tabs_item_active : style.tabs_item
                }
                name={idx.toString()}
              >
                {tab}
              </button>
            );
          })}
          <div
            style={{ transform: `translateX(${activeTab * 100}%)` }}
            className={style.line}
          ></div>
        </div>
      </div>

      <div className={style.order_content}>
        {activeTab === 0 ? <UserUnpaidOrders /> : ""}
        {activeTab === 1 ? (
          <UserOrdersData
            setActiveTab={setActiveTab}
            orderData={userOrderProccessedData}
            status={activeTabIndex[1]}
            userOrderLoading={userOrderLoading}
          />
        ) : (
          ""
        )}
        {activeTab === 2 ? (
          <UserOrdersData
            setActiveTab={setActiveTab}
            orderData={userOrderSentData}
            status={activeTabIndex[2]}
            userOrderLoading={userOrderLoading}
          />
        ) : (
          ""
        )}
        {activeTab === 3 ? (
          <UserOrdersData
            setActiveTab={setActiveTab}
            orderData={userOrderConfirmedData}
            status={activeTabIndex[3]}
            userOrderLoading={userOrderLoading}
          />
        ) : (
          ""
        )}
        {activeTab === 4 ? (
          <UserOrdersData
            setActiveTab={setActiveTab}
            orderData={userOrderCancelledData}
            status={activeTabIndex[4]}
            userOrderLoading={userOrderLoading}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
