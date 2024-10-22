import { useEffect } from "react";
import AddressList from "../../components/AddressList";
import { saveState } from "../../utils/localStorageUtil";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../stores/AuthContext/useAuth";

export default function ProfilePage(): JSX.Element {
  const location = useLocation();

  const { role } = useAuth();

  useEffect(() => {
    if (role === "customer") {
      saveState("lastVisitedPage", location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AddressList />
    </>
  );
}
