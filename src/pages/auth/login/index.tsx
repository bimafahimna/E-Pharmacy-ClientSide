import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";

import Input from "../../../components/Input";
import style from "./index.module.css";
import Form from "../../../components/Form";

import { verifyEmail } from "../../../utils/verifyEmail";
import { errorHandler } from "../../../errorHandler/errorHandler";
import {
  emailUserLogin,
  generalResponse,
  loginResponse,
} from "../../../utils/types";
import InputWithLabel from "../../../components/InputWithLabel";
import { invokeToast } from "../../../utils/invokeToast";
import { verifyPassword } from "../../../utils/verifyPassword";
import GoogleAuthButton from "../../../components/GoogleLoginButton";
import { Helmet } from "react-helmet";

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate();

  const [form, setForm] = useState<emailUserLogin>({
    email: "",
    password: "",
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

  const handleForgotPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/auth/forgot-password");
    //navigate to forgot password
  };

  const handleVisiblePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isPasswordVisible) {
      setIsPasswordVisible(false);
    } else if (!isPasswordVisible) {
      setIsPasswordVisible(true);
    }
  };

  const handleNavToRegister = () => {
    navigate("/auth/register");
  };

  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      verifyEmail(form.email);

      verifyPassword(form.password);

      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ ...form }),
          credentials: "include",
        }
      );

      const data: generalResponse<loginResponse> = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        throw new Error(data.message);
      }

      await invokeToast(data.message, "success");

      setIsLoading(false);

      if (data.data?.url) {
        navigate("/checkpoint" + data.data?.url.toString());
      } else {
        throw new Error("Broken Payload, please try again later");
      }
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Puxing - Login</title>
      </Helmet>
      <section>
        <div className={style.loginPage}>
          <div className={style.leftContainer}>
            <h1 className={style.puxing}>Puxing</h1>
            <h2 className={style.title}>Sign In</h2>
            <p>If you have'n made an account yet,</p>
            <p>
              create one{" "}
              <span onClick={handleNavToRegister} className={style.hereAnimate}>
                here
              </span>
              !
            </p>
          </div>

          <div className={style.rightContainer}>
            <h3 className={style.formTitle}>Sign In</h3>
            <Form
              className={style.formLogin}
              id="verifyForm"
              onSubmit={handleSubmitLogin}
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

              <button
                onClick={handleForgotPassword}
                className={style.forgot_password}
                title="forgot password?"
              >
                forgot password?
              </button>

              {isLoading ? (
                <div className={style.inputBtnDisabled}>
                  <div className={style.loaderSpin}></div>
                </div>
              ) : (
                <Input
                  className={style.inputBtn}
                  type="submit"
                  value={"Login"}
                  style={{ padding: "0rem" }}
                />
              )}
            </Form>

            <div className={style.divider}>or</div>

            <GoogleAuthButton
              link={import.meta.env.VITE_BASE_URL + "/auth/google/login"}
            />
          </div>
        </div>
      </section>
    </>
  );
}
