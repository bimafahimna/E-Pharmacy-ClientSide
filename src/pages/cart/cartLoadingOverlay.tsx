import style from "./index.module.css";

export default function CartLoadingOverlay(): JSX.Element {
  return (
    <>
      <div className={style.dimOverlay}>
        <div className={style.loaderDots}></div>
      </div>
    </>
  );
}
