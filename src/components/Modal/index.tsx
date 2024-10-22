import { useEffect } from "react";
import style from "./index.module.css";

interface ModalProps {
  shouldShow: boolean;
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  shouldShow,
  onRequestClose,
  children,
}) => {
  useEffect(() => {
    if (shouldShow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function to reset the overflow when the component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldShow]);
  return shouldShow ? (
    <>
      <div className={style.background}>
        <button
          className={style.background + " " + style.close_button}
          onClick={() => onRequestClose(false)}
        ></button>
        <div className={style.modal}>{children}</div>
      </div>
    </>
  ) : null;
};

export default Modal;
