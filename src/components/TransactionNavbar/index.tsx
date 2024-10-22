import { useNavigate } from "react-router-dom";
import style from "./index.module.css";

export default function TransactionNavbar(): JSX.Element {
  const navigate = useNavigate();
  const handleToHomePage = () => {
    navigate("/home");
  };
  return (
    <>
      <nav className={style.navbar}>
        <div className={style.navbarMiddle}>
          <button onClick={handleToHomePage} className={style.navbarText}>
            Puxing
          </button>
        </div>
      </nav>
    </>
  );
}
