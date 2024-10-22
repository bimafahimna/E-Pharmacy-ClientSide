export default function FormatPrice(
  balance: string | number | undefined
): string {
  let balanceValue = 0;

  if (typeof balance === "string") {
    balanceValue = Number(balance);
  } else if (!balance) {
    balanceValue = 0;
  } else {
    balanceValue = balance;
  }

  const formattedBalance = "Rp" + balanceValue.toLocaleString("ID");
  return formattedBalance;
}
