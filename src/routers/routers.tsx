import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import LogInPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import VerifyPage from "../pages/auth/verify";
import CustomerLayout from "../layouts/CustomerLayout";
import HomePage from "../pages/home";
import NotFoundPage from "../pages/notFoundPage";
import CartLayout from "../layouts/CartLayout";
import CartPage from "../pages/cart";
import CheckpointPage from "../pages/checkpoint";
import ProfilePage from "../pages/profile";
import CheckoutLayout from "../layouts/CheckoutLayout";
import CheckoutPage from "../pages/checkoutPage";
import PharmacistsPage from "../pages/admin/pharmacists";
import UsersPage from "../pages/admin/users";
import PartnerPage from "../pages/admin/partner";
import PharmacyPage from "../pages/admin/pharmacy";
import ProductsPage from "../pages/admin/products";
import OrderPage from "../pages/orders";
import ProfileLayout from "../layouts/ProfileLayout";
import ProductDetailsPage from "../pages/productPage";
import PharmacistLayout from "../layouts/PharmacistLayout";
import PharmacyProductsPage from "../pages/pharmacist/products";
import PharmacyOrdersPage from "../pages/pharmacist/orders";
import SearchPage from "../pages/search";
import ForgotPasswordPage from "../pages/auth/forgotPassword";
import VerifyForgotPasswordPage from "../pages/auth/verifyForgotPassword";

const router = createBrowserRouter(
  [
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <LogInPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
        {
          path: "verify-account",
          element: <VerifyPage />,
        },
        {
          path: "forgot-password",
          element: <ForgotPasswordPage />,
        },
        {
          path: "verify-password",
          element: <VerifyForgotPasswordPage />,
        },
      ],
      errorElement: <h1>SOMETHING WENT WRONG</h1>,
    },
    {
      path: "/checkpoint",
      element: <CheckpointPage />,
      errorElement: <h1>SOMETHING WENT WRONG</h1>,
    },
    {
      path: "/",
      element: <CustomerLayout />,
      children: [
        {
          path: "home",
          element: <HomePage />,
        },
        {
          path: "pharmacy/:pharmacy_id/product/:product_id",
          element: <ProductDetailsPage />,
        },
        {
          path: "search",
          element: <SearchPage />,
        },
      ],
      errorElement: <h1>SOMETHING WENT WRONG</h1>,
    },
    {
      path: "profile",
      element: <ProfileLayout />,
      children: [
        {
          path: "orders",
          element: <OrderPage />,
        },
        {
          path: "address",
          element: <ProfilePage />,
        },
      ],
    },
    {
      path: "/cart",
      element: <CartLayout />,
      children: [
        {
          path: "",
          element: <CartPage />,
        },
      ],
      errorElement: <h1>SOMETHING WENT WRONG</h1>,
    },
    {
      path: "/checkout",
      element: <CheckoutLayout />,
      children: [
        {
          path: "",
          element: <CheckoutPage />,
        },
      ],
      errorElement: <h1>SOMETHING WENT WRONG</h1>,
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "users",
          element: <UsersPage />,
        },
        {
          path: "pharmacists",
          element: <PharmacistsPage />,
        },
        {
          path: "partner",
          element: <PartnerPage />,
        },
        {
          path: "pharmacy",
          element: <PharmacyPage />,
        },
        {
          path: "products",
          element: <ProductsPage />,
        },
      ],
    },
    {
      path: "/pharmacist",
      element: <PharmacistLayout />,
      children: [
        {
          path: "orders",
          element: <PharmacyOrdersPage />,
        },
        {
          path: "products",
          element: <PharmacyProductsPage />,
        },
      ],
    },
    {
      path: "/*",
      element: <NotFoundPage />,
    },
  ],
  { basename: "/vm1" }
);

export { router };
