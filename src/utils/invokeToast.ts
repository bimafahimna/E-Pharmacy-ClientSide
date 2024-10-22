import { toast } from "react-toastify";
export const invokeToast = async (
  alertMessage: string | undefined,
  type: string | undefined
) => {
  const message = alertMessage || "Alert!";

  if (type === "success") {
    toast.success(message, {
      position: "bottom-right",
      theme: "colored",
    });
  }

  if (type === "warning") {
    toast.warning(message, {
      position: "bottom-right",
      theme: "colored",
    });
  }

  if (type === "info") {
    toast.info(message, {
      position: "bottom-right",
      theme: "colored",
    });
  }
};
