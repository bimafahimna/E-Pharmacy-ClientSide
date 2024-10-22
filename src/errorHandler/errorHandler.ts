import { toast } from "react-toastify";
export const errorHandler = async (error: Error | undefined) => {
  if (error instanceof Error) {
    const message = error.message || "Unhandled Server Error";
    toast.error(message, {
      position: "bottom-right",
      theme: "colored",
    });
  }
};
