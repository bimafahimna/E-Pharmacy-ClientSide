import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";

import Input from "../../../components/Input";
import style from "./index.module.css";
import Form from "../../../components/Form";

import { verifyPassword } from "../../../utils/verifyPassword";
import { generalResponse, userData } from "../../../utils/types";
import InputWithLabel from "../../../components/InputWithLabel";
import { errorHandler } from "../../../errorHandler/errorHandler";
import { invokeToast } from "../../../utils/invokeToast";
import { useCookie } from "../../../stores/CookieContext/useCookie";
import { Helmet } from "react-helmet";

export default function VerifyPage(): JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = useState<userData>({
    password: "",
    passwordConf: "",
    token: null,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [searchParams] = useSearchParams();

  const { removeCookie } = useCookie();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleVisiblePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isPasswordVisible) {
      setIsPasswordVisible(false);
    } else if (!isPasswordVisible) {
      setIsPasswordVisible(true);
    }
  };

  const handleVerifyRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const verifToken = searchParams.get("verif_token");

      if (!verifToken || verifToken == "") {
        setIsLoading(false);
        throw new Error(
          "Invalid Token, please check your email and go to the link provided"
        );
      }

      verifyPassword(form.password);

      if (form.password !== form.passwordConf) {
        throw new Error("Passwords do not match");
      }

      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/auth/verify",
        {
          method: "POST",
          body: JSON.stringify({
            password: form.password,
            token: form.token,
          }),
        }
      );

      const data: generalResponse<null> = await response.json();

      if (!response.ok) {
        invokeToast("Redirecting to login........", "info");
        setTimeout(() => {
          navigate("/auth/login");
        }, 5000);
        setIsLoading(false);
        throw new Error(data.message);
      }

      removeCookie("user_is_verified", { path: "/" });
      removeCookie("user_role", { path: "/" });

      invokeToast(
        "You've been successfully verified, please login again",
        "success"
      );

      setIsLoading(false);

      navigate("/auth/login");
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = searchParams.get("verif_token");

    if (token) {
      setForm({ ...form, token: searchParams.get("verif_token") });
    } else {
      setIsLoading(true);

      errorHandler(
        new Error(
          "Invalid Token, please check your email and go to the link provided"
        )
      ).then(() => {
        invokeToast("Redirecting to login........", "info");
        setTimeout(() => {
          navigate("/auth/login");
        }, 5000);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Puxing - Verify Account</title>
      </Helmet>
      <section>
        <div className={style.verifyPage}>
          <div className={style.leftContainer}>
            <h1 className={style.puxing}>Puxing</h1>
            <h2 className={style.title}>Verify Account</h2>
            <p>If you have made an account,</p>
            <p>
              With a verified account you will be entitled to do transactions
              within the website
            </p>
          </div>

          <div className={style.rightContainer}>
            <h3 className={style.formTitle}>Password</h3>
            <Form
              className={style.formVerify}
              id="verifyForm"
              onSubmit={handleVerifyRegister}
            >
              <div className={style.inputPwWrapper}>
                <InputWithLabel
                  labelProps={{
                    className: style.InputLabel,
                    htmlFor: "password",
                    children: "Password",
                  }}
                  inputProps={{
                    id: "password",
                    className: isPasswordVisible ? style.textPw : style.Pw,
                    type: isPasswordVisible ? "text" : "password",
                    name: "password",
                    onChange: handleOnChange,
                    placeholder: "Password",
                  }}
                />

                <button
                  className={style.eyeIconWrapper}
                  onClick={handleVisiblePassword}
                >
                  {isPasswordVisible ? (
                    <AiOutlineEyeInvisible className={style.eyeIcon} />
                  ) : (
                    <AiOutlineEye className={style.eyeIcon} />
                  )}
                </button>
              </div>

              <div className={style.inputPwWrapper}>
                <InputWithLabel
                  labelProps={{
                    className: style.InputLabel,
                    htmlFor: "passwordConf",
                    children: "Confirm Password",
                  }}
                  inputProps={{
                    id: "passwordConf",
                    className: isPasswordVisible ? style.textPw : style.Pw,
                    type: isPasswordVisible ? "text" : "password",
                    name: "passwordConf",
                    onChange: handleOnChange,
                    placeholder: "Confirm Password",
                  }}
                />

                <button
                  className={style.eyeIconWrapper}
                  onClick={handleVisiblePassword}
                >
                  {isPasswordVisible ? (
                    <AiOutlineEyeInvisible className={style.eyeIcon} />
                  ) : (
                    <AiOutlineEye className={style.eyeIcon} />
                  )}
                </button>
              </div>

              {isLoading ? (
                <div className={style.inputBtnDisabled}>
                  <div className={style.loaderSpin}></div>
                </div>
              ) : (
                <Input
                  className={style.inputBtn}
                  type="submit"
                  value={"Verify"}
                />
              )}
            </Form>
          </div>
        </div>
      </section>
    </>
  );
}
