import { ReactNode } from "react";
import style from "./index.module.css";

export default function LoaderGloss({
  children,
  cssStyle,
}: {
  children: ReactNode;
  cssStyle: string;
}): JSX.Element {
  return <div className={style[cssStyle]}>{children}</div>;
}
