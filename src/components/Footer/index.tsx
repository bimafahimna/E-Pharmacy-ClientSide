import style from "./index.module.css";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function Footer(): JSX.Element {
  const location = useLocation();

  const isTransactions =
    location.pathname.startsWith("/cart") ||
    location.pathname.startsWith("/checkout");

  return (
    <>
      <footer
        className={
          isTransactions ? style.footer_wrapperinv : style.footer_wrapper
        }
      >
        <div className={style.footer_sitemap}>
          <div
            className={
              isTransactions ? style.footer_itemsinv : style.footer_items
            }
          >
            <h2>Puxing</h2>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Blog</a>
          </div>
          <div
            className={
              isTransactions ? style.footer_itemsinv : style.footer_items
            }
          >
            <h2>Others</h2>
            <a href="#">Terms & Condition</a>
            <a href="#">Privacy</a>
            <a href="#">Join Puxing</a>
            <a href="#">Register Your Pharmacy</a>
          </div>
          <div
            className={
              isTransactions ? style.footer_itemsinv : style.footer_items
            }
          >
            <h2>Social Media</h2>
            <div className={style.social_media}>
              <FaLinkedin />
              <FaSquareXTwitter />
              <FaFacebookSquare />
            </div>
          </div>
        </div>
        <div className={style.footer_copyright}>
          <p>Copyright © 2024 Puxing</p>
        </div>
      </footer>
    </>
  );
}
