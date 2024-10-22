import style from "./index.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import CartPageCart from "../../components/Cart/Card";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../stores/store";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  deleteCartData,
  fetchUserCartData,
  revertInvalidInput,
  revertMaxInvalidData,
  setDebouncedSentData,
  setPersistedData,
  setUpdateCart,
  updateCartData,
} from "../../stores/CartPageReducer";
import CartLoadingOverlay from "./cartLoadingOverlay";
import { errorHandler } from "../../errorHandler/errorHandler";
import { invokeSwal } from "../../utils/invokeSwal";
import Swal from "sweetalert2";
import { mergeCartData } from "../../utils/mergeCartData.";
import { loadState, saveState } from "../../utils/localStorageUtil";
import { address, cartCardPersisted, generalResponse } from "../../utils/types";
import { getAddresses } from "../../stores/ProfileReducer";
import { invokeToast } from "../../utils/invokeToast";

export default function CartPage(): JSX.Element {
  const location = useLocation();

  const {
    debouncedSentData,
    cartPagePersistedData,
    cartPageData,
    cartPageTrimmedData,
    cartPageDataError,
  } = useSelector((state: RootState) => state.cartPage);

  const [source, setSource] = useState("");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isFocused, setIsFocused] = useState(false);

  const dispatchRedux: StoreDispatch = useDispatch();

  const navigate = useNavigate();

  const handleToProductDetails = (pharmacy_id: number, product_id: number) => {
    window.scrollTo(0, 0);
    navigate(`/pharmacy/${pharmacy_id}/product/${product_id}`);
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
          dispatchRedux(deleteCartData({ pharmacy_id, product_id })).then(
            () => {
              dispatchRedux(fetchUserCartData()).then((result) => {
                if (Array.isArray(result.payload)) {
                  const filteredData = mergeCartData({
                    payload: result.payload,
                  });
                  dispatchRedux(setPersistedData(filteredData));
                }
                Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                });
              });
            }
          );
        } else if (!result.isConfirmed) {
          dispatchRedux(revertInvalidInput({ product_id, pharmacy_id }));
        }
      });
    }
  };

  const handleOnChangePharmacyCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = e.currentTarget.checked;
    const pharmacyName = e.currentTarget.name;

    const updatedData = cartPagePersistedData.map((pharmacy) => {
      if (pharmacy.pharmacy_name === pharmacyName) {
        return {
          ...pharmacy,
          items: pharmacy.items.map((item) => {
            return { ...item, is_selected_item: isChecked };
          }),
          is_selected_all_item: isChecked,
        };
      }
      return pharmacy;
    });

    const filteredData = updatedData.map((pharmacy) => {
      return {
        ...pharmacy,
        items: pharmacy.items.filter((item) => {
          return item.quantity > 0;
        }),
      };
    });

    dispatchRedux(setPersistedData(filteredData));
  };

  const handleOnChangeItemCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = e.currentTarget.checked;
    const pharmacyId = Number(e.target.name.split("_")[0]);
    const productId = Number(e.target.name.split("_")[1]);

    const updatedData = cartPagePersistedData.map((pharmacy) => {
      return {
        ...pharmacy,
        items: pharmacy.items.map((item) => {
          if (
            item.pharmacy_id === pharmacyId &&
            item.product_id === productId
          ) {
            if (item.quantity > 0) {
              return {
                ...item,
                is_selected_item: isChecked,
              };
            }
          }
          return item;
        }),
      };
    });

    if (isChecked === false) {
      const result = updatedData.map((pharmacy) => {
        const isEverythingUnchecked = pharmacy.items.every((item) => {
          return item.is_selected_item === false;
        });

        if (isEverythingUnchecked) {
          return {
            ...pharmacy,
            is_selected_all_item: false,
          };
        } else {
          return { ...pharmacy };
        }
      });

      dispatchRedux(setPersistedData(result));
    } else {
      const result = updatedData.map((pharmacy) => {
        const isAnythingChecked = pharmacy.items.find((item) => {
          return item.is_selected_item === true;
        });

        if (isAnythingChecked) {
          return {
            ...pharmacy,
            is_selected_all_item: true,
          };
        } else {
          return { ...pharmacy };
        }
      });
      dispatchRedux(setPersistedData(result));
    }
  };

  const handleAddMore = () => {
    window.scrollTo(0, 0);
    navigate("/home");
  };

  const handleBackButton = () => {
    navigate("/home");
  };

  const handleCheckoutButton = () => {
    if (cartPageData.length === 0) {
      errorHandler(new Error("Cart is empty, please fill in your cart first"));
      return;
    }

    const pageData = (
      loadState("cartPagePersistedData") as cartCardPersisted[]
    ).filter((pharmacy) => {
      return pharmacy.is_selected_all_item;
    });

    const filteredData = pageData.map((pharmacy) => {
      return {
        ...pharmacy,
        items: pharmacy.items.filter((item) => {
          return item.is_selected_item;
        }),
      };
    });

    if (filteredData.length === 0) {
      errorHandler(
        new Error("Cart is empty, please select the items from your cart")
      );
      return;
    }

    saveState("orderPageCartData", filteredData);

    window.scrollTo(0, 0);

    navigate("/checkout");
  };

  useEffect(() => {
    setIsLoading(true);

    dispatchRedux(getAddresses()).then((result) => {
      if (typeof result.payload === "object" && result.payload !== null) {
        const res: generalResponse<address[]> =
          result.payload as generalResponse<address[]>;
        if ((res.data?.length || 0) <= 0) {
          invokeToast("Please fill your address first", "warning");
          navigate("/profile/address");
        }
      }
    });

    dispatchRedux(fetchUserCartData())
      .then((result) => {
        if (Array.isArray(result.payload)) {
          const filteredData = mergeCartData({ payload: result.payload });
          dispatchRedux(setPersistedData(filteredData));
          saveState("lastVisitedPage", location.pathname);
        }
      })
      .then(() => {
        setIsLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const findData = cartPageTrimmedData.find((item) => {
      return item.hasModified === true;
    });

    const notHandleInput =
      source !== "handleChangeQuantity" &&
      source !== "handleOnBlur" &&
      source !== "handleDeleteCart";

    if (findData && notHandleInput && !isFocused) {
      const debounceTimer = setTimeout(() => {
        dispatchRedux(
          setDebouncedSentData({
            pharmacy_id: findData?.pharmacy_id,
            product_id: findData?.product_id,
            quantity: findData?.quantity || 0,
          })
        );
      }, 500);

      setSource("");
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
      debouncedSentData.quantity <= 0 ||
      !debouncedSentData.quantity
    ) {
      return;
    }

    dispatchRedux(updateCartData(debouncedSentData))
      .then((result) => {
        if (Array.isArray(result.payload)) {
          const filteredData = mergeCartData({ payload: result.payload });
          dispatchRedux(setPersistedData(filteredData));
        }
      })
      .then(() => {
        dispatchRedux(fetchUserCartData());
      })
      .catch(() => {
        if (cartPageDataError !== null) {
          errorHandler(new Error(cartPageDataError));
        }
      });
  }, [dispatchRedux, debouncedSentData, cartPageDataError]);

  return (
    <>
      {isLoading ? <CartLoadingOverlay /> : ""}
      <section className={style.cartPageSection}>
        <div className={style.afterSection}>
          {cartPageData.length === 0 ? (
            <div className={style.emptyCart}>
              <p className={style.title}>Your cart is currently empty ._.</p>
              <p className={style.subtitle}>You can fill your cart here:</p>
              <button onClick={handleAddMore} className={style.add_to_cart_inv}>
                + Add more items
              </button>
            </div>
          ) : (
            cartPagePersistedData.map((data, idx) => {
              return (
                <CartPageCart
                  handleOnChangeItemCheckbox={handleOnChangeItemCheckbox}
                  handleOnChangePharmacyCheckbox={
                    handleOnChangePharmacyCheckbox
                  }
                  handleAddQuantity={handleAddQuantity}
                  handleReduceQuantity={handleReduceQuantity}
                  handleChangeQuantity={handleChangeQuantity}
                  handleOnBlur={handleOnBlur}
                  handleDeleteCart={handleDeleteCart}
                  handleToProductDetails={handleToProductDetails}
                  key={idx}
                  cartData={data}
                  cartPageTrimmedData={cartPageTrimmedData}
                />
              );
            })
          )}

          {cartPageData.length === 0 ? (
            <div className={style.emptyCartNav}>
              <button onClick={handleBackButton} className={style.backToHome}>
                <IoIosArrowBack className={style.moveIcon} />
                Go Back
              </button>
            </div>
          ) : (
            <div className={style.navigationButtons}>
              <button onClick={handleAddMore} className={style.add_to_cart}>
                + Add more items
              </button>

              <div className={style.navigationButtonsProgress}>
                <button onClick={handleBackButton} className={style.backToHome}>
                  <IoIosArrowBack className={style.moveIcon} />
                  Go Back
                </button>

                <button
                  onClick={handleCheckoutButton}
                  className={style.checkoutBtn}
                >
                  Checkout
                  <IoIosArrowForward className={style.moveIcon} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
