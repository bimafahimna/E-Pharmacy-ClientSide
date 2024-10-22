export interface emailUser {
  email: string;
  password: string;
  passwordConf: string;
}

export interface emailUserLogin {
  email: string;
  password: string;
}

export interface userData {
  password: string;
  passwordConf: string;
  token?: string | null;
}

export interface generalResponse<T> {
  message: string;
  data?: T;
}
export interface messageOnlyResponse {
  message: string;
}

export interface loginResponse {
  url: string;
}

export interface popularRequest {
  latitude: string;
  longitude: string;
}

export interface productDetailsPharmacies {
  pharmacy_id: number;
  pharmacy_name: string;
  address: string;
  city_name: string;
  product_id: number;
  product_price: string;
  stock: number;
  currently_chosen?: boolean;
}

export interface shopDetailsRequest {
  pharmacy_id: number;
  product_id: number;
}

export interface shopProductDetails {
  product_id: number;
  product_name: string;
  product_generic_name: string;
  product_image_url: string;
  product_form: string;
  product_manufacturer: string;
  product_classification: string;
  product_category: string;
  product_description: string;
  product_selling_unit: string;
  product_unit_in_pack: number;
  product_weight: string;
  selected_product_stock: number;
  selected_product_price: string;
  selected_product_sold_amount: number;
  selected_pharmacy_id: number;
  selected_pharmacy_name: string;
  selected_pharmacist_name: string;
  selected_pharmacist_phone_number: string;
  selected_pharmacist_SIPA_number: string;
  selected_pharmacy_address: string;
  selected_pharmacy_city_name: string;
}

export interface shopPharmacistInfo {
  selected_pharmacist_name: string | undefined;
  selected_pharmacist_phone_number: string | undefined;
  selected_pharmacist_SIPA_number: string | undefined;
  selected_pharmacy_address: string | undefined;
}

export interface shopProduct {
  selected_pharmacy_id: number;
  product_id: number;
  product_form_id: number;
  product_selling_unit: string;
  image_url: string;
  product_price: string;
  product_stock: number;
  product_name: string;
}

export interface address {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  receiver_name: string;
  receiver_phone_number: string;
  province: string;
  city: string;
  district: string;
  sub_district: string;
  is_active: string;
  address_details: string;
  address_line_2: string;
  currently_selected: boolean;
}

export interface profileState {
  data: {
    email: string;
    profile_photo_url: string;
    profile_addresses: address[];
  };
  isGet: boolean;
  chosenAddress: address | null;
}

export interface crudState<T> {
  paginated: {
    message: string;
    data: T[];
    pagination: pagination;
    query: {
      page: number;
      limit: number;
      sortBy: keyof T;
      sort: "asc" | "desc";
      filters: { [properties in keyof T]: [boolean, string] };
    };
    isLoading: boolean;
  };
  post: {
    message: string;
    isLoading: boolean;
  };
  put: {
    id: number;
    data: T | null;
    message: string;
    isLoading: boolean;
  };
  delete: {
    id: number;
    message: string;
    isLoading: boolean;
  };
  patch?: {
    id: number;
    message: string;
    isLoading: boolean;
  };
}

export interface pharmacyState {
  paginated: {
    message: string;
    data: pharmacy[];
    pagination: pagination;
    query: {
      page: number;
      limit: number;
    };
    isLoading: boolean;
  };
  post: {
    message: string;
    isLoading: boolean;
  };
  put: {
    message: string;
    isLoading: boolean;
  };
}

export interface partnerState {
  paginated: {
    message: string;
    data: partner[];
    pagination: pagination;
    query: {
      page: number;
      limit: number;
    };
    isLoading: boolean;
  };
  post: {
    message: string;
    isLoading: boolean;
  };
  put: {
    message: string;
    isLoading: boolean;
  };
}

export interface pagination {
  total_records: number;
  total_pages: number;
  current_page: number;
  prev_page: boolean;
  next_page: boolean;
}

export interface getPharmacistRequest {
  data: pharmacist[];
  message: string;
  pagination: pagination;
}

export interface getPharmacistByIDRequest {
  data: pharmacist;
  message: string;
}

export interface deletePharmcistByIDRequest {
  message: string;
}

export interface getPaginatedRequest<T> {
  data: T[];
  message: string;
  pagination: pagination;
}

export interface getPartnerRequest {
  data: partner[];
  message: string;
  pagination: pagination;
}

export interface getPharmacyRequest {
  data: pharmacy[];
  message: string;
  pagination: pagination;
}

export interface product {
  id: number;
  selected_pharmacy: pharmacy;
  name: string;
  generic_name: string;
  manufacturer: string;
  description: string;
  product_classification_id: number;
  product_form_id: number;
  product_price: string;
  product_stock: number;
  product_name: string;
}

export interface masterProduct {
  id: number;
  name: string;
  manufacturer: string;
  product_classification: string;
  product_form: string;
  is_active: boolean;
}

export interface pharmacyProduct {
  pharmacy_id: number;
  product_id: number;
  name: string;
  generic_name: string;
  manufacturer: string;
  product_classification: string;
  product_form: string;
  price: string;
  stock: number;
  is_active: boolean;
}

export interface entities {
  id: number;
  name: string;
}

export interface pharmacy {
  id: number;
  name: string;
  pharmacist: entities;
  partner: entities;
  address: string;
  city: entities;
  latitude: number;
  longitude: number;
  is_active: string;
}

export interface cartItems {
  product_id: number;
  pharmacy_id: number;
  name: string;
  image_url: string;
  price: string;
  stock: number;
  quantity: number;
  selling_unit: string;
  description: string;
  weight: string;
}

export interface cartCardType {
  pharmacy_name: string;
  items: cartItems[];
}

export interface cartItemsPersisted {
  product_id: number;
  pharmacy_id: number;
  name: string;
  image_url: string;
  price: string;
  stock: number;
  quantity: number;
  selling_unit: string;
  description: string;
  is_selected_item: boolean;
  weight: string;
}

export interface cartCardPersisted {
  pharmacy_name: string;
  pharmacy_id: number;
  is_selected_all_item: boolean;
  items: cartItemsPersisted[];
  order_weight: string;
}

export interface addressResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: number;
  lon: number;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    road: string;
    city_block: string;
    neighbourhood: string;
    suburb: string;
    city_district: string;
    city: string;
    "ISO3166-2-lvl4": string;
    region: string;
    "ISO3166-2-lvl3": string;
    postcode: string;
    country: string;
    country_code: string;
  };
  boundingbox: number[];
}

export interface addressForm {
  name: string;
  receiver_name: string;
  receiver_phone_number: string;
  address_details: string;
  address_line_2: string;
  sub_district: string;
  district: string;
  city: string;
  province: string;
  postcode: string;
  is_active: string;
}

export interface addressFormValidities {
  name: [boolean, string];
  receiver_name: [boolean, string];
  receiver_phone_number: [boolean, string];
  address_details: [boolean, string];
  address_line_2: [boolean, string];
  sub_district: [boolean, string];
  district: [boolean, string];
  city: [boolean, string];
  province: [boolean, string];
  postcode: [boolean, string];
}

export interface locationForm {
  latitude: number;
  longitude: number;
}

export interface locationSearchResponse {
  address: {
    "ISO3166-2-lvl4": string;
    borough: string;
    city: string;
    country: string;
    country_code: string;
    neighbourhood: string;
    postcode: string;
    road: string;
    shop: string;
    suburb: string;
  };
  addresstype: string;
  boundingbox: number[];
  category: string;
  display_name: string;
  importance: number;
  lat: number;
  licence: string;
  lon: number;
  name: string;
  osm_id: number;
  osm_type: string;
  place_id: number;
  place_rank: number;
  type: string;
}

export interface autofilledAddress {
  content: addressForm;
  valid: boolean;
  isLoading: boolean;
}

export interface provinceResponse {
  id: string;
  province: string;
}

export interface cityResponse {
  id: string;
  province_id: string;
  city_name: string;
  city_type: string;
  city_unofficial_id: string | null;
  province_unofficial_id: string;
}

export interface districtResponse {
  id: string;
  city_id: string;
  district: string;
}

export interface districtRequest {
  city_id: string;
  city_official_id: string | null;
  district: string;
  district_id: string;
  district_official: string | null;
  district_official_id: string | null;
}

export interface subDistrictResponse {
  id: string;
  district_id: string;
  sub_district: string;
}

export interface addressQuery {
  provinces: provinceResponse[];
  cities: cityResponse[];
  districts: districtResponse[];
  districtsOfficial: districtResponse[];
  sub_districts: subDistrictResponse[];
}

export interface addressActiveField {
  province: boolean;
  city: boolean;
  district: boolean;
  sub_district: boolean;
}

export interface addressesResponse {
  data: address[];
}

export interface cartSentUpdateRequest {
  pharmacy_id: number;
  product_id: number;
  quantity: number;
}

export interface cartSentDeleteRequest {
  pharmacy_id: number;
  product_id: number;
}

export interface cartRevertInput {
  pharmacy_id: number;
  product_id: number;
}

export interface cartTrimmedData {
  pharmacy_id: number;
  product_id: number;
  quantity: number;
  stock: number;
  hasModified: boolean;
}

export interface shopProductState {
  shopPopularData: shopProduct[];
  shopPopularDataWithLocation: shopProduct[];
  shopProductDetailsData: shopProductDetails | null;
  shopProductDetailsAvailablePharmacies: productDetailsPharmacies[];
  availablePharmacyLoading: boolean;
  shopLoading: boolean;
  shopError: string | null;
}

export interface cartPageState {
  debouncedSentData: cartSentUpdateRequest;
  cartPagePersistedData: cartCardPersisted[];
  cartPageTrimmedData: cartTrimmedData[];
  cartPageData: cartCardType[];
  cartPageDataLoading: boolean;
  cartPageDataError: string | null;
}

export interface pharmacist {
  id: string;
  name: string;
  email: string;
  sipa_number: string;
  whatsapp_number: string;
  years_of_experience: string;
  is_assigned: string;
}

export interface pharmacistForm {
  name: string;
  email: string;
  password: string;
  sipa_number: string;
  whatsapp_number: string;
  years_of_experience: string;
}

export interface editPharmacistRequest {
  whatsapp_number: string;
  years_of_experience: string;
}

export interface editPartnerRequest {
  logo_url: string;
  name: string;
  is_active: string;
  year_founded: number;
  active_days: number[];
  operational_start: string;
  operational_stop: string;
}

export interface pharmacistFormValidities {
  name: [boolean, string];
  email: [boolean, string];
  password: [boolean, string];
  sipa_number: [boolean, string];
  whatsapp_number: [boolean, string];
  years_of_experience: [boolean, string];
}

export interface user {
  id: string;
  email: string;
  role: string;
  is_verified: string;
  created_at: string;
  updated_at: string;
}

export interface partner {
  id: number;
  name: string;
  logo_url: string;
  year_founded: string;
  active_days: string;
  operational_start: string;
  operational_stop: string;
  is_active: string;
  created_at: string;
  updated_at: string;
}

export interface partnerForm {
  name: string;
  year_founded: string;
  operational_start: string;
  operational_stop: string;
  logo_url: string;
  is_active: string;
}

export interface partnerFormValidities {
  name: [boolean, string];
  year_founded: [boolean, string];
  operational_start: [boolean, string];
  operational_stop: [boolean, string];
  logo_url: [boolean, string];
  is_active: [boolean, string];
}

export interface masterProductForm {
  name: string;
  manufacturer: string;
  product_classification: string;
  product_form: string;
  generic_name: string;
  categories: string;
  description: string;
  unit_in_pack: string;
  selling_unit: string;
  weight: string;
  height: string;
  length: string;
  width: string;
  image_url: string;
  is_active: string;
}

export type pharmacyProductForm = {
  [properties in keyof pharmacyProduct]?: string;
};

export type pharmacyProductValidities = {
  [properties in keyof pharmacyProduct]?: [boolean, string];
};

export interface masterProductFormValidities {
  name: [boolean, string];
  manufacturer: [boolean, string];
  product_classification: [boolean, string];
  product_form: [boolean, string];
  generic_name: [boolean, string];
  categories: [boolean, string];
  description: [boolean, string];
  unit_in_pack: [boolean, string];
  selling_unit: [boolean, string];
  weight: [boolean, string];
  height: [boolean, string];
  length: [boolean, string];
  width: [boolean, string];
  image_url: [boolean, string];
  is_active: [boolean, string];
}

export interface pharmacyForm {
  pharmacist: string;
  partner: string;
  name: string;
  address: string;
  city: string;
  is_active: string;
}

export interface pharmacyFormValidities {
  pharmacist: boolean;
  partner: boolean;
  name: boolean;
  address: boolean;
  city: boolean;
  is_active: boolean;
}

export interface pharmacyFormId {
  pharmacist: string | null;
  partner: string | null;
  name: string | null;
  address: string | null;
  city: string | null;
  is_active: string | null;
}

export interface createPharmacyRequest {
  pharmacist_id: number;
  partner_id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  logistics: number[];
  city: string;
  city_id: number;
  is_active: string;
}

export interface createPharmacistRequest {
  name: string;
  email: string;
  password: string;
  sipa_number: string;
  whatsapp_number: string;
  years_of_experience: string;
}

export interface createPartnerRequest {
  name: string;
  year_founded: number;
  active_days: number[];
  operational_start: string;
  operational_stop: string;
  logo_url: string;
  is_active: string;
}

export interface createMasterProductRequest {
  name: string;
  manufacturer_id: string;
  product_classification_id: string;
  product_form_id: string;
  generic_name: string;
  categories: string;
  description: string;
  unit_in_pack: string;
  selling_unit: string;
  weight: string;
  height: string;
  length: string;
  width: string;
  image_url: string;
  is_active: string;
}

export interface createAddressRequest {
  name: string;
  receiver_name: string;
  receiver_phone_number: string;
  address_details: string;
  address_line_2: string;
  sub_district: string;
  district: string;
  city: string;
  city_id: string;
  province: string;
  postcode: string;
  is_active: string;
  latitude: string;
  longitude: string;
}

export class ResponseError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ResponseError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface logisticsItem {
  id: number;
  name: string;
  image_url: string;
  estimation: string;
  service: string;
  price: string;
  is_recommended: boolean;
  currently_chosen?: boolean;
}

export interface checkoutLogistics {
  pharmacy_id: number;
  pharmacy_name: string;
  logistics: logisticsItem[];
}

export interface logisticsDataState {
  logisticsData: checkoutLogistics[];
  logisticsLoading: boolean;
  logisticsError: null | string;
}

export interface logisticsParam {
  pharmacy_id: number;
  address_id: number;
  order_weight: string;
}

export interface userOrderItems {
  pharmacy_id: number;
  product_id: number;
  image_url: string;
  name: string;
  quantity: number;
  price: string;
}

export interface userOrderRequestItem {
  address: string;
  contact_name: string;
  contact_phone: string;
  pharmacy_id: number;
  pharmacy_name: string;
  logistic_name: string;
  logistic_cost: string;
  logistic_id: number;
  order_items: userOrderItems[];
  order_amount: string;
}

export interface userOrderHistory {
  address: string;
  contact_name: string;
  contact_phone: string;
  pharmacy_id: number;
  pharmacy_name: string;
  logistic_name: string;
  logistic_cost: string;
  order_id: number;
  order_items: userOrderItems[];
  status: string;
  order_amount: string;
}

export interface orderRequest {
  orders: userOrderRequestItem[];
  payment_method: string | "Bank Transfer";
  payment_amount: string;
}

export interface userOrderUnpaidItem {
  address: string;
  contact_name: string;
  contact_phone: string;
  pharmacy_id: number;
  pharmacy_name: string;
  logistic_name: string;
  logistic_cost: string;
  order_id: number;
  order_items: userOrderItems[];
  order_amount: string;
}

export interface userOrderUnpaid {
  payment_id: number;
  orders: userOrderUnpaidItem[];
  payment_amount: string;
}

export interface orderState {
  userOrderRequestData: orderRequest | null;
  userOrderHistoryData: userOrderHistory[];
  userOrderProccessedData: userOrderHistory[];
  userOrderSentData: userOrderHistory[];
  userOrderConfirmedData: userOrderHistory[];
  userOrderCancelledData: userOrderHistory[];
  userOrderUnpaidData: userOrderUnpaid[];
  userOrderLoading: boolean;
  userOrderError: null | string;
}

export interface paymentProofRequest {
  payment_id: number;
  photo: File;
}

export interface confirmOrderRequest {
  order_id: number;
  status: "Order Confirmed";
}

export interface userSearchParam {
  query: string;
  limit: number;
  page: number;
  latitude: string;
  longitude: string;
}

export interface searchPageState {
  userSearchParam: userSearchParam;
  searchPagePagination: pagination | null;
  searchPageData: shopProduct[];
  homePageData: shopProduct[];
  homePageDataPagination: pagination | null;
  searchPageDataLoading: boolean;
  homePageDataLoading: boolean;
  searchPageDataError: null | string;
}

export type createPharmacyProductRequest = {
  [properties in keyof pharmacyProduct]?: string | number;
};

export type editPharmacyProductRequest = createPharmacyProductRequest & {
  status: string;
};

export interface pharmacistOrderItems {
  image_url: string;
  id: number;
  name: string;
  quantity: string;
  price: string;
}

export interface pharmacistOrder {
  order_id: string;
  order_items: pharmacistOrderItems[];
  address: string;
  contact_name: string;
  contact_phone: string;
  logistic_name: string;
  logistic_cost: string;
  order_amount: string;
  created_at: string | Date;
  updated_at: string | Date;
  status: string;
}

export interface statusOrderRequest {
  status: string;
}

export interface adminLogistics {
  id: number;
  name: string;
  image_url: string;
  service: string;
  price: string;
}
