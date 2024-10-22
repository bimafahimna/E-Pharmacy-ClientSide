import style from "./index.module.css";

export default function ForgotPasswordPage(): JSX.Element {
  return (
    <>
      <h1 className={style.superb}>Forgot password page</h1>

      <input type="email" placeholder="input your email" />

      <h1>Verify Your Password</h1>
      <input type="password" name="password" />
      <input type="password" name="confirm password" />
    </>
  );
}
