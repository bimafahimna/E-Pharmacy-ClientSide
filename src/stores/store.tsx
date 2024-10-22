import { Action, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import ProductReducer from "./ProductReducer";
import ProfileReducer from "./ProfileReducer";
import CartPageReducer from "./CartPageReducer";
import CategoryReducer from "./CategoryReducer";
import PharmacistReducer from "./PharmacistReducer";
import PartnerReducer from "./PartnerReducer";
import PharmacyReducer from "./PharmacyReducer";
import MasterProductReducer from "./MasterProductReducer";
import LogisticsReducer from "./LogisticsReducer";
import OrderReducer from "./OrderReducer";
import PharmacyProductReducer from "./PharmacyProductReducer";
import UserReducer from "./UserReducer";
import SearchProductReducer from "./SearchReducer";
import GlobalLoadingReducer from "./GlobalLoadingReducer";

export const store = configureStore({
  reducer: {
    user: UserReducer,
    product: ProductReducer,
    profile: ProfileReducer,
    cartPage: CartPageReducer,
    category: CategoryReducer,
    pharmacist: PharmacistReducer,
    pharmacy: PharmacyReducer,
    partner: PartnerReducer,
    pharmacyLogistics: LogisticsReducer,
    order: OrderReducer,
    masterProduct: MasterProductReducer,
    pharmacyProduct: PharmacyProductReducer,
    searchProduct: SearchProductReducer,
    globalLoading: GlobalLoadingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreDispatch = ThunkDispatch<RootState, any, Action>;
export default store;
