import "./App.css";
import "./customer/styles/Shared.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Header } from "./customer/components/Header";
import { Footer } from "./customer/components/Footer";
import { Home } from "./customer/pages/Home";
import { CategoriesProvider } from "./contexts/CategoriesProvider";
import { Routes, Route, useLocation } from "react-router-dom";
import { ProductDetails } from "./customer/features/product/pages/ProductDetails";
import { SignUp } from "./customer/pages/SignUp";
import { EmailConfirmation } from "./customer/features/security/pages/EmailConfirmation";
import { Login } from "./customer/pages/Login";
import { Cart } from "./customer/features/cart/pages/Cart";
import { Checkout } from "./customer/pages/Checkout";
import { OrderConfirmation } from "./customer/features/order/pages/OrderConfirmation";
import { ProtectedRoute } from "./customer/components/ProtectedRoute";
import ScrollTop from "./common/js/helpers";
import SnackBar from "./customer/components/SnackBar";
import { FilteredProducts } from "./customer/features/product/pages/FilteredProducts";
import { Wishlist } from "./customer/features/wishlist/pages/Wishlist";
import { Comparelist } from "./customer/features/Compare/pages/Comparelist";
import OrdersHistory from "./customer/features/order/pages/OrdersHistory";
import { NotFoundPage } from "./customer/pages/NotFoundPage ";
import { ForgotPassword } from "./customer/features/security/pages/ForgotPassword";
import { NewPassword } from "./customer/features/security/pages/NewPassword";
import { ResetTokenSentPage } from "./customer/features/security/pages/ResetTokenSentPage";
import { CustomerProfile } from "./customer/features/customer/pages/CustomerProfile";
import CustomerLayout from "./customer/features/customer/components/CustomerLayout";
import FAQs from "./customer/pages/FAQs";
import ContactUs from "./customer/pages/ContactUs";
import AboutUs from "./customer/pages/AboutUs";

import { Panel } from "./admin/pages/Panel";
import { Profile } from "./admin/pages/Profile";
import { Dashboard } from "./admin/features/dashboard/pages/Dashboard";
import { Analytics } from "./admin/pages/Analytics";
import { Products } from "./admin/features/product/pages/Products";
import { AddNewProduct } from "./admin/pages/AddProduct";
import { Categories } from "./admin/pages/Categories";

import { useMemo } from "react";

function App() {
  const location = useLocation();
  const showLayout = useMemo(() => {
    return !location.pathname.startsWith("/admin");
  }, [location]);
  return (
    <CategoriesProvider>
      <div className="App">
        {showLayout && <Header></Header>}
        <ScrollTop />
        <Routes>
          {/* customers side :  */}
          <Route element={<CustomerLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/products/" element={<FilteredProducts />}>
              <Route path="new-products" element={<FilteredProducts />} />
              <Route path="best-sellers" element={<FilteredProducts />} />
              <Route path="top-rated" element={<FilteredProducts />} />
              <Route path="discounts" element={<FilteredProducts />} />
              <Route path=":categoryName" element={<FilteredProducts />} />
            </Route>
            <Route path="/product/:id" element={<ProductDetails />} />

            <Route element={<ProtectedRoute requireLogin />}>
              <Route
                path="/account/verify-email"
                element={<EmailConfirmation key={location.pathname} />}
              />
            </Route>
            <Route element={<ProtectedRoute requireLogin />}>
              <Route
                path="/profile/verify-email"
                element={
                  <EmailConfirmation
                    key={location.pathname}
                    navigateTo="/profile"
                  />
                }
              />
            </Route>

            <Route element={<ProtectedRoute requireLogout />}>
              <Route path="/login" element={<Login />} />
              <Route
                path="/signup"
                element={<SignUp key={location.pathname} />}
              />
            </Route>

            <Route path="/cart" element={<Cart />} />
            <Route path="/compare" element={<Comparelist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />

            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/orders-history" element={<OrdersHistory />} />
            <Route path="/profile" element={<CustomerProfile />} />

            <Route path="/FAQs" element={<FAQs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} />

            <Route path="*" element={<NotFoundPage />} />

            <Route
              path="/account/password/forgot"
              element={<ForgotPassword />}
            />
            <Route
              path="/account/password/forgot/token-sent"
              element={<ResetTokenSentPage />}
            />
            <Route
              path="/account/password/reset/:token"
              element={<NewPassword />}
            />
          </Route>
          {/* ============ */}

          {/* admin routes : */}
          <Route path="/admin/" element={<Panel />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddNewProduct />} />
            <Route path="categories" element={<Categories />} />{" "}
            {/* <Route path="categories/add" element={<Categories />} /> */}
            <Route path="profile" element={<Profile />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          {/* ============ */}
        </Routes>

        <SnackBar />
        {showLayout && <Footer></Footer>}
      </div>
    </CategoriesProvider>
  );
}

export default App;
