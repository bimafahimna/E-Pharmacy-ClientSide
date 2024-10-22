import ChangeView from "../../components/AddressForm/ChangeView";
import Input from "../Input";
import clsx from "clsx";
import dropdownMenuStyle from "../../css/dropdown_menu.module.css";
import formStyle from "../../css/form.module.css";
import style from "./index.module.css";
import { FaSearch } from "react-icons/fa";
import { Map } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { get } from "../../utils/fetch";
import { invokeToast } from "../../utils/invokeToast";
import { adminLogistics, locationSearchResponse } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import { Fragment, useEffect, useState } from "react";
import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePharmacyValidation } from "../../hooks/usePharmacyFormValidation";
import {
  getPharmacyPaginated,
  postPharmacy,
} from "../../stores/PharmacyReducer";
import {
  cityResponse,
  locationForm,
  partner,
  pharmacist,
  ResponseError,
} from "../../utils/types";
import { fetchLocationCities } from "../../utils/asyncFunctions";

export interface pharmacyFormProps {
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const PharmacyForm: React.FC<pharmacyFormProps> = ({ onRequestClose }) => {
  const navigate = useNavigate();
  const [pharmacyForm, dispatchPharmacy, isInputValid, formattedCreateRequest] =
    usePharmacyValidation();
  const [addressQuery, setAddressQuery] = useState<cityResponse[]>([]);
  const [partnerQuery, setPartnerQuery] = useState<partner[]>([]);
  const [pharmacistQuery, setPharmacistQuery] = useState<pharmacist[]>([]);
  const [activeField, setActiveField] = useState<number>(0);
  const [debouncedCity, setDebouncedCity] = useState("");
  const [logisticQuery, setLogisticQuery] = useState<adminLogistics[]>([]);
  const [selectedLogistic, setSelectedLogistic] = useState<string[]>([]);
  const AppDispatch = useAppDispatch();
  const {
    post: { isLoading },
  } = useAppSelector((state) => state.pharmacy);

  const [location, setLocation] = useState<null | locationForm>(null);
  const mapRef = useRef<Map>(null);
  const displayMap = useMemo(() => {
    if (mapRef.current !== null && location !== null)
      mapRef.current.setView([location.latitude, location.longitude]);
    if (location === null) return null;
    return (
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={16}
        ref={mapRef}
        style={{
          height: "18rem",
          width: "32rem",
          minWidth: "100%",
          maxWidth: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView location={location} setLocation={setLocation} />
      </MapContainer>
    );
  }, [location, debouncedCity]);

  const handlePost = async () => {
    try {
      if (location === null) throw new Error("Please pinpoint the location");
      await AppDispatch(
        postPharmacy(
          formattedCreateRequest(
            location,
            selectedLogistic.map((item) => Number(item))
          )
        )
      ).unwrap();
      await AppDispatch(getPharmacyPaginated()).unwrap();
      onRequestClose(false);
    } catch (err) {
      if (err instanceof ResponseError && err.statusCode === 401)
        navigate("/auth/login");
    }
  };

  useEffect(() => {
    const queryURL = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=indonesia+${debouncedCity
      .replace("KAB. ", "")
      .replace("KOTA ", "")
      .replace("ADM. ", "")
      .split(" ")
      .join("+")}&format=jsonv2&limit=1&accept-language=id`;
    get<locationSearchResponse[]>(queryURL)
      .then((data) => {
        if (data.length !== 0) {
          setLocation({
            latitude: data[0].lat,
            longitude: data[0].lon,
          });
        } else {
          throw new Error("Failed to search");
        }
      })
      .catch(() => {
        invokeToast("Failed to fetch address from your location", "warning");
        throw new Error("Failed to search");
      });
    return;
  }, [debouncedCity]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkedId = event.target.value;
    if (event.target.checked) {
      setSelectedLogistic([...selectedLogistic, checkedId]);
    } else {
      setSelectedLogistic(selectedLogistic.filter((id) => id !== checkedId));
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    dispatchPharmacy({
      type: "onchange",
      value: event.target.value,
      field: event.target.id,
      id: null,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatchPharmacy({
      type: "validate",
      value: "",
      field: "",
    });
    if (location === null) return;
    if (!isInputValid()) return;
    handlePost();
  };

  const handleGetCities = async () => {
    const data = await fetchLocationCities(pharmacyForm.content.city);
    if (data.data !== undefined) setAddressQuery(data.data);
  };

  useEffect(() => {
    const debounceTimeId = setTimeout(() => {
      setDebouncedCity(pharmacyForm.content.city);
      handleGetCities();
    }, 2000);

    return () => {
      clearTimeout(debounceTimeId);
    };
  }, [pharmacyForm.content.city, activeField === 2]);

  useEffect(() => {
    const debounceTimeId = setTimeout(() => {
      setDebouncedCity(pharmacyForm.content.city);
      get<{ data: partner[] }>(
        import.meta.env.VITE_BASE_URL +
          "/admin/partners?name=" +
          pharmacyForm.content.partner,

        { credentials: "include" as RequestCredentials }
      ).then((data) => {
        setPartnerQuery(data.data);
      });
    }, 2000);

    return () => {
      clearTimeout(debounceTimeId);
    };
  }, [pharmacyForm.content.partner, activeField === 0]);

  useEffect(() => {
    const debounceTimeId = setTimeout(() => {
      setDebouncedCity(pharmacyForm.content.city);
      get<{ data: pharmacist[] }>(
        import.meta.env.VITE_BASE_URL +
          "/admin/pharmacists?name=" +
          pharmacyForm.content.pharmacist,

        { credentials: "include" as RequestCredentials }
      ).then((data) => {
        setPharmacistQuery(data.data);
      });
    }, 2000);

    return () => {
      clearTimeout(debounceTimeId);
    };
  }, [pharmacyForm.content.pharmacist, activeField === 1]);

  useEffect(() => {
    get<{ data: adminLogistics[] }>(
      import.meta.env.VITE_BASE_URL + "/logistics",
      { credentials: "include" as RequestCredentials }
    ).then((data) => {
      setLogisticQuery(data.data);
    });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className={formStyle.wrapper}>
        <div>
          <h2>Add Pharmacy</h2>
          <hr />
        </div>
        <div style={{ position: "relative" }}>
          <p>Partner</p>
          <div style={{ color: "var(--accent-color)", position: "relative" }}>
            <Input
              id="partner"
              type="partner"
              name="partner"
              onChange={handleOnChange}
              onFocus={() => setActiveField(0)}
              placeholder="Century"
              value={pharmacyForm.content.partner}
              className={clsx(style.input, style.multiple_input)}
              autoComplete="off"
            />
            <FaSearch className={dropdownMenuStyle.search_icon} />
          </div>

          {activeField === 0 && (
            <div className={dropdownMenuStyle.dropdown_menu}>
              <div
                className={clsx({
                  [dropdownMenuStyle.dropdown_menu_overflow]:
                    partnerQuery.length >= 3,
                })}
              >
                {partnerQuery.map((val, index) => (
                  <button
                    key={index}
                    className={dropdownMenuStyle.dropdown_menu_items}
                    onClick={() => {
                      dispatchPharmacy({
                        type: "onchange",
                        field: "partner",
                        value: val.name,
                        id: val.id.toString(),
                      });

                      setActiveField(-1);
                    }}
                  >
                    <p>{val.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <p>Logistic Partner</p>

          <div
            className={style.logistics}
            style={{
              gridTemplateColumns: `repeat(${logisticQuery.length}, 1fr)`,
            }}
          >
            {logisticQuery.map((item, index) => (
              <Fragment key={index}>
                <input
                  type="checkbox"
                  name="logistics"
                  value={item.id.toString()}
                  checked={selectedLogistic.includes(item.id.toString())}
                  onChange={(e) => handleCheckboxChange(e)}
                  id={item.id.toString()}
                />
                <label htmlFor={item.id.toString()}>
                  {item.name} {item.service}
                </label>
              </Fragment>
            ))}
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <p>Pharmacist</p>
          <div style={{ color: "var(--accent-color)", position: "relative" }}>
            <Input
              id="pharmacist"
              type="pharmacist"
              name="pharmacist"
              onChange={handleOnChange}
              onFocus={() => setActiveField(1)}
              placeholder="Century"
              value={pharmacyForm.content.pharmacist}
              className={clsx(style.input, style.multiple_input)}
              autoComplete="off"
            />
            <FaSearch className={dropdownMenuStyle.search_icon} />
          </div>

          {activeField === 1 && (
            <div className={dropdownMenuStyle.dropdown_menu}>
              <div
                className={clsx({
                  [dropdownMenuStyle.dropdown_menu_overflow]:
                    pharmacistQuery.length >= 3,
                })}
              >
                {pharmacistQuery.map((val, index) => (
                  <button
                    key={index}
                    className={dropdownMenuStyle.dropdown_menu_items}
                    onClick={() => {
                      dispatchPharmacy({
                        type: "onchange",
                        field: "pharmacist",
                        value: val.name,
                        id: val.id.toString(),
                      });

                      setActiveField(-1);
                    }}
                  >
                    <p>{val.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <p>Pharmacy Name</p>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Budi Farma"
            onChange={handleOnChange}
            value={pharmacyForm.content.name}
            className={clsx(style.input, style.form, {
              [style.error_input]: !pharmacyForm.validities.name,
            })}
          />
        </div>

        <div>
          <p>Address Details</p>
          <Input
            id="address"
            name="address"
            type="address"
            onChange={handleOnChange}
            value={pharmacyForm.content.address}
            className={clsx(style.input, style.form, {
              [style.error_input]: !pharmacyForm.validities.address,
            })}
          />
        </div>

        <div style={{ position: "relative" }}>
          <p>City</p>
          <div style={{ color: "var(--accent-color)", position: "relative" }}>
            <Input
              id="city"
              type="city"
              name="city"
              onChange={handleOnChange}
              onFocus={() => setActiveField(2)}
              placeholder="Jakarta"
              value={pharmacyForm.content.city}
              className={clsx(style.input, style.multiple_input)}
              autoComplete="off"
            />
            <FaSearch className={dropdownMenuStyle.search_icon} />
          </div>

          {activeField === 2 && (
            <div className={dropdownMenuStyle.dropdown_menu}>
              <div
                className={clsx({
                  [dropdownMenuStyle.dropdown_menu_overflow]:
                    addressQuery.length >= 3,
                })}
              >
                {addressQuery.map((val, index) => (
                  <button
                    key={index}
                    className={dropdownMenuStyle.dropdown_menu_items}
                    onClick={() => {
                      dispatchPharmacy({
                        type: "onchange",
                        field: "city",
                        value: val.city_name,
                        id: val.city_unofficial_id,
                      });

                      setActiveField(-1);
                    }}
                  >
                    <p>
                      {val.city_name} {val.city_unofficial_id}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>{displayMap}</div>

        <div className={formStyle.checkbox_wrapper}>
          <label htmlFor="active">Set as active</label>
          <Input
            id="active"
            type="checkbox"
            name="active"
            onChange={() =>
              dispatchPharmacy({
                type: "onchange",
                field: "is_active",
                value:
                  pharmacyForm.content.is_active === "false" ? "true" : "false",
              })
            }
            checked={pharmacyForm.content.is_active === "true"}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => onRequestClose(false)}
            className={formStyle.button}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className={clsx(formStyle.submit, {
              [formStyle.opacity]: isLoading,
            })}
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default PharmacyForm;
