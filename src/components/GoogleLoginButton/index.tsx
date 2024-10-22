import style from "./index.module.css";
import { FcGoogle } from "react-icons/fc";

export default function GoogleAuthButton({
  link,
}: {
  link: string;
}): JSX.Element {
  return (
    <>
      <a className={style.googleWrapper} href={link}>
        <div className={style.linkWrapper}>
          <FcGoogle className={style.googleLogo} />
          Continue With Google
        </div>
      </a>
    </>
  );
}
