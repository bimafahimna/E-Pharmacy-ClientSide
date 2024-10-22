import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";

import Input from "../../../components/Input";
import style from "./index.module.css";
import Form from "../../../components/Form";

import { verifyEmail } from "../../../utils/verifyEmail";
import { errorHandler } from "../../../errorHandler/errorHandler";
import InputWithLabel from "../../../components/InputWithLabel";
import { invokeToast } from "../../../utils/invokeToast";
import { verifyPassword } from "../../../utils/verifyPassword";
import GoogleAuthButton from "../../../components/GoogleLoginButton";
import { emailUser } from "../../../utils/types";
import { Helmet } from "react-helmet";

export default function RegisterPage(): JSX.Element {
  const navigate = useNavigate();

  const [form, setForm] = useState<emailUser>({
    email: "",
    password: "",
    passwordConf: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleNavigateToLogin = () => {
    navigate("/auth/login");
  };

  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      verifyEmail(form.email);

      verifyPassword(form.password);

      if (form.password !== form.passwordConf) {
        throw new Error("Passwords do not match");
      }

      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        throw new Error(data.message);
      }

      await invokeToast(data.message, "success");

      setIsLoading(false);

      navigate("/auth/login");
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Puxing - Register</title>
      </Helmet>
      <section>
        <div className={style.registerPage}>
          <div className={style.leftContainer}>
            <h1 className={style.puxing}>Puxing</h1>
            <h2 className={style.title}>Register</h2>
            <p>If you have made an account,</p>
            <p>
              sign in{" "}
              <span
                onClick={handleNavigateToLogin}
                className={style.hereAnimate}
              >
                here
              </span>
              !
            </p>
          </div>

          <div className={style.rightContainer}>
            <h3 className={style.formTitle}>Register</h3>
            <Form
              className={style.formRegister}
              id="verifyForm"
              onSubmit={handleSubmitRegister}
            >
              <InputWithLabel
                labelProps={{
                  className: style.InputLabel,
                  htmlFor: "email",
                  children: "Email",
                }}
                inputProps={{
                  id: "email",
                  type: "email",
                  name: "email",
                  onChange: handleOnChange,
                  placeholder: "Email",
                }}
              />

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
                  value={"Register"}
                  style={{ padding: "0rem" }}
                />
              )}
            </Form>
            <div className={style.divider}>or</div>

            <GoogleAuthButton
              link={import.meta.env.VITE_BASE_URL + "/auth/google/register"}
            />
          </div>
        </div>
      </section>
    </>
  );
}
