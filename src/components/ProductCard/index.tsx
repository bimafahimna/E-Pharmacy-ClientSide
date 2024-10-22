import { useNavigate } from "react-router-dom";
import style from "./index.module.css";
import { useCookie } from "../../stores/CookieContext/useCookie";
import { errorHandler } from "../../errorHandler/errorHandler";
import {
  addCartData,
  deleteCartData,
  invalidateModifiedData,
  resetCartState,
  revertInvalidInput,
  revertMaxInvalidData,
  setTrimmedData,
  setUpdateCart,
} from "../../stores/CartPageReducer";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { RootState, StoreDispatch } from "../../stores/store";
import { useSelector } from "react-redux";
import { invokeSwal } from "../../utils/invokeSwal";
import FormatPrice from "../../utils/formatNumber";
import { shopProduct } from "../../utils/types";
import CardActions from "../CardActions";

export default function ProductCard({
  parentProduct,
  product,
  index,
}: {
  parentProduct: shopProduct[];
  product: shopProduct;
  index: number;
}): JSX.Element {
  const navigate = useNavigate();

  const { removeCookie, cookies } = useCookie();

  const handleToProductDetails = (pharmacy_id: number, product_id: number) => {
    window.scrollTo(0, 0);
    navigate(`/pharmacy/${pharmacy_id}/product/${product_id}`);
  };

  const dispatchRedux: StoreDispatch = useDispatch();

  const { debouncedSentData, cartPageTrimmedData, cartPageDataError } =
    useSelector((state: RootState) => state.cartPage);

  const [source, setSource] = useState("");

  const [isFocused, setIsFocused] = useState(false);

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
      const target = parentProduct.find((item) => {
        return (
          item.selected_pharmacy_id === pharmacy_id &&
          item.product_id === product_id
        );
      });
      if (target) {
        setSource("postToCart");
        if (newQuantity > 0 && newQuantity <= target.product_stock) {
          dispatchRedux(
            setUpdateCart({
              pharmacy_id: pharmacy_id,
              product_id: product_id,
              quantity: newQuantity,
              stock: target.product_stock,
              hasModified: true,
            })
          );
        } else if (newQuantity > target.product_stock) {
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

  useEffect(() => {
    const findDatas = cartPageTrimmedData.filter((item) => {
      return item.hasModified === true;
    });

    const notHandleInput =
      source !== "handleChangeQuantity" &&
      source !== "handleOnBlur" &&
      source !== "handleDeleteCart";

    if (
      findDatas.length > 0 &&
      notHandleInput &&
      !isFocused &&
      cookies.user_is_verified
    ) {
      const updatedItems = findDatas.map((item) => ({
        ...item,
        hasModified: false,
      }));

      const debounceTimer = setTimeout(() => {
        if (findDatas.length > 0) {
          findDatas.forEach((item) => {
            dispatchRedux(
              addCartData({
                pharmacy_id: item.pharmacy_id,
                product_id: item.product_id,
                quantity: item.quantity,
              })
            ).catch(() => {
              if (cartPageDataError !== null) {
                errorHandler(new Error(cartPageDataError));
              }
            });
          });
          dispatchRedux(invalidateModifiedData(updatedItems));
        }
      }, 500);

      return () => clearTimeout(debounceTimer);
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

    let isRequestInProgress = false;

    if (!isRequestInProgress) {
      isRequestInProgress = true;

      dispatchRedux(addCartData(debouncedSentData))
        .then(() => {
          isRequestInProgress = false;
        })
        .catch(() => {
          if (cartPageDataError !== null) {
            errorHandler(new Error(cartPageDataError));
          }
        });

      setSource("");
    }

    return () => {
      isRequestInProgress = false;
    };
  }, [dispatchRedux, debouncedSentData, cartPageDataError]);

  return (
    <div
      onClick={() => {
        handleToProductDetails(
          product.selected_pharmacy_id,
          product.product_id
        );
      }}
      title="see product details"
      className={
        product.product_stock > 0
          ? style.product_card
          : style.product_card_disabled
      }
      key={
        "product_page" +
        index +
        `${product.selected_pharmacy_id}_${product.product_id} `
      }
    >
      <div className={style.product_card_wrapper}>
        <div className={style.product_image_wrapper}>
          <img
            className={style.product_image}
            sizes="(max-width: 250px) 100vw, (max-width: 500px) 50vw, 33vw"
            src={product.image_url}
            alt={product.product_name}
          />
        </div>
        <div className={style.product_description}>
          <p className={style.product_name}>{product.product_name}</p>
          <p className={style.product_selling_unit}>
            {product.product_selling_unit}
          </p>
          <p className={style.product_price}>
            {FormatPrice(Number(product.product_price))}
          </p>

          {cartPageTrimmedData.find(
            (item) =>
              item.pharmacy_id === product.selected_pharmacy_id &&
              item.product_id === product.product_id
          ) === undefined ? (
            <button
              aria-label="add to cart button"
              className={
                product.product_stock > 0
                  ? style.add_to_cart
                  : style.add_to_cart_disabled
              }
              onClick={(e) => {
                e.stopPropagation();
                handleShowAlert(
                  product.selected_pharmacy_id,
                  product.product_id
                );
              }}
            >
              {product.product_stock > 0
                ? `+ Add To Cart`
                : `Product is Unavailable`}
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
                      item.pharmacy_id === product.selected_pharmacy_id &&
                      item.product_id === product.product_id
                  )?.quantity || ""
                }
                pharmacy_id={
                  cartPageTrimmedData.find(
                    (item) => item.pharmacy_id === product.selected_pharmacy_id
                  )?.pharmacy_id || 0
                }
                product_id={
                  cartPageTrimmedData.find(
                    (item) => item.product_id === product.product_id
                  )?.product_id || 0
                }
                isDisabled={product.product_stock <= 0}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
