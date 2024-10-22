export default function formatPrice(value: number) {
  return "IDR " + value.toLocaleString("en", { currency: "IDR" });
}
