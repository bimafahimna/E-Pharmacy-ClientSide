import FormatPrice from "../../../utils/formatNumber";
import { confirmOrderRequest, userOrderHistory } from "../../../utils/types";
import style from "./index.module.css";
import { errorHandler } from "../../../errorHandler/errorHandler";
import { fetchConfirmOrder } from "../../../utils/asyncFunctions";
import { invokeToast } from "../../../utils/invokeToast";

export default function UserOrdersData({
  setActiveTab,
  orderData,
  status,
  userOrderLoading,
}: {
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  orderData: userOrderHistory[];
  status: string;
  userOrderLoading: boolean;
}): JSX.Element {
  const handleSeePaymentInfo = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.id, e.currentTarget.name, "SEE PAYMENT INFO");
  };

  const handleConfirmOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const request: confirmOrderRequest = {
        status: "Order Confirmed",
        order_id: Number(e.currentTarget.name),
      };
      const result = await fetchConfirmOrder(request);
      if (result.message[0] !== "S") {
        throw new Error(result.message);
      } else {
        invokeToast(result.message, "success");
        setActiveTab(3);
      }
    } catch (error) {
      if (error instanceof Error) errorHandler(new Error());
    }
  };

  return (
    <>
      {userOrderLoading ? (
        <div className={style.order_loading_section}>
          <div className={style.loaderSpin}></div>
        </div>
      ) : orderData.length === 0 ? (
        <p className={style.order_emtpy}>No order yet 🤔</p>
      ) : (
        orderData.map((order, idx) => {
          return (
            <div key={idx + "unpaid order"} className={style.order_card}>
              <div key={idx + "order_item"} className={style.card_items}>
                <div className={style.card_header}>
                  <p className={style.header_title}>{order.pharmacy_name}</p>
                  <p className={style.header_order_number}>
                    Order Id: {order.order_id}
                  </p>
                  <p
                    className={
                      style[`header_tag_${status.split(" ").join("")}`]
                    }
                  >
                    {status}
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
                          <p className={style.details_name}>{item.name}</p>

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

                <p className={style.card_total}>
                  Payment Total:{" "}
                  <span className={style.card_total_info}>
                    {FormatPrice(
                      Number(order.order_amount) + Number(order.logistic_cost)
                    )}
                  </span>
                </p>
              </div>

              <div className={style.card_actions}>
                <button
                  name={order.order_id.toString()}
                  className={style.actions_info}
                  onClick={handleSeePaymentInfo}
                >
                  See Details
                </button>

                {status === "Sent" ? (
                  <button
                    name={order.order_id.toString()}
                    className={style.actions_confirm}
                    onClick={handleConfirmOrder}
                  >
                    Confirm Order
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
