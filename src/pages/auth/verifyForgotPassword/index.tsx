import style from "./index.module.css";

export default function VerifyForgotPasswordPage(): JSX.Element {
  return (
    <>
      <h1 className={style.superbi}>Verify Your Password</h1>
      <input type="password" name="password" />
      <input type="password" name="confirm password" />
    </>
  );
}
