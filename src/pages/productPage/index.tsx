import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";

import style from "./index.module.css";
import FormatPrice from "../../utils/formatNumber";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { RootState, StoreDispatch } from "../../stores/store";
import { useSelector } from "react-redux";
import { useCookie } from "../../stores/CookieContext/useCookie";
import { getUserProductDetails } from "../../stores/ProductReducer";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  addCartData,
  deleteCartData,
  invalidateModifiedData,
  resetCartState,
  revertInvalidInput,
  revertMaxInvalidData,
  setDebouncedSentData,
  setTrimmedData,
  setUpdateCart,
} from "../../stores/CartPageReducer";
import { errorHandler } from "../../errorHandler/errorHandler";
import { invokeSwal } from "../../utils/invokeSwal";
import Swal from "sweetalert2";
import CardActions from "../../components/CardActions";
import Modal from "../../components/Modal";
import { shopPharmacistInfo } from "../../utils/types";
import UserPharmacistInfo from "../../components/ProductDetails/PharmacistInfo";
import UserSelectPharmacy from "../../components/ProductDetails/SelectPharmacy";
import { formatMarkdown } from "../../utils/formatDescriptionToMarkdown";
import LoaderDots from "../../components/Spinners/dots";
import { saveState } from "../../utils/localStorageUtil";
import { Helmet } from "react-helmet";

import obatKerasGraphic from "../../assets/classification-keras.svg";
import obatBebasGraphic from "../../assets/classification-bebas.svg";
import obatBebasTerbatasGraphic from "../../assets/classification-bebas-terbatas.svg";
import othersGraphic from "../../assets/classification-others.svg";

export default function ProductDetailsPage(): JSX.Element {
  const navigate = useNavigate();

  const location = useLocation();

  const { pharmacy_id, product_id } = useParams();

  const { shopProductDetailsData, shopLoading, shopError } = useSelector(
    (state: RootState) => state.product
  );

  const { debouncedSentData, cartPageTrimmedData, cartPageDataError } =
    useSelector((state: RootState) => state.cartPage);

  const dispatchRedux: StoreDispatch = useDispatch();

  const { cookies, removeCookie } = useCookie();

  const [isFocused, setIsFocused] = useState(false);

  const [source, setSource] = useState("");

  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);

  const [openPharmacistInfo, onRequestClosePharmacistInfo] =
    useState<boolean>(false);

  const [openSelectPharmacy, onRequestCloseSelectPharmacy] =
    useState<boolean>(false);

  const [pharmacistData, setPharmacistData] = useState<shopPharmacistInfo>({
    selected_pharmacist_name: "",
    selected_pharmacist_phone_number: "",
    selected_pharmacist_SIPA_number: "",
    selected_pharmacy_address: "",
  });

  const handleShowPharmacistInfo = () => {
    window.scroll(0, 0);
    onRequestClosePharmacistInfo(true);
  };

  const handleSelectPharmacy = () => {
    window.scroll(0, 0);
    onRequestCloseSelectPharmacy(true);
  };

  const handleAddQuantity = (
    pharmacy_id: number,
    product_id: number,
    quantity: number | ""
  ) => {
    setSource("handleAddQuantity");
    let validQty;
    if (quantity === "") {
      validQty = 0;
    } else {
      validQty = quantity;
    }

    const newQuantity = validQty + 1;
    const item = cartPageTrimmedData.find(
      (item) =>
        item.pharmacy_id === pharmacy_id && item.product_id === product_id
    );

    if (item) {
      if (newQuantity > 0 && newQuantity <= item.stock) {
        dispatchRedux(
          setUpdateCart({
            pharmacy_id: pharmacy_id,
            product_id: product_id,
            quantity: newQuantity,
            stock: item.stock,
            hasModified: true,
          })
        );
      } else if (newQuantity > item.stock) {
        invokeSwal(
          "The number of item requested is unavailable",
          "invalidInput"
        ).then(() => {
          dispatchRedux(revertMaxInvalidData({ pharmacy_id, product_id }));
        });
      } else {
        invokeSwal(
          "The number of item requested is unavailable",
          "invalidInput"
        ).then(() => {
          dispatchRedux(revertInvalidInput({ pharmacy_id, product_id }));
        });
      }
    } else if (!item) {
      if (shopProductDetailsData) {
        setSource("postToCart");
        if (
          newQuantity > 0 &&
          newQuantity <= shopProductDetailsData.selected_product_stock
        ) {
          dispatchRedux(
            setUpdateCart({
              pharmacy_id: pharmacy_id,
              product_id: product_id,
              quantity: newQuantity,
              stock: shopProductDetailsData.selected_product_stock,
              hasModified: true,
            })
          );
        } else if (
          newQuantity > shopProductDetailsData.selected_product_stock
        ) {
          invokeSwal(
            "The number of item requested is unavailable",
            "invalidInput"
          ).then(() => {
            dispatchRedux(revertMaxInvalidData({ pharmacy_id, product_id }));
          });
        } else {
          invokeSwal(
            "The number of item requested is unavailable",
            "invalidInput"
          ).then(() => {
            dispatchRedux(revertInvalidInput({ pharmacy_id, product_id }));
          });
        }
      }
    }
  };

  const handleReduceQuantity = (
    pharmacy_id: number,
    product_id: number,
    quantity: number | ""
  ) => {
    setSource("handleReduceQuantity");
    let validQty;
    if (quantity === "") {
      validQty = 0;
    } else {
      validQty = quantity;
    }

    const newQuantity = validQty - 1;
    const item = cartPageTrimmedData.find(
      (item) =>
        item.pharmacy_id === pharmacy_id && item.product_id === product_id
    );

    if (item) {
      if (newQuantity > 0 && newQuantity <= item.stock) {
        dispatchRedux(
          setUpdateCart({
            pharmacy_id: pharmacy_id,
            product_id: product_id,
            quantity: newQuantity,
            stock: item.stock,
            hasModified: true,
          })
        );
      } else if (newQuantity === 0) {
        handleDeleteCart(pharmacy_id, product_id);
      } else if (newQuantity > item.stock) {
        invokeSwal(
          "The number of item requested is unavailable",
          "invalidInput"
        ).then(() => {
          dispatchRedux(revertMaxInvalidData({ pharmacy_id, product_id }));
        });
      }
    }
  };

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSource("handleChangeQuantity");
    const pharmacyId = e.target.name.split("_")[0];
    const productId = e.target.name.split("_")[1];
    const item = cartPageTrimmedData.find(
      (item) =>
        item.pharmacy_id === Number(pharmacyId) &&
        item.product_id === Number(productId)
    );

    const newQuantity = Number(e.target.value);
    if (item) {
      if (newQuantity > 0 && newQuantity <= item.stock) {
        dispatchRedux(
          setUpdateCart({
            pharmacy_id: Number(pharmacyId),
            product_id: Number(productId),
            quantity: newQuantity,
            stock: item.stock,
            hasModified: true,
          })
        );
      } else {
        dispatchRedux(
          setUpdateCart({
            pharmacy_id: Number(pharmacyId),
            product_id: Number(productId),
            quantity: newQuantity,
            stock: item.stock,
            hasModified: true,
          })
        );
      }
    }
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const pharmacyId = e.target.name.split("_")[0];
    const productId = e.target.name.split("_")[1];
    const item = cartPageTrimmedData.find(
      (item) =>
        item.pharmacy_id === Number(pharmacyId) &&
        item.product_id === Number(productId)
    );
    const newQuantity = Number(e.target.value);
    setSource("handleOnBlur");
    if (item) {
      if (newQuantity > 0 && newQuantity <= item.stock) {
        setSource("handleOnBlurSuccess");
        dispatchRedux(
          setUpdateCart({
            pharmacy_id: Number(pharmacyId),
            product_id: Number(productId),
            quantity: newQuantity,
            stock: item.stock,
            hasModified: true,
          })
        );
      } else if (newQuantity === 0) {
        handleDeleteCart(Number(pharmacyId), Number(productId));
      } else {
        invokeSwal(
          "The number of item requested is unavailable",
          "invalidInput"
        ).then(() => {
          dispatchRedux(
            revertInvalidInput({
              pharmacy_id: Number(pharmacyId),
              product_id: Number(productId),
            })
          );
        });
      }
    }
  };

  const handleDeleteCart = (pharmacy_id: number, product_id: number) => {
    setSource("handleDeleteCart");
    const item = cartPageTrimmedData.find(
      (item) =>
        item.pharmacy_id === pharmacy_id && item.product_id === product_id
    );

    if (item) {
      Swal.fire({
        title: "Are you sure?",
        text: "You're about to delete the item",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008dda",
        cancelButtonColor: "#d42626",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          if (
            (!cookies.user_is_verified ||
              cookies.user_is_verified.toString() !== "true") &&
            cookies.user_role === "customer"
          ) {
            dispatchRedux(setTrimmedData(item));
          } else {
            dispatchRedux(deleteCartData({ pharmacy_id, product_id })).then(
              () => {
                dispatchRedux(setTrimmedData(item));
                Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                });
              }
            );
          }
        } else if (!result.isConfirmed) {
          dispatchRedux(revertInvalidInput({ pharmacy_id, product_id }));
        }
      });
    }
  };

  const handleShowAlert = (pharmacy_id: number, product_id: number) => {
    if (
      cookies.user_is_verified === undefined ||
      cookies.user_role === undefined
    ) {
      errorHandler(new Error("Please log in first")).then(() => {
        navigate("/auth/login");
        return;
      });
    }

    if (cookies.user_role !== "customer") {
      errorHandler(new Error("Unauthorized, you are not a customer")).then(
        () => {
          dispatchRedux(resetCartState());
          removeCookie("user_is_verified", {
            path: "/",
            secure: true,
            sameSite: "none",
          });
          removeCookie("user_role", {
            path: "/",
            secure: true,
            sameSite: "none",
          });
          navigate("/auth/login");

          return;
        }
      );
    }

    if (
      (!cookies.user_is_verified ||
        cookies.user_is_verified.toString() !== "true") &&
      cookies.user_role === "customer"
    ) {
      setSource("handleAlert");
      handleAddQuantity(pharmacy_id, product_id, 0);
    }

    if (
      (cookies.user_is_verified ||
        cookies.user_is_verified.toString() === "true") &&
      cookies.user_role === "customer"
    ) {
      setSource("handleAlert");
      handleAddQuantity(pharmacy_id, product_id, 0);
    }
  };

  const getParsedCategories = (categoryStr: string) => {
    return categoryStr
      .replace(/[{}"]/g, "")
      .split(",")
      .map((item) => item.trim().replace("\\u0026", "&"));
  };

  useEffect(() => {
    saveState("lastVisitedPage", location.pathname);
    dispatchRedux(
      getUserProductDetails({
        pharmacy_id: Number(pharmacy_id),
        product_id: Number(product_id),
      })
    ).then((result) => {
      if (typeof result.payload === "object") {
        setIsUnavailable(result.payload.selected_product_stock <= 0);
        setPharmacistData({
          selected_pharmacist_name: "Spongebob Squarepants",
          selected_pharmacist_phone_number: "9087124123",
          selected_pharmacist_SIPA_number: "15123-ABVNAJV-1241t3",
          selected_pharmacy_address: "Bikini Bottom",
        });
      }
    });
  }, [dispatchRedux, pharmacy_id, product_id, location.pathname]);

  useEffect(() => {
    const findDatas = cartPageTrimmedData.filter((item) => {
      return item.hasModified === true;
    });

    const notHandleInput =
      source !== "handleChangeQuantity" &&
      source !== "handleOnBlur" &&
      source !== "handleDeleteCart";

    if (
      (findDatas.length > 0 && notHandleInput && !isFocused) ||
      (findDatas.length === 1 && notHandleInput && !isFocused)
    ) {
      if (
        !cookies.user_is_verified ||
        cookies.user_is_verified.toString() === "false"
      ) {
        return;
      }

      const updatedFoundDatas = findDatas.map((item) => ({
        ...item,
        hasModified: false,
      }));

      const debounceTimer = setTimeout(() => {
        if (findDatas.length > 1) {
          findDatas.forEach((sentData) => {
            dispatchRedux(
              addCartData({
                pharmacy_id: sentData.pharmacy_id,
                product_id: sentData.product_id,
                quantity: sentData.quantity,
              })
            ).catch(() => {
              if (cartPageDataError !== null) {
                errorHandler(new Error(cartPageDataError));
              }
            });
          });

          dispatchRedux(invalidateModifiedData(updatedFoundDatas));
        } else if (findDatas.length === 1) {
          dispatchRedux(
            setDebouncedSentData({
              pharmacy_id: findDatas[0].pharmacy_id,
              product_id: findDatas[0].product_id,
              quantity: findDatas[0].quantity || 0,
            })
          );
          dispatchRedux(invalidateModifiedData(updatedFoundDatas));
        }
      }, 500);

      return () => {
        clearTimeout(debounceTimer);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartPageTrimmedData]);

  useEffect(() => {
    if (
      debouncedSentData.pharmacy_id <= 0 ||
      !debouncedSentData.pharmacy_id ||
      debouncedSentData.product_id <= 0 ||
      !debouncedSentData.product_id ||
      debouncedSentData.quantity < 0 ||
      !debouncedSentData.quantity
    ) {
      return;
    }

    dispatchRedux(addCartData(debouncedSentData)).then((result) => {
      return result;
    });

    setSource("");
  }, [dispatchRedux, debouncedSentData]);

  useEffect(() => {
    if (cartPageDataError !== null) {
      errorHandler(new Error(cartPageDataError));
    }

    if (
      shopError !== null &&
      !shopError.includes("aborted") &&
      !shopError.includes("Resource not found")
    ) {
      errorHandler(new Error(shopError));
    } else {
      return;
    }
  }, [shopError, cartPageDataError]);

  return (
    <>
      <Helmet>
        <title>
          Puxing -{" "}
          {shopProductDetailsData !== null || !shopProductDetailsData
            ? `${shopProductDetailsData?.product_name}`
            : "Loading...."}
        </title>
      </Helmet>
      <section className={style.product_details_section}>
        <div className={style.after_section}>
          <h1 hidden>Fu Xing - Product Name</h1>
          {shopLoading ? (
            <LoaderDots />
          ) : !shopProductDetailsData || shopError?.includes("Resource") ? (
            <p className={style.empty_section}>
              Hmm, the product doesn't exist🤔
            </p>
          ) : (
            <div className={style.details_content}>
              <Modal
                shouldShow={openPharmacistInfo}
                onRequestClose={onRequestClosePharmacistInfo}
              >
                <UserPharmacistInfo shopPharmacistInfo={pharmacistData} />
              </Modal>

              <Modal
                shouldShow={openSelectPharmacy}
                onRequestClose={onRequestCloseSelectPharmacy}
              >
                <UserSelectPharmacy
                  onRequestCloseSelectPharmacy={onRequestCloseSelectPharmacy}
                  currentPharmacyId={pharmacy_id || "0"}
                  currentProductId={product_id || "0"}
                />
              </Modal>
              <div className={style.top_section}>
                <div className={style.top_left_section}>
                  <div className={style.image_wrapper}>
                    <img
                      src={shopProductDetailsData?.product_image_url}
                      alt={`${shopProductDetailsData?.product_name} product image`}
                      className={style.product_image}
                    />

                    <img
                      src={
                        shopProductDetailsData.product_classification ===
                        "Obat Keras"
                          ? obatKerasGraphic
                          : shopProductDetailsData.product_classification ===
                            "Obat Bebas"
                          ? obatBebasGraphic
                          : shopProductDetailsData.product_classification ===
                            "Obat Bebas Terbatas"
                          ? obatBebasTerbatasGraphic
                          : othersGraphic
                      }
                      alt={`${shopProductDetailsData.product_classification} badge`}
                      className={style.medicine_badge}
                    />
                  </div>

                  <div className={style.product_tags}>
                    <p className={style.tag_form}>
                      {shopProductDetailsData?.product_form}
                    </p>
                    <p
                      className={
                        style[
                          `tag_classification_${shopProductDetailsData?.product_classification
                            .split(" ")
                            .join("")}`
                        ] || style["tag_classification_default"]
                      }
                    >
                      {shopProductDetailsData?.product_classification}
                    </p>

                    {shopProductDetailsData?.product_category &&
                      (() => {
                        const categories = getParsedCategories(
                          shopProductDetailsData?.product_category
                        );
                        const displayedCategories = categories.slice(0, 3);
                        const hasMore = categories.length > 3;

                        return (
                          <>
                            {displayedCategories.map((item, idx) => (
                              <p
                                key={item + `${idx}`}
                                className={style.tag_category}
                              >
                                {item}
                              </p>
                            ))}
                            {hasMore && (
                              <p className={style.tag_overflow}>...</p>
                            )}
                          </>
                        );
                      })()}
                  </div>
                </div>

                <div className={style.top_right_section}>
                  <div className={style.product_main}>
                    <p className={style.main_title}>
                      {shopProductDetailsData?.product_name}
                    </p>

                    <Markdown
                      className={style.main_subtitle}
                      remarkPlugins={[remarkGfm]}
                    >
                      {formatMarkdown(
                        shopProductDetailsData?.product_generic_name
                      )}
                    </Markdown>

                    <div className={style.main_info}>
                      <p className={style.main_price}>
                        {FormatPrice(
                          shopProductDetailsData?.selected_product_price
                        )}
                      </p>
                      <p className={style.main_selling_unit}>
                        {shopProductDetailsData?.product_selling_unit}
                      </p>
                    </div>
                  </div>

                  {cookies.user_is_verified !== undefined &&
                  cookies.user_role === "customer" ? (
                    <div className={style.product_pharmacy}>
                      <p className={style.pharmacy_info}>
                        Sent from{" "}
                        {shopProductDetailsData?.selected_pharmacy_name} in{" "}
                        {shopProductDetailsData?.selected_pharmacy_city_name}
                        <span>
                          <button
                            title="pharmacy info"
                            className={style.pharmacy_info_btn}
                            onClick={handleShowPharmacistInfo}
                          >
                            <BsInfoCircle
                              className={style.pharmacy_info_logo}
                            />
                          </button>
                        </span>
                      </p>

                      {cartPageTrimmedData.find(
                        (item) =>
                          item.pharmacy_id === Number(pharmacy_id) &&
                          item.product_id === Number(product_id)
                      ) === undefined ? (
                        <button
                          className={
                            isUnavailable
                              ? style.add_to_cart_disabled
                              : style.add_to_cart
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowAlert(
                              Number(pharmacy_id),
                              Number(product_id)
                            );
                          }}
                        >
                          {isUnavailable
                            ? `Product is Unavailable`
                            : `+ Add To Cart`}
                        </button>
                      ) : (
                        <div className={style.cardActionWrapper}>
                          <CardActions
                            handleAddQuantity={handleAddQuantity}
                            handleReduceQuantity={handleReduceQuantity}
                            handleChangeQuantity={handleChangeQuantity}
                            handleOnBlur={handleOnBlur}
                            handleDeleteCart={handleDeleteCart}
                            productQuantity={
                              cartPageTrimmedData.find(
                                (item) =>
                                  item.pharmacy_id === Number(pharmacy_id) &&
                                  item.product_id === Number(product_id)
                              )?.quantity || ""
                            }
                            pharmacy_id={
                              cartPageTrimmedData.find(
                                (item) =>
                                  item.pharmacy_id === Number(pharmacy_id)
                              )?.pharmacy_id || 0
                            }
                            product_id={
                              cartPageTrimmedData.find(
                                (item) => item.product_id === Number(product_id)
                              )?.product_id || 0
                            }
                            isDisabled={isUnavailable}
                          />
                        </div>
                      )}

                      <button
                        onClick={handleSelectPharmacy}
                        className={style.select_other_pharmacy}
                      >
                        Choose other pharmacy {`>`}
                      </button>

                      <div className={style.pharmacy_traffic_info}>
                        <p className={style.info_details}>
                          Available stock:{" "}
                          {shopProductDetailsData?.selected_product_stock} unit
                        </p>
                        <p className={style.info_details}>
                          Sold from{" "}
                          {shopProductDetailsData?.selected_pharmacy_name}:{" "}
                          {shopProductDetailsData?.selected_product_sold_amount ===
                          1
                            ? `${shopProductDetailsData?.selected_product_sold_amount} time`
                            : `${shopProductDetailsData?.selected_product_sold_amount} times`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className={style.bottom_section}>
                <label className={style.bot_title}>Description</label>
                <Markdown remarkPlugins={[remarkGfm]}>
                  {formatMarkdown(shopProductDetailsData?.product_description)
                    .length === 0
                    ? "No description available"
                    : formatMarkdown(
                        shopProductDetailsData?.product_description
                      )}
                </Markdown>
                <label className={style.bot_subtitle}>In one pack:</label>
                <p className={style.bot_contents}>
                  contains:{" "}
                  {`${shopProductDetailsData?.product_unit_in_pack} ${shopProductDetailsData?.product_form} per pack`}
                </p>
                <p className={style.bot_contents}>
                  weight: {shopProductDetailsData?.product_weight} gram
                </p>
                <label className={style.bot_subtitle}>Manufacturer</label>
                <p className={style.product_manufacturer}>
                  {shopProductDetailsData?.product_manufacturer}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
