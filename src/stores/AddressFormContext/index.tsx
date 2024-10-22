import { createContext, ReactNode } from "react";
import {
  addressAction,
  addressFormState,
  initialContentState,
  useAddressValidation,
} from "../../hooks/useAddressValidation";
import {
  addressQuery,
  addressResponse,
  autofilledAddress,
  locationForm,
  locationSearchResponse,
} from "../../utils/types";
import { Map } from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import { get } from "../../utils/fetch";
import { invokeToast } from "../../utils/invokeToast";
import { MapContainer, TileLayer } from "react-leaflet";
import ChangeView from "../../components/AddressForm/ChangeView";
import { useAppDispatch } from "../../hooks/useApp";
import { getAddresses, postAddresses } from "../ProfileReducer";
import { errorHandler } from "../../errorHandler/errorHandler";

export interface AddressFormContextProps {
  mapRef: React.RefObject<Map>;
  location: locationForm | null;
  setLocation: React.Dispatch<React.SetStateAction<locationForm | null>>;
  locationIsValid: boolean;
  setLocationIsValid: React.Dispatch<React.SetStateAction<boolean>>;
  autofilled: autofilledAddress;
  setAutofilled: React.Dispatch<React.SetStateAction<autofilledAddress>>;

  addressForm: addressFormState;
  dispatchAddress: React.Dispatch<addressAction>;

  handleLocation: () => Promise<void>;
  handleUserLocation: () => void;
  handleFormLocation: () => Promise<void>;
  handleAutofill: () => void;
  handleOnSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  displayMap: JSX.Element | null;
  addressFormContentKeys: string[];

  addressQuery: addressQuery;
  setAddressQuery: React.Dispatch<React.SetStateAction<addressQuery>>;

  activeField: number;
  setActiveField: React.Dispatch<React.SetStateAction<number>>;

  multipleField: string;
  setMultipleField: React.Dispatch<React.SetStateAction<string>>;
}

interface AddressFormContextProviderProps {
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}

export const AddressFormContext = createContext<
  AddressFormContextProps | undefined
>(undefined);

const AddressFormContextProvider: React.FC<AddressFormContextProviderProps> = ({
  children,
  onRequestClose,
}) => {
  const AppDispatch = useAppDispatch();
  const mapRef = useRef<Map>(null);
  const [location, setLocation] = useState<null | locationForm>(null);
  const [locationIsValid, setLocationIsValid] = useState(true);
  const [multipleField, setMultipleField] = useState("");
  const [autofilled, setAutofilled] = useState<autofilledAddress>({
    content: initialContentState,
    valid: false,
    isLoading: false,
  });
  const [addressForm, dispatchAddress] = useAddressValidation();

  const [addressQuery, setAddressQuery] = useState<addressQuery>({
    provinces: [],
    cities: [],
    districts: [],
    districtsOfficial: [],
    sub_districts: [],
  });

  const [activeField, setActiveField] = useState<number>(-1);

  const addressFormContentKeys = [
    "province",
    "city",
    "district",
    "sub_district",
    "address_details",
  ];

  const handleLocation = async () => {
    if (!addressForm.isAllValid) {
      dispatchAddress({ type: "validate" });
      return;
    }
    if (
      addressForm.content.district.length > 0 ||
      addressForm.content.city.length > 0
    ) {
      await handleFormLocation().catch(() => {
        handleUserLocation();
      });
    } else {
      handleUserLocation();
    }
  };

  const handleUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLocationIsValid(true);
        },
        (err) => {
          console.error(err);
          invokeToast("Failed to fetch your location", "warning");
        }
      );
    }
    return;
  };

  const handleFormLocation = async () => {
    dispatchAddress({ type: "validate" });

    setLocationIsValid(false);
    const queryURL = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${(
      addressForm.content.district +
      " " +
      addressForm.content.city
        .replace("KOTA ", "")
        .replace("ADM. ", "")
        .replace("KAB. ", "")
        .replace("KABUPATEN ", "")
    )
      .split(" ")
      .join("+")}&format=jsonv2&limit=1&accept-language=id`;

    if (
      addressForm.content.district.length > 0 ||
      addressForm.content.city.length > 0
    ) {
      await get<locationSearchResponse[]>(queryURL)
        .then((data) => {
          if (data.length !== 0) {
            setLocation({
              latitude: data[0].lat,
              longitude: data[0].lon,
            });
            setLocationIsValid(true);
          } else {
            throw new Error("Failed to search");
          }
        })
        .catch(() => {
          throw new Error("Failed to search");
        });
      return;
    }
  };

  const handleAutofill = () => {
    dispatchAddress({
      type: "onchange",
      field: "address_details",
      value: autofilled.content["address_details"],
    });
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatchAddress({ type: "validate" });
    if (!addressForm.isAllValid) return;

    if (location !== null) {
      AppDispatch(postAddresses({ addressForm, location }))
        .then(() => {
          AppDispatch(getAddresses());
          onRequestClose(false);
        })
        .catch((error) => {
          errorHandler(error);
          return;
        });
      return;
    } else {
      invokeToast(
        "Failed to post address, please press Add Location to pinpoint the location",
        "info"
      );
      return;
    }
  };

  const displayMap = useMemo(
    () =>
      location !== null ? (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={16}
          ref={mapRef}
          style={{
            height: "18rem",
            width: "32rem",
            maxWidth: "100%",
            minWidth: "100%",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ChangeView location={location} setLocation={setLocation} />
        </MapContainer>
      ) : null,
    [location]
  );

  useEffect(() => {
    if (mapRef.current !== null && location !== null)
      mapRef.current.setView([location.latitude, location.longitude]);
    const debounceTimer = setTimeout(async () => {
      setAutofilled({
        ...autofilled,
        isLoading: true,
      });
      if (location !== null) {
        get<addressResponse>(
          `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json&accept-language=id`
        )
          .then((data) => {
            setAutofilled({
              content: {
                ...autofilled.content,
                address_line_2: data.display_name,
                address_details:
                  (data.address.road !== undefined ? data.address.road : "") +
                  (data.address.city_block !== undefined
                    ? " " + data.address.city_block
                    : ""),
                sub_district: data.address.neighbourhood,
                district: data.address.suburb,
                city: data.address.city_district,
                province: data.address.city,
                postcode: data.address.postcode,
              },
              valid: true,
              isLoading: false,
            });
          })
          .catch(() => {
            errorHandler(
              new Error("Failed to fetch address from your location")
            );
          });
      }
    }, 3000);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [location]);

  return (
    <>
      <AddressFormContext.Provider
        value={{
          mapRef,
          location,
          setLocation,
          locationIsValid,
          setLocationIsValid,
          autofilled,
          setAutofilled,
          addressForm,
          dispatchAddress,
          handleLocation,
          handleFormLocation,
          handleUserLocation,
          handleAutofill,
          handleOnSubmit,
          displayMap,
          addressFormContentKeys,
          addressQuery,
          setAddressQuery,
          activeField,
          setActiveField,
          setMultipleField,
          multipleField,
        }}
      >
        {children}
      </AddressFormContext.Provider>
    </>
  );
};

export default AddressFormContextProvider;
