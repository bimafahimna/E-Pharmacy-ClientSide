import NavBar from "../../components/NavBar";
import style from "./style.module.css";
import notFoundGraphic from "../../assets/not-found-graphic.svg";
import Footer from "../../components/Footer";

export default function NotFoundPage(): JSX.Element {
  return (
    <>
      <NavBar />
      <section id={style.not_found_section}>
        <div className={style.after_section}>
          <img
            src={notFoundGraphic}
            alt="Page not found"
            className={style.not_found_graphic}
          />
          <h1 className={style.page_title}>Page Not Found</h1>
        </div>
      </section>
      <Footer />
    </>
  );
}
