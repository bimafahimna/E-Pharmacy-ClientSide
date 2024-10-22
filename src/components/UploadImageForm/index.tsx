import React, { useEffect, useState } from "react";
import style from "./index.module.css";
import { errorHandler } from "../../errorHandler/errorHandler";
import { messageOnlyResponse } from "../../utils/types";
import { fetchPostUploadPaymentProof } from "../../utils/asyncFunctions";
import { invokeToast } from "../../utils/invokeToast";
import { verifyUploadedFile } from "../../utils/verifyUploadedFile";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "../../stores/store";
import { getUnpaidOrders } from "../../stores/OrderReducer";

export default function UploadPaymentProof({
  paymentId,
  title,
  type,
  onRequestClose,
}: {
  paymentId: number;
  title: string;
  type: string;
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const dispatchRedux: StoreDispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    if (e.target.files !== null) {
      const file = e.target.files[0];
      setFile(file);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (type === "payment") {
      try {
        if (file !== null) {
          const data: messageOnlyResponse = await fetchPostUploadPaymentProof({
            payment_id: Number(paymentId),
            photo: file,
          });

          if (data.message[0] !== "S") {
            throw new Error(data.message);
          } else {
            invokeToast(
              "Payment is being proccessed, please wait for confirmation",
              "success"
            );
            dispatchRedux(getUnpaidOrders());
            onRequestClose(false);
          }
        } else {
          throw new Error("File is missing, please upload the file first");
        }
      } catch (error) {
        if (error instanceof Error) {
          errorHandler(error);
        }
      } finally {
        setIsLoading(false);
      }
    } //add non payment methods
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (file !== null) {
      URL.revokeObjectURL(previewUrl!);
      setFile(null);
      setPreviewUrl(null);
    }

    const fileInput = document.getElementById("image_file") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    if (file) {
      const fileSizeKiloByte = Number((file.size / 1024).toFixed(2));
      const fileSizeMegaByte = Number((file.size / 1048576).toFixed(2));
      const isFileVerified: boolean = verifyUploadedFile(
        fileSizeKiloByte,
        fileSizeMegaByte,
        file.type,
        type
      );

      if (!isFileVerified) {
        errorHandler(new Error("Invalid file type"));
        setFile(null);
        setPreviewUrl(null);
        URL.revokeObjectURL(previewUrl!);
        const fileInput = document.getElementById(
          "image_file"
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      }

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      setIsLoading(false);
      return () => {
        setFile(null);
        setPreviewUrl(null);
        URL.revokeObjectURL(previewUrl!);
        const fileInput = document.getElementById(
          "image_file"
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      };
    } else {
      setPreviewUrl(null);
      setIsLoading(false);
    }

    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div className={style.form_container}>
      <form action="submit" onSubmit={handleSubmit} className={style.form}>
        <p className={style.title}>{title}</p>
        {isLoading ? (
          <div className={style.loading}>
            <div className={style.loaderSpin}></div>
          </div>
        ) : (
          <>
            <label htmlFor="image_file" className={style.upload_button_label}>
              Upload Payment Proof
            </label>
            <input
              id="image_file"
              type="file"
              onChange={handleChange}
              accept="image/png, image/jpeg, application/pdf"
              hidden
            />
          </>
        )}

        {file && file.type.includes("image") && previewUrl ? (
          isLoading ? (
            <div className={style.loading}>
              <div className={style.loaderSpin}></div>
            </div>
          ) : (
            <img
              className={style.preview_image}
              src={previewUrl}
              alt="preview"
            />
          )
        ) : file && file.type === "application/pdf" ? (
          isLoading ? (
            <div className={style.loading}>
              <div className={style.loaderSpin}></div>
            </div>
          ) : (
            <p>PDF uploaded: {file.name}</p>
          )
        ) : null}

        {file !== null ? (
          isLoading ? (
            <div className={style.loading}>
              <div className={style.loaderSpin}></div>
            </div>
          ) : (
            <div className={style.form_actions}>
              <button
                onClick={handleRemoveImage}
                className={style.remove_button}
              >
                Remove File
              </button>
              <button className={style.confirm_button}>Confirm</button>
            </div>
          )
        ) : (
          ""
        )}
      </form>
    </div>
  );
}
