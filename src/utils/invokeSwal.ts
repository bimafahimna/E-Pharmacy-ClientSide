import Swal from "sweetalert2";

export const invokeSwal = async (
  alertMessage: string | undefined,
  type: string | undefined
) => {
  const message = alertMessage || "Alert!";

  switch (type) {
    case "invalidInput":
      Swal.fire({
        icon: "error",
        title: "Invalid",
        text: message,
      });
      break;
    default:
      Swal.fire({
        icon: "error",
        title: "Unknown Error",
        text: "Our server seems to have a problem",
      });
      break;
  }
};
