import "./App.css";
import "./Components/CustomerSide/Shared.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Header } from "./Components/CustomerSide/Header";
import { Footer } from "./Components/CustomerSide/Footer";
import { Home } from "./Components/CustomerSide/Home";
import { CategoriesProvider } from "./contexts/CategoriesProvider";
import { Routes, Route, useLocation } from "react-router-dom";
import { ProductDetails } from "./Components/CustomerSide/ProductDetails";
import { SignUp } from "./Components/CustomerSide/SignUp";
import { EmailConfirmation } from "./Components/CustomerSide/EmailConfirmation";
import { Login } from "./Components/CustomerSide/Login";
import { Cart } from "./Components/CustomerSide/Cart";
import { Checkout } from "./Components/CustomerSide/Checkout";
import { OrderConfirmation } from "./Components/CustomerSide/OrderConfirmation";
import { ProtectedRoute } from "./Components/CustomerSide/ProtectedRoute";
import ScrollTop from "./ScrollToTop";
import SnackBar from "./Components/CustomerSide/SnackBar";
import { useMemo } from "react";
import { FilteredProducts } from "./Components/CustomerSide/FilteredProducts";
import { Wishlist } from "./Components/CustomerSide/Wishlist";
import { Comparelist } from "./Components/CustomerSide/Comparelist";
import OrdersHistory from "./Components/CustomerSide/OrdersHistory";
import { NotFoundPage } from "./Components/CustomerSide/NotFoundPage ";
import { ForgotPassword } from "./Components/CustomerSide/ForgotPassword";
import { NewPassword } from "./Components/CustomerSide/NewPassword";
import { ResetTokenSentPage } from "./Components/CustomerSide/ResetTokenSentPage";
import { Dashboard } from "./Components/AdminDashBoard/Dashboard";
import { Profile } from "./Components/AdminDashBoard/Profile";
import { DashboardHomePage } from "./Components/AdminDashBoard/DashboardHomePage";
import { Analytics } from "./Components/AdminDashBoard/Analytics";
import { Products } from "./Components/AdminDashBoard/Products";
import { AddNewProduct } from "./Components/AdminDashBoard/AddProduct";
import { Categories } from "./Components/AdminDashBoard/Categories";
import { CustomerProfile } from "./Components/CustomerSide/CustomerProfile";
import CustomerLayout from "./Components/CustomerSide/CustomerLayout";

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
              <Route
                path="discounted-products"
                element={<FilteredProducts />}
              />
              <Route path=":categoryName" element={<FilteredProducts />} />
            </Route>
            <Route path="/product/:id" element={<ProductDetails />} />

            <Route element={<ProtectedRoute requireLogin />}>
              <Route
                path="/account/verify-email"
                element={<EmailConfirmation key={location.pathname} />}
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
          <Route path="/admin/" element={<Dashboard />}>
            <Route index element={<DashboardHomePage />} />
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
