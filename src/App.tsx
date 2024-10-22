import { RouterProvider } from "react-router-dom";
import { router } from "./routers/routers";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { AppContextProvider } from "./providers/ContextProvider";
import { Provider } from "react-redux";
import store from "./stores/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <ToastContainer stacked position="bottom-right" />
        <AppContextProvider>
          <RouterProvider router={router} />
        </AppContextProvider>
      </Provider>
    </>
  );
}
export default App;
