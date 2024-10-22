import { loadState } from "./localStorageUtil";
import { cartCardPersisted, cartCardType } from "./types";

export function mergeCartData({
  payload,
}: {
  payload: cartCardType[];
}): cartCardPersisted[] {
  const localStorageData: cartCardPersisted[] = loadState(
    "cartPagePersistedData"
  );

  const mergedData: cartCardPersisted[] = payload.map((pharmacy) => {
    const localPharmacyData = localStorageData?.find(
      (storedPharmacy) =>
        storedPharmacy.pharmacy_name === pharmacy.pharmacy_name
    );

    const totalOrderWeight = pharmacy.items.reduce((acc, item) => {
      const itemWeight = Number(item.weight) || 0;
      const totalItemWeight = itemWeight * item.quantity;

      return acc + totalItemWeight;
    }, 0);

    return {
      ...pharmacy,
      pharmacy_id: pharmacy.items[0].pharmacy_id,
      is_selected_all_item: localPharmacyData?.is_selected_all_item ?? true,
      order_weight: totalOrderWeight.toString(),
      items: pharmacy.items.map((item) => {
        const localItemData = localPharmacyData?.items.find(
          (storedItem) =>
            storedItem.product_id === item.product_id &&
            storedItem.pharmacy_id === item.pharmacy_id
        );
        return {
          ...item,
          is_selected_item: localItemData?.is_selected_item ?? true,
          quantity: item.quantity,
          stock: item.stock,
        };
      }),
    };
  });

  const filteredData = mergedData.map((pharmacy) => {
    return {
      ...pharmacy,
      items: pharmacy.items.filter((item) => {
        return item.quantity > 0;
      }),
    };
  });

  return filteredData;
}
