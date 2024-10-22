import { get } from "./fetch";
import {
  cartCardType,
  checkoutLogistics,
  generalResponse,
  messageOnlyResponse,
  orderRequest,
  userOrderUnpaid,
  shopProduct,
  entities,
  userOrderHistory,
  paymentProofRequest,
  provinceResponse,
  cityResponse,
  districtResponse,
  subDistrictResponse,
  shopProductDetails,
  getPaginatedRequest,
  userSearchParam,
  confirmOrderRequest,
  productDetailsPharmacies,
} from "./types";

export async function fetchUserCart(): Promise<
  generalResponse<cartCardType[]>
> {
  try {
    const result = await fetch(import.meta.env.VITE_BASE_URL + "/carts", {
      method: "GET",
      credentials: "include",
    });

    const data: generalResponse<cartCardType[]> = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message, data: [] };
  }
}

export async function fetchPostCart(
  pharmacy_id: number,
  product_id: number,
  quantity: number
): Promise<messageOnlyResponse> {
  try {
    const result = await fetch(import.meta.env.VITE_BASE_URL + `/carts`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        product_id: product_id,
        pharmacy_id: pharmacy_id,
        quantity: quantity,
      }),
    });

    const data: messageOnlyResponse = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message };
  }
}

export async function fetchUpdateCartData(
  pharmacy_id: number,
  product_id: number,
  quantity: number
): Promise<messageOnlyResponse> {
  try {
    const result = await fetch(
      import.meta.env.VITE_BASE_URL +
        `/carts/pharmacies/${pharmacy_id}/products/${product_id}`,
      {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ quantity: quantity }),
      }
    );

    const data: messageOnlyResponse = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message };
  }
}

export async function fetchDeleteCartData(
  pharmacy_id: number,
  product_id: number
): Promise<messageOnlyResponse> {
  try {
    const result = await fetch(
      import.meta.env.VITE_BASE_URL +
        `/carts/pharmacies/${pharmacy_id}/products/${product_id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data: messageOnlyResponse = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message };
  }
}

export async function fetchPopularProducts(
  signal: AbortSignal
): Promise<generalResponse<shopProduct[]>> {
  try {
    const result = await fetch(
      import.meta.env.VITE_BASE_URL + "/products/popular",
      {
        method: "GET",
        credentials: "include",
        signal,
      }
    );

    const data: generalResponse<shopProduct[]> = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message, data: [] };
  }
}

export async function fetchPopularProductsWithLocation(
  latitude: string,
  longitude: string,
  signal: AbortSignal
): Promise<generalResponse<shopProduct[]>> {
  try {
    const result = await fetch(
      import.meta.env.VITE_BASE_URL +
        `/products/popular?limit=26&latitude=${latitude}&longitude=${longitude}`,
      {
        method: "GET",
        credentials: "include",
        signal,
      }
    );

    const data: generalResponse<shopProduct[]> = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message, data: [] };
  }
}

export async function fetchShopProductDetails(
  pharmacy_id: number,
  product_id: number
): Promise<generalResponse<shopProductDetails>> {
  try {
    const result = await fetch(
      import.meta.env.VITE_BASE_URL +
        `/pharmacies/${pharmacy_id}/products/${product_id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data: generalResponse<shopProductDetails> = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message };
  }
}

export async function fetchProductDetailsAvailablePharmacies(
  product_id: number
): Promise<generalResponse<productDetailsPharmacies[]>> {
  try {
    const result = await fetch(
      import.meta.env.VITE_BASE_URL +
        `/pharmacies/bestseller/products/${product_id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data: generalResponse<productDetailsPharmacies[]> =
      await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message };
  }
}

export async function fetchPharmacyLogistics(
  pharmacy_id: number,
  address_id: number,
  order_weight: string
): Promise<generalResponse<checkoutLogistics>> {
  try {
    const result = await fetch(
      import.meta.env.VITE_BASE_URL +
        `/pharmacies/${pharmacy_id}/logistics?address_id=${address_id}&weight=${order_weight}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data: generalResponse<checkoutLogistics> = await result.json();
    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message };
  }
}

export async function fetchPostOrder(
  order: orderRequest
): Promise<generalResponse<messageOnlyResponse>> {
  try {
    const result = await fetch(import.meta.env.VITE_BASE_URL + `/orders`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(order),
    });

    const data: messageOnlyResponse = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message };
  }
}

export async function fetchUnpaidOrders(): Promise<
  generalResponse<userOrderUnpaid[]>
> {
  try {
    const result = await fetch(
      import.meta.env.VITE_BASE_URL + `/unpaid-orders`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data: generalResponse<userOrderUnpaid[]> = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message };
  }
}

export async function fetchAdminCategories() {
  return get<generalResponse<entities[]>>(
    import.meta.env.VITE_BASE_URL + "/admin/categories",
    {
      credentials: "include" as RequestCredentials,
    }
  );
}

export async function fetchAdminManufacturers(name: string) {
  return get<generalResponse<entities[]>>(
    import.meta.env.VITE_BASE_URL + "/admin/manufacturers?name=" + name,
    {
      credentials: "include" as RequestCredentials,
    }
  );
}

export async function fetchAdminProductClassifications(name: string) {
  return get<generalResponse<entities[]>>(
    import.meta.env.VITE_BASE_URL +
      "/admin/product-classifications?name=" +
      name,
    {
      credentials: "include" as RequestCredentials,
    }
  );
}

export async function fetchAdminProductForms(name: string) {
  return get<generalResponse<entities[]>>(
    import.meta.env.VITE_BASE_URL + "/admin/product-forms?name=" + name,
    {
      credentials: "include" as RequestCredentials,
    }
  );
}

export async function fetchAllOrders(
  status: string
): Promise<generalResponse<userOrderHistory[]>> {
  try {
    const result = await fetch(
      import.meta.env.VITE_BASE_URL + `/orders?status=${status}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data: generalResponse<userOrderHistory[]> = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message };
  }
}

export async function fetchPostUploadPaymentProof(
  request: paymentProofRequest
): Promise<messageOnlyResponse> {
  try {
    const formData = new FormData();
    formData.append("file", request.photo);

    const result = await fetch(
      import.meta.env.VITE_BASE_URL + `/payments/${request.payment_id}`,
      {
        method: "PATCH",
        credentials: "include",
        body: formData,
      }
    );

    const data: messageOnlyResponse = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message };
  }
}

export async function fetchLocationProvinces(name: string) {
  return get<generalResponse<provinceResponse[]>>(
    import.meta.env.VITE_BASE_URL + "/location/provinces?name=" + name
  );
}

export async function fetchLocationCities(
  name: string,
  provinceID?: string | null
) {
  return get<generalResponse<cityResponse[]>>(
    import.meta.env.VITE_BASE_URL +
      "/location/cities?name=" +
      name +
      (!(provinceID === undefined || provinceID === null)
        ? "&province_id=" + provinceID
        : "")
  );
}

export async function fetchLocationDistricts(
  name: string,
  cityID?: string | null
) {
  return get<generalResponse<districtResponse[]>>(
    import.meta.env.VITE_BASE_URL +
      "/location/districts?name=" +
      name +
      (!(cityID === undefined || cityID === null) ? "&city_id=" + cityID : "")
  );
}

export async function fetchLocationSubDistricts(
  name: string,
  districtID?: string | null
) {
  return get<generalResponse<subDistrictResponse[]>>(
    import.meta.env.VITE_BASE_URL +
      "/location/sub-districts?name=" +
      name +
      (!(districtID === undefined || districtID === null)
        ? "&district_id=" + districtID
        : "")
  );
}

export async function fetchSearchData(
  userSearchParam: userSearchParam & { signal: AbortSignal }
): Promise<getPaginatedRequest<shopProduct>> {
  try {
    const result = await fetch(
      import.meta.env.VITE_BASE_URL +
        `/products?limit=${userSearchParam.limit}&page=${userSearchParam.page}&s=${userSearchParam.query}&latitude=${userSearchParam.latitude}&longitude=${userSearchParam.longitude}`,
      {
        method: "GET",
        credentials: "include",
        signal: userSearchParam.signal,
      }
    );

    const data: getPaginatedRequest<shopProduct> = await result.json();

    if (
      data.message ===
      "There is no nearby pharmacies in your location, please consider changing your location"
    ) {
      throw new Error(data.message);
    }

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    if (userSearchParam.signal.aborted) {
      console.log();
    }
    const errorMsg = error as Error;
    return {
      message: errorMsg.message,
      data: [],
      pagination: {
        total_records: 0,
        total_pages: 0,
        current_page: 0,
        prev_page: false,
        next_page: true,
      },
    };
  }
}

export async function fetchHomePageData(
  userSearchParam: userSearchParam & { signal: AbortSignal }
): Promise<getPaginatedRequest<shopProduct>> {
  try {
    let url = `/products?s=${userSearchParam.query}&limit=20&page=1`;

    if (userSearchParam.latitude && userSearchParam.longitude) {
      url += `&latitude=${userSearchParam.latitude}&longitude=${userSearchParam.longitude}`;
    }

    const result = await fetch(import.meta.env.VITE_BASE_URL + url, {
      method: "GET",
      credentials: "include",
      signal: userSearchParam.signal,
    });

    const data: getPaginatedRequest<shopProduct> = await result.json();

    if (
      data.message ===
      "There is no nearby pharmacies in your location, please consider changing your location"
    ) {
      throw new Error(data.message);
    }

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    if (userSearchParam.signal.aborted) {
      console.log();
    }

    const errorMsg = error as Error;
    return {
      message: errorMsg.message,
      data: [],
      pagination: {
        total_records: 0,
        total_pages: 0,
        current_page: 0,
        prev_page: false,
        next_page: true,
      },
    };
  }
}

export async function fetchConfirmOrder(
  request: confirmOrderRequest
): Promise<messageOnlyResponse> {
  try {
    const result = await fetch(
      import.meta.env.VITE_BASE_URL + `/user/orders/${request.order_id}`,
      {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
          order_id: request.order_id,
          status: request.status,
        }),
      }
    );

    const data: messageOnlyResponse = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    const errorMsg = error as Error;
    return { message: errorMsg.message };
  }
}
