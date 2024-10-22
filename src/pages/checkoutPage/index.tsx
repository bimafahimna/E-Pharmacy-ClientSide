import style from "./index.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState, StoreDispatch } from "../../stores/store";
import { useSelector } from "react-redux";
import FormatPrice from "../../utils/formatNumber";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAddresses } from "../../stores/ProfileReducer";
import { loadState, saveState } from "../../utils/localStorageUtil";
import {
  address,
  cartCardPersisted,
  generalResponse,
  orderRequest,
  userOrderItems,
  userOrderRequestItem,
} from "../../utils/types";
import Modal from "../../components/Modal";
import SelectAddress from "../../components/Checkout/SelectAddress";
import SelectLogistics from "../../components/Checkout/SelectLogistics";
import { getPharmacyLogistics } from "../../stores/LogisticsReducer";
import LoaderGloss from "../../components/Spinners/gloss";
import { errorHandler } from "../../errorHandler/errorHandler";
import { createOrders } from "../../stores/OrderReducer";
import { invokeToast } from "../../utils/invokeToast";

export default function CheckoutPage(): JSX.Element {
  const navigate = useNavigate();

  const location = useLocation();

  const orderPageCartData = loadState(
    "orderPageCartData"
  ) as cartCardPersisted[];

  const cartPagePersistedData = loadState(
    "cartPagePersistedData"
  ) as cartCardPersisted[];

  const [orderTotalValue, setOrderTotalValue] = useState<number>(0);

  const [shipmentTotalValue, setShipmentTotalValue] = useState<number>(0);

  const [grandTotalValue, setGrandTotalValue] = useState<number>();

  const [open, onRequestClose] = useState(false);

  const [openLogistics, onRequestCloseLogistics] = useState(false);

  const { chosenAddress } = useSelector((state: RootState) => state.profile);

  const { logisticsData, logisticsLoading, logisticsError } = useSelector(
    (state: RootState) => state.pharmacyLogistics
  );

  const { userOrderError } = useSelector((state: RootState) => state.order);

  const dispatchRedux: StoreDispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [masterLoading, setMasterLoading] = useState<boolean>(true);

  const [currentPharmacyName, setCurrentPharmacyName] = useState<string>();

  const handleBackButton = () => {
    navigate("/cart");
  };

  const handleInvoice = () => {
    let addressField = "";
    if (
      chosenAddress?.address_line_2 !== "" ||
      !chosenAddress.address_line_2 ||
      chosenAddress.address_line_2 !== undefined
    ) {
      addressField = `${chosenAddress?.address_details}, ${chosenAddress?.address_line_2}, ${chosenAddress?.sub_district}, ${chosenAddress?.district} ${chosenAddress?.city}, ${chosenAddress?.province}`;
    } else {
      addressField = `${chosenAddress?.address_details}, ${chosenAddress?.sub_district}, ${chosenAddress?.district} ${chosenAddress?.city}, ${chosenAddress?.province}`;
    }

    const orders: userOrderRequestItem[] = orderPageCartData.map(
      (pharmacyOrder) => {
        const findLogistic = logisticsData.find((pharmacyLogistic) => {
          return pharmacyLogistic.pharmacy_name === pharmacyOrder.pharmacy_name;
        });

        const logisticPrice = findLogistic?.logistics.find((item) => {
          return item.currently_chosen === true;
        })?.price as string;

        const logisticService = findLogistic?.logistics.find((item) => {
          return item.currently_chosen === true;
        })?.service as string;

        let order_amount: number = 0;

        const order_item: userOrderItems[] = pharmacyOrder.items.map(
          (orderItem) => {
            order_amount += Number(orderItem.price) * orderItem.quantity;
            return {
              product_id: orderItem.product_id,
              pharmacy_id: orderItem.pharmacy_id,
              image_url: orderItem.image_url,
              name: orderItem.name,
              quantity: orderItem.quantity,
              price: orderItem.price,
            };
          }
        );

        return {
          logistic_id: findLogistic?.logistics.find((item) => {
            return item.currently_chosen === true;
          })?.id as number,
          address: addressField,
          contact_name: chosenAddress!.receiver_name,
          contact_phone: chosenAddress!.receiver_phone_number,
          pharmacy_id: pharmacyOrder.items[0].pharmacy_id,
          pharmacy_name: pharmacyOrder.pharmacy_name,
          logistic_name: findLogistic?.logistics.find((item) => {
            return item.currently_chosen === true;
          })?.name as string,
          logistic_cost: logisticPrice,
          logistic_service: logisticService,
          order_items: order_item,
          order_amount: order_amount.toString(),
        };
      }
    );

    const tempUserOrderRequest: orderRequest = {
      orders: orders,
      payment_method: "Manual transfer",
      payment_amount: grandTotalValue?.toString() as string,
    };

    dispatchRedux(createOrders(tempUserOrderRequest))
      .unwrap()
      .then(() => {
        navigate("/profile/orders");
      });
  };

  const handleSelectAddress = () => {
    onRequestClose(true);
  };

  const handleSelectLogistics = (pharmacy_name: string) => {
    const selectedLogisticsData = logisticsData?.find(
      (logistics) => logistics.pharmacy_name === pharmacy_name
    );

    if (selectedLogisticsData) {
      setCurrentPharmacyName(pharmacy_name);
    }

    window.scroll(0, 0);
    onRequestCloseLogistics(true);
  };

  useEffect(() => {
    setIsLoading(true);
    let totalOrdered: number = 0;
    let totalShipment: number = 0;

    if (
      !orderPageCartData ||
      orderPageCartData.length === 0 ||
      !cartPagePersistedData ||
      cartPagePersistedData.length === 0
    ) {
      navigate("/cart");
      return;
    }

    if (chosenAddress === null || !chosenAddress) {
      dispatchRedux(getAddresses()).then((result) => {
        const payload: generalResponse<address[]> =
          result.payload as generalResponse<address[]>;

        if ((payload.data?.length || 0) === 0) {
          invokeToast("Please fill your address first", "warning");
          navigate("/profile/address");
          return;
        }

        const active_address = payload.data?.find((address) => {
          return address.currently_selected || address.is_active;
        });

        const address_id = active_address?.id;

        orderPageCartData.forEach((pharmacy) => {
          dispatchRedux(
            getPharmacyLogistics({
              pharmacy_id: pharmacy.pharmacy_id,
              address_id: address_id || 0,
              order_weight: pharmacy.order_weight,
            })
          ).then((result) => {
            if (typeof result.payload === "object") {
              result.payload.logistics.forEach((item) => {
                if (item.is_recommended === true) {
                  totalShipment += Number(item.price);
                  setShipmentTotalValue(totalShipment);
                }
              });
            }
          });

          pharmacy.items.forEach((item) => {
            totalOrdered += Number(item.price) * item.quantity;
            setOrderTotalValue(totalOrdered);
          });
        });
      });
    } else {
      orderPageCartData.forEach((pharmacy) => {
        dispatchRedux(
          getPharmacyLogistics({
            pharmacy_id: pharmacy.pharmacy_id,
            address_id: chosenAddress.id,
            order_weight: pharmacy.order_weight,
          })
        ).then((result) => {
          if (typeof result.payload === "object") {
            result.payload.logistics.forEach((item) => {
              if (item.currently_chosen === true) {
                totalShipment += Number(item.price);
                setShipmentTotalValue(totalShipment);
              }
            });
          }
        });

        pharmacy.items.forEach((item) => {
          totalOrdered += Number(item.price) * item.quantity;
          setOrderTotalValue(totalOrdered);
        });
      });
    }
    saveState("lastVisitedPage", location.pathname);

    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (orderTotalValue !== 0) {
      let totalShipment: number = 0;

      logisticsData.forEach((pharmacy) => {
        pharmacy.logistics.forEach((item) => {
          if (item.currently_chosen) {
            totalShipment += Number(item.price);
          }
        });
      });

      setShipmentTotalValue(totalShipment);
      setGrandTotalValue(orderTotalValue + totalShipment);
    }
  }, [orderTotalValue, shipmentTotalValue, logisticsData]);

  useEffect(() => {
    if (logisticsError !== null) errorHandler(new Error(logisticsError));
    if (userOrderError !== null) {
      errorHandler(new Error(userOrderError));
      return;
    }
  }, [logisticsError, userOrderError, navigate]);

  useEffect(() => {
    if (isLoading || logisticsLoading) {
      setMasterLoading(true);
    } else if (!isLoading || !logisticsLoading) {
      setMasterLoading(false);
    }
  }, [isLoading, logisticsLoading]);

  return (
    <section className={style.checkoutPageSection}>
      <div className={style.afterSection}>
        {masterLoading ? (
          <div className={style.loading_wrapper}>
            <div className={style.loaderSpin}></div>
          </div>
        ) : (
          <>
            <Modal shouldShow={open} onRequestClose={onRequestClose}>
              <SelectAddress />
            </Modal>

            <Modal
              key={currentPharmacyName}
              shouldShow={openLogistics}
              onRequestClose={onRequestCloseLogistics}
            >
              <SelectLogistics pharmacy_name={currentPharmacyName as string} />
            </Modal>

            <div className={style.leftSection}>
              <div className={style.addressSection}>
                <div className={style.cardHeader}>
                  <h1>Address</h1>
                </div>

                <div className={style.addressContent}>
                  <button
                    onClick={handleSelectAddress}
                    className={style.addressOptionBtn}
                  >
                    <div className={style.addressOptionAttribute}>
                      <div className={style.addressNameWrapper}>
                        <p>{chosenAddress?.name}</p>
                        <p>{chosenAddress?.receiver_phone_number}</p>
                      </div>
                      <div className={style.addressDetails}>
                        <p>
                          {chosenAddress?.address_details},{" "}
                          {chosenAddress?.address_line_2},{" "}
                          {chosenAddress?.sub_district},{" "}
                          {chosenAddress?.district}, {chosenAddress?.city},{" "}
                          {chosenAddress?.province}
                        </p>
                      </div>
                      <div className={style.addressBadge}>
                        <p>Active</p>
                      </div>
                    </div>

                    <IoIosArrowForward className={style.moveIconAddress} />
                  </button>
                </div>
              </div>

              {masterLoading
                ? ""
                : orderPageCartData.map((cartData, idx) => {
                    const newSelectedLogistic = logisticsData?.find(
                      (logistics) => {
                        return logistics.pharmacy_id === cartData.pharmacy_id;
                      }
                    );

                    return (
                      <div
                        key={idx + cartData.pharmacy_name}
                        className={style.checkoutCardSection}
                      >
                        <div className={style.cardHeader}>
                          <p className={style.pharmacyName}>
                            {cartData.pharmacy_name}
                          </p>
                        </div>

                        <div className={style.cardContents}>
                          {cartData.items.map((data, idx) => {
                            return (
                              <div key={idx} className={style.cardItems}>
                                <div className={style.cardDetails}>
                                  <div className={style.productDetailsWrapper}>
                                    <img
                                      src={data.image_url}
                                      alt={data.name}
                                      className={style.productImage}
                                    />

                                    <div className={style.productDetails}>
                                      <p className={style.productTitle}>
                                        {data.name}
                                      </p>
                                      <p className={style.productDesc}>
                                        {data.selling_unit}
                                      </p>
                                      <p className={style.productPrice}>
                                        {FormatPrice(data.price)}
                                      </p>
                                      <p className={style.productDesc}>
                                        {data.description}
                                      </p>
                                    </div>
                                  </div>

                                  <div className={style.purchasedDetails}>
                                    <div
                                      style={{ display: "flex", gap: "1rem" }}
                                    >
                                      <p className={style.purchasedTitle}>
                                        Quantity:{" "}
                                      </p>
                                      <p className={style.highlightedText}>
                                        {data.quantity}x
                                      </p>
                                    </div>

                                    <div
                                      style={{ display: "flex", gap: "1rem" }}
                                    >
                                      <p className={style.purchasedTitle}>
                                        Price:{" "}
                                      </p>
                                      <p className={style.highlightedText}>
                                        {FormatPrice(
                                          Number(data.price) * data.quantity
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          <div className={style.checkoutLogisticPartner}>
                            <p className={style.productTitle}>
                              Shipping Option
                            </p>

                            {logisticsLoading ||
                            newSelectedLogistic === undefined ? (
                              <LoaderGloss cssStyle="shippingOptionBtnLoading">
                                <IoIosArrowForward
                                  className={style.moveIconLogistic}
                                />
                              </LoaderGloss>
                            ) : (
                              <button
                                onClick={() =>
                                  handleSelectLogistics(cartData.pharmacy_name)
                                }
                                className={style.shippingOptionBtn}
                                name={newSelectedLogistic?.pharmacy_name}
                              >
                                <div className={style.logisticPartnerAttribute}>
                                  <img
                                    className={style.logisticPartnerLogo}
                                    src={
                                      newSelectedLogistic?.logistics.filter(
                                        (item) => {
                                          return item.currently_chosen;
                                        }
                                      )[0].image_url
                                    }
                                    alt={
                                      newSelectedLogistic?.pharmacy_name +
                                      "logo"
                                    }
                                  />
                                  <div className={style.logisticPartnerDetails}>
                                    <p>
                                      {newSelectedLogistic
                                        ? newSelectedLogistic?.logistics.filter(
                                            (item) => {
                                              return item.currently_chosen;
                                            }
                                          )[0].name
                                        : ""}
                                    </p>
                                    <p>
                                      {FormatPrice(
                                        newSelectedLogistic?.logistics.filter(
                                          (item) => {
                                            return item.currently_chosen;
                                          }
                                        )[0].price
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <IoIosArrowForward
                                  className={style.moveIconLogistic}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

              <div className={style.navigationButtonsProgress}>
                <button
                  onClick={handleBackButton}
                  className={style.backToHome}
                  disabled={masterLoading}
                >
                  <IoIosArrowBack className={style.moveIcon} />
                  Go Back
                </button>

                <button
                  onClick={handleInvoice}
                  className={style.paymentBtn}
                  disabled={masterLoading}
                >
                  Payment
                  <IoIosArrowForward className={style.moveIcon} />
                </button>
              </div>
            </div>

            <div className={style.rightSection}>
              <div className={style.orderSummaryCard}>
                <div className={style.orderSummaryHeader}>
                  <p>Your order</p>
                </div>

                <div className={style.orderSummaryDetailsWrapper}>
                  <div className={style.orderSummaryDetails}>
                    <div className={style.orderSummaryInfo}>
                      <p>Total Order:</p>
                    </div>
                    <div className={style.orderSummaryValue}>
                      <p>{FormatPrice(orderTotalValue)}</p>
                    </div>
                  </div>

                  <div className={style.orderSummaryDetails}>
                    <div className={style.orderSummaryInfo}>
                      <p>Shipment Cost:</p>
                    </div>
                    <div className={style.orderSummaryValue}>
                      <p>{FormatPrice(shipmentTotalValue)}</p>
                    </div>
                  </div>
                </div>

                <div className={style.grandTotalWrapper}>
                  <div className={style.grandTotalKekw}>
                    <div className={style.grandTotalInfo}>
                      <p>Grand Total:</p>
                    </div>

                    <div className={style.grandTotalValue}>
                      <p>{FormatPrice(grandTotalValue)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
