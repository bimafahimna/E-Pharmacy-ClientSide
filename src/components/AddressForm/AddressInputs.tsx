import * as constants from "../../constants/address";
import Input from "../Input";
import clsx from "clsx";
import formStyle from "../../css/form.module.css";
import style from "./index.module.css";
import { FaSearch } from "react-icons/fa";
import { addressForm } from "../../utils/types";
import { useAddressForm } from "../../stores/AddressFormContext/useAddressForm";
import { useEffect } from "react";
import {
  fetchLocationCities,
  fetchLocationDistricts,
  fetchLocationProvinces,
  fetchLocationSubDistricts,
} from "../../utils/asyncFunctions";

const AddressInputs: React.FC = () => {
  const {
    addressForm,
    addressFormContentKeys,
    activeField,
    dispatchAddress,
    addressQuery,
    setAddressQuery,
    setActiveField,
    multipleField,
    setMultipleField,
  } = useAddressForm();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchAddress({
      type: "onchange",
      field: event.target.id as keyof addressForm,
      value: event.target.value,
    });
  };

  const handlerOnChangeOneInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const addressArray = event.target.value.split(", ");
    setMultipleField(event.target.value);
    addressFormContentKeys.forEach((_val, index) => {
      if (index > 3) return;
      if (index === addressArray.length - 1) {
        setActiveField(index);
      }
      dispatchAddress({
        type: "onchange",
        field: addressFormContentKeys[index] as keyof addressForm,
        value: addressArray[index] === undefined ? "" : addressArray[index],
      });
    });
  };

  const handlerOnFocusInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const addressArray = event.target.value.split(", ");
    setMultipleField(event.target.value);
    setActiveField(addressArray.length - 1);
    event.currentTarget.setSelectionRange(
      event.currentTarget.value.length,
      event.currentTarget.value.length
    );
  };

  const handlerOnBlurInput = () => {
    setActiveField(-1);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (activeField === 0)
        fetchLocationProvinces(addressForm.content.province).then((data) => {
          setAddressQuery({ ...addressQuery, provinces: data.data! });
        });

      if (activeField === 1)
        fetchLocationCities(
          addressForm.content.city,
          addressForm.id.province
        ).then((data) => {
          setAddressQuery({ ...addressQuery, cities: data.data! });
        });

      if (activeField === 2)
        fetchLocationDistricts(
          addressForm.content.district,
          addressForm.official_id.city
        ).then((data) => {
          setAddressQuery({ ...addressQuery, districts: data.data! });
        });

      if (activeField === 3)
        fetchLocationSubDistricts(
          addressForm.content.sub_district,
          addressForm.official_id.district
        ).then((data) => {
          setAddressQuery({ ...addressQuery, sub_districts: data.data! });
        });
    }, 1000);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [
    activeField === -1,
    addressForm.content,
    addressForm.id,
    addressForm.official_id,
  ]);

  const isAddressDropdownValid = !(
    !addressForm.validities.province[0] ||
    !addressForm.validities.city[0] ||
    !addressForm.validities.district[0] ||
    !addressForm.validities.sub_district[0]
  );

  return (
    <>
      <button
        className={clsx(style.display_none, {
          [style.background]: activeField > -1,
        })}
        onClick={handlerOnBlurInput}
        type="button"
      ></button>

      <div
        className={[formStyle.inline_input, formStyle.inline_input_even].join(
          " "
        )}
      >
        <div>
          <p>Receiver Name</p>
          <Input
            id="receiver_name"
            type="receiver_name"
            name="receiver_name"
            onChange={handleOnChange}
            placeholder="Receiver Name"
            value={addressForm.content.receiver_name}
            className={clsx(style.input, style.form, {
              [style.error_input]: !addressForm.validities.receiver_name[0],
            })}
          />
          <p className={formStyle.error}>
            {addressForm.validities.receiver_name[1]}
          </p>
        </div>

        <div>
          <p>Address Name</p>
          <Input
            id="name"
            type="name"
            name="name"
            onChange={handleOnChange}
            placeholder="Kantor, Rumah, etc."
            value={addressForm.content.name}
            className={clsx(style.input, style.form, {
              [style.error_input]: !addressForm.validities.name[0],
            })}
          />
          <p className={formStyle.error}>{addressForm.validities.name[1]}</p>
        </div>
      </div>

      <div>
        <p>Phone Number</p>
        <Input
          id="receiver_phone_number"
          type="receiver_phone_number"
          name="receiver_phone_number"
          onChange={handleOnChange}
          placeholder="Receiver Phone Number"
          value={addressForm.content.receiver_phone_number}
          className={clsx(style.input, style.form, {
            [style.error_input]:
              !addressForm.validities.receiver_phone_number[0],
          })}
        />
        <p className={formStyle.error}>
          {addressForm.validities.receiver_phone_number[1]}
        </p>
      </div>

      <div style={{ position: "relative" }}>
        <p>Province, City, District, Sub District</p>
        <div style={{ color: "var(--accent-color)", position: "relative" }}>
          <Input
            id="multiple"
            type="multiple"
            name="multiple"
            onChange={handlerOnChangeOneInput}
            onFocus={handlerOnFocusInput}
            placeholder="Province, City, District, Sub District"
            value={multipleField}
            className={clsx(style.input, style.multiple_input, {
              [style.error_input]: !isAddressDropdownValid,
            })}
            autoComplete="off"
          />
          <FaSearch className={style.search_icon} />
        </div>
        {!isAddressDropdownValid && (
          <p className={formStyle.error}>{constants.ErrDropdown}</p>
        )}

        {activeField > -1 && (
          <div className={style.dropdown_menu}>
            <div className={clsx(style.dropdown_menu_header)}>
              <button
                className={clsx({
                  [style.active_dropdown]: activeField >= 0,
                })}
                onClick={() => {
                  setActiveField(0);
                }}
                type="button"
              >
                Province
              </button>
              <button
                className={clsx({ [style.active_dropdown]: activeField >= 1 })}
                disabled={addressForm.content.province.length === 0}
                onClick={() => {
                  setActiveField(1);
                }}
                type="button"
              >
                City
              </button>
              <button
                className={clsx({ [style.active_dropdown]: activeField >= 2 })}
                disabled={
                  addressForm.content.city.length === 0 ||
                  addressForm.content.province.length === 0
                }
                onClick={() => {
                  setActiveField(2);
                }}
                type="button"
              >
                District
              </button>

              <button
                className={clsx({ [style.active_dropdown]: activeField >= 3 })}
                disabled={
                  addressForm.content.province.length === 0 ||
                  addressForm.content.city.length === 0 ||
                  addressForm.content.district.length === 0
                }
                onClick={() => {
                  setActiveField(3);
                }}
                type="button"
              >
                Sub district
              </button>

              <div
                className={style.line}
                style={{ transform: `translateX(${activeField * 100}%)` }}
              ></div>

              <div className={style.gray_line}></div>
            </div>

            {activeField === 0 && (
              <div
                className={clsx(style.dropdown_menu_wrapper, {
                  [style.dropdown_menu_overflow]:
                    addressQuery.provinces.length >= 10,
                })}
              >
                {addressQuery.provinces.map((val, index) => (
                  <button
                    key={index}
                    className={style.dropdown_menu_items}
                    onClick={() => {
                      dispatchAddress({
                        type: "onchange",
                        field: "province",
                        value: val.province,
                        id: val.id,
                      });

                      dispatchAddress({
                        type: "onchange",
                        field: "city",
                        value: "",
                        id: null,
                      });

                      setMultipleField(() => {
                        const addresses = multipleField.split(", ");
                        if (addresses[0] !== "") {
                          addresses[0] = val.province;
                          for (let i = 1; i < addresses.length; i++) {
                            addresses[i] = "";
                          }
                          return addresses.join("") + ", ";
                        }

                        addresses[0] = val.province;
                        return addresses.join(", ") + ", ";
                      });

                      setAddressQuery({ ...addressQuery, cities: [] });
                      setActiveField(1);
                    }}
                  >
                    <p>{val.province}</p>
                  </button>
                ))}
              </div>
            )}

            {activeField === 1 && (
              <div
                className={clsx(style.dropdown_menu_wrapper, {
                  [style.dropdown_menu_overflow]:
                    addressQuery.cities.length >= 10,
                })}
              >
                {addressQuery.cities.map((val, index) => (
                  <button
                    key={index}
                    className={style.dropdown_menu_items}
                    onClick={() => {
                      dispatchAddress({
                        type: "onchange",
                        field: "city",
                        value: val.city_type + " " + val.city_name,
                        id: val.city_unofficial_id,
                        official_id: val.id,
                      });

                      dispatchAddress({
                        type: "onchange",
                        field: "district",
                        value: "",
                        id: null,
                      });

                      setMultipleField(() => {
                        const addresses = multipleField.split(", ");
                        if (addresses[1] !== "") {
                          addresses[1] = val.city_type + " " + val.city_name;
                          for (let i = 2; i < addresses.length; i++) {
                            addresses[i] = "";
                          }
                          return (
                            addresses
                              .filter((item) => item.length !== 0)
                              .join(", ") + ", "
                          );
                        }

                        addresses[1] = val.city_type + " " + val.city_name;
                        return addresses.join(", ") + ", ";
                      });

                      setAddressQuery({ ...addressQuery, districts: [] });
                      setActiveField(2);
                    }}
                  >
                    <p>
                      {val.city_type} {val.city_name}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {activeField === 2 && (
              <div
                className={clsx(style.dropdown_menu_wrapper, {
                  [style.dropdown_menu_overflow]:
                    addressQuery.districts.length >= 10,
                })}
              >
                {addressQuery.districts.map((val, index) => (
                  <button
                    key={index}
                    className={style.dropdown_menu_items}
                    onClick={() => {
                      dispatchAddress({
                        type: "onchange",
                        field: "district",
                        value: val.district.toUpperCase(),
                        official_id: val.id,
                      });

                      dispatchAddress({
                        type: "onchange",
                        field: "sub_district",
                        value: "",
                        id: null,
                      });

                      setMultipleField(() => {
                        const addresses = multipleField.split(", ");
                        if (addresses[2] !== "") {
                          addresses[2] = val.district;
                          for (let i = 3; i < addresses.length; i++) {
                            addresses[i] = "";
                          }
                          return (
                            addresses
                              .filter((item) => item.length !== 0)
                              .join(", ") + ", "
                          );
                        }

                        addresses[2] = val.district.toUpperCase();
                        return addresses.join(", ") + ", ";
                      });

                      setAddressQuery({ ...addressQuery, sub_districts: [] });
                      setActiveField(3);
                    }}
                  >
                    <p>{val.district.toUpperCase()}</p>
                  </button>
                ))}
              </div>
            )}

            {activeField === 3 && (
              <div
                className={clsx(style.dropdown_menu_wrapper, {
                  [style.dropdown_menu_overflow]:
                    addressQuery.provinces.length >= 10,
                })}
              >
                {addressQuery.sub_districts.map((val, index) => (
                  <button
                    key={index}
                    className={style.dropdown_menu_items}
                    onClick={() => {
                      dispatchAddress({
                        type: "onchange",
                        field: "sub_district",
                        value: val.sub_district.toUpperCase(),
                        official_id: val.id,
                      });

                      setMultipleField(() => {
                        const addresses = multipleField.split(", ");
                        if (addresses[3] !== "") {
                          addresses[3] = val.sub_district;
                          for (let i = 4; i < addresses.length; i++) {
                            addresses[i] = "";
                          }
                          return addresses.join(", ");
                        }

                        addresses[3] = val.sub_district.toUpperCase();
                        return addresses.join(", ");
                      });

                      setActiveField(-1);
                    }}
                  >
                    <p>{val.sub_district.toUpperCase()}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <p>Address Details</p>
        <Input
          id="address_details"
          type="address_details"
          name="address_details"
          onChange={handleOnChange}
          placeholder="Address Line"
          value={addressForm.content.address_details}
          className={clsx(style.input, style.form, {
            [style.error_input]: !addressForm.validities.address_details[0],
          })}
        />

        <p className={formStyle.error}>
          {addressForm.validities.address_details[1]}
        </p>
      </div>

      <div>
        <p>Postcode</p>
        <Input
          id="postcode"
          type="postcode"
          name="postcode"
          onChange={handleOnChange}
          placeholder="Postcode"
          value={addressForm.content.postcode}
          className={clsx(style.input, style.form, {
            [style.error_input]: !addressForm.validities.postcode[0],
          })}
        />
        <p className={formStyle.error}>{addressForm.validities.postcode[1]}</p>
      </div>
    </>
  );
};
export default AddressInputs;
