import { useDispatch } from "react-redux";
import { RootState, StoreDispatch } from "../../../stores/store";
import { useSelector } from "react-redux";

import style from "./index.module.css";
import { useEffect, useState } from "react";
import { getUnpaidOrders } from "../../../stores/OrderReducer";
import FormatPrice from "../../../utils/formatNumber";
import Modal from "../../Modal";
import UploadPaymentProof from "../../UploadImageForm";
import { errorHandler } from "../../../errorHandler/errorHandler";

export default function UserUnpaidOrders(): JSX.Element {
  const dispatchRedux: StoreDispatch = useDispatch();

  const { userOrderUnpaidData, userOrderLoading, userOrderError } = useSelector(
    (state: RootState) => state.order
  );

  const [openPayment, onRequestClosePayment] = useState<boolean>(false);

  const [currentPaymentId, setCurrentPaymentId] = useState<number>(0);

  const [currentPaymentPrice, setCurrentPaymentPrice] = useState<number>(0);

  const handlePay = (e: React.MouseEvent<HTMLButtonElement>) => {
    window.scroll(0, 0);

    const paymentId = e.currentTarget.name.split("_")[0];
    const paymentAmount = e.currentTarget.name.split("_")[1];

    setCurrentPaymentId(Number(paymentId));

    setCurrentPaymentPrice(Number(paymentAmount));

    onRequestClosePayment(true);
  };

  const handleCancelPayment = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.id, e.currentTarget.name, "CANCEL PAYMENT");
    //IF SUCCEEDED, dispatch ulang
  };

  const handleSeePaymentInfo = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.id, e.currentTarget.name, "SEE PAYMENT INFO");
    //IF SUCCEEDED, dispatch ulang
  };

  useEffect(() => {
    dispatchRedux(getUnpaidOrders()).then(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userOrderError !== null) {
      errorHandler(new Error(userOrderError));
    }
  }, [userOrderError]);

  return (
    <>
      <Modal
        key={currentPaymentId}
        shouldShow={openPayment}
        onRequestClose={onRequestClosePayment}
      >
        <UploadPaymentProof
          paymentId={currentPaymentId}
          type="payment"
          title={`Upload Payment Proof for ${FormatPrice(currentPaymentPrice)}`}
          onRequestClose={onRequestClosePayment}
        />
      </Modal>

      {userOrderLoading ? (
        <div className={style.order_loading_section}>
          <div className={style.loaderSpin}></div>
        </div>
      ) : (
        <>
          {userOrderUnpaidData.length === 0 ? (
            <p className={style.order_emtpy}>No order yet 🤔</p>
          ) : (
            userOrderUnpaidData.map((invoice, idx) => {
              return (
                <div key={idx + "unpaid order"} className={style.order_card}>
                  {invoice.orders.map((order, idx) => {
                    return (
                      <div
                        key={idx + "order_pharmacy_item"}
                        className={style.card_items}
                      >
                        <div className={style.card_header}>
                          <p className={style.header_title}>
                            {order.pharmacy_name}
                          </p>
                          <p className={style.header_tag}>
                            Waiting For Payment
                          </p>
                        </div>

                        {order.order_items.map((item, idx) => {
                          return (
                            <div
                              key={idx + "order_item_unpaid"}
                              id={`${item.pharmacy_id}_${item.product_id}`}
                              className={style.card_content}
                            >
                              <div className={style.content_image_wrapper}>
                                <img
                                  className={style.content_image}
                                  src={item.image_url}
                                  alt={item.name + " image"}
                                />
                              </div>

                              <div className={style.content_receiver}>
                                <div className={style.receiver_detail}>
                                  <p className={style.details_name}>
                                    {item.name}
                                  </p>

                                  <div className={style.receiver_wrapper}>
                                    <div>
                                      <p className={style.receiver_info}>
                                        {order.address}
                                      </p>
                                      <p>
                                        <span className={style.contact_name}>
                                          {order.contact_name}
                                        </span>
                                        {" | "}
                                        <span className={style.contact_phone}>
                                          {order.contact_phone}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className={style.content_details}>
                                <div className={style.details_info}>
                                  <p className={style.details_amount}>
                                    x{item.quantity}
                                  </p>
                                </div>

                                <p className={style.details_price}>
                                  {FormatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <p className={style.card_price_wrapper}>
                          <span className={style.card_price_title}>
                            Shipping Cost:{" "}
                          </span>
                          <span className={style.card_price_amount}>
                            {FormatPrice(order.logistic_cost)}
                          </span>
                        </p>

                        <p className={style.card_price_wrapper}>
                          <span className={style.card_price_title}>
                            Product Total:{" "}
                          </span>
                          <span className={style.card_price_amount}>
                            {FormatPrice(order.order_amount)}
                          </span>
                        </p>
                      </div>
                    );
                  })}

                  <p className={style.card_total}>
                    Payment Total:{" "}
                    <span className={style.card_total_info}>
                      {FormatPrice(invoice.payment_amount)}
                    </span>
                  </p>

                  <div className={style.card_actions}>
                    <button
                      name={invoice.payment_id.toString()}
                      className={style.actions_info}
                      onClick={handleSeePaymentInfo}
                    >
                      See Details
                    </button>
                    <button
                      name={invoice.payment_id.toString()}
                      className={style.actions_cancel}
                      onClick={handleCancelPayment}
                    >
                      Cancel
                    </button>
                    <button
                      name={
                        invoice.payment_id.toString() +
                        "_" +
                        invoice.payment_amount.toString()
                      }
                      className={style.actions_upload}
                      onClick={handlePay}
                    >
                      Upload Payment Proof
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </>
      )}
    </>
  );
}
