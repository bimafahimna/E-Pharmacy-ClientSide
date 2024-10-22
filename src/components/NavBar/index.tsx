import style from "./index.module.css";
import Cart from "../Cart";
import SearchBar from "../SearchBar";
import CustomerProfile from "../CustomerProfile";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreDispatch } from "../../stores/store";
import { useDispatch } from "react-redux";
import { resetCartState } from "../../stores/CartPageReducer";
import { resetAddress } from "../../stores/ProfileReducer";

export default function NavBar(): JSX.Element {
  const dispatchRedux: StoreDispatch = useDispatch();

  const navigate = useNavigate();

  const handleToHome = () => {
    dispatchRedux(resetCartState());
    dispatchRedux(resetAddress());
    navigate("/");
  };

  const location = useLocation();

  const isNotHomeOrSearch =
    !location.pathname.startsWith("/home") &&
    !location.pathname.startsWith("/search");

  return (
    <>
      <nav className={style.nav_wrapper}>
        <section>
          <div className={style.nav}>
            <button
              aria-label="button to home"
              name="button to home"
              onClick={handleToHome}
              className={style.homeBtn}
            >
              <h1 className={style.logo}>Puxing</h1>
            </button>

            {isNotHomeOrSearch ? "" : <SearchBar />}
            {isNotHomeOrSearch ? (
              <>
                <p className={style.nav_subtitle}>
                  Your One Stop Solution for your health needs
                </p>
                <div className={style.end_nav}>
                  <Cart />
                  <CustomerProfile />
                </div>
              </>
            ) : (
              <>
                <Cart />
                <CustomerProfile />
              </>
            )}
          </div>
        </section>
      </nav>
    </>
  );
}
