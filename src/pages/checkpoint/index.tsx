import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookie } from "../../stores/CookieContext/useCookie";
import { invokeToast } from "../../utils/invokeToast";
import { errorHandler } from "../../errorHandler/errorHandler";
import { useAuth } from "../../stores/AuthContext/useAuth";
import { loadState } from "../../utils/localStorageUtil";
import { Helmet } from "react-helmet";

import style from "./index.module.css";
import checkpointGraphic from "../../assets/checkpoint-graphic.png";

export default function CheckpointPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const { saveDataInCookies } = useCookie();

  const { login } = useAuth();
  const navigate = useNavigate();

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isVerified = searchParams.get("is_verified");
  const role = searchParams.get("role");
  const id = searchParams.get("user_id");

  const lastVisitedPage = loadState("lastVisitedPage");
  const lastUser = loadState("user_id");

  useEffect(() => {
    setIsLoading(true);
    if (isVerified && role && id) {
      saveDataInCookies(isVerified, role, id);
      login(isVerified, role, id);

      setIsSuccess(true);
      setIsLoading(false);

      if (role === "admin" || role === "pharmacist") {
        navigate("/admin");
        localStorage.removeItem("lastVisitedPage");
        return;
      }

      if (lastVisitedPage !== undefined && lastUser === id) {
        navigate(lastVisitedPage as string);
      } else {
        navigate("/home");
      }
    } else {
      errorHandler(new Error("Invalid payload error"));
      invokeToast("Redirecting to login.........", "info");

      setIsSuccess(false);
      setIsLoading(false);

      setTimeout(() => {
        navigate("/auth/login");
        localStorage.removeItem("lastVisitedPage");
      }, 1000);
    }
  }, [
    isVerified,
    role,
    id,
    saveDataInCookies,
    navigate,
    login,
    lastUser,
    lastVisitedPage,
  ]);

  return (
    <>
      <Helmet>
        <title>Puxing - preparing the app.....</title>
      </Helmet>
      <section className={style.checkpoint_section}>
        <div className={style.after_section}>
          <img
            className={style.checkpoint_graphic}
            src={checkpointGraphic}
            alt="configuring your data"
          />

          {isLoading ? <div className={style.checkpoint_text}></div> : ""}
          {isSuccess ? "All Good!" : ""}
        </div>
      </section>
    </>
  );
}
