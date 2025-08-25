import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";
import { Home } from "./Components/Home";
import { CategoriesProvider } from "./contexts/CategoriesProvider";
import { Routes, Route, useLocation } from "react-router-dom";
import { ProductDetails } from "./Components/ProductDetails";
import { SignUp } from "./Components/SignUp";
import { EmailConfirmation } from "./Components/EmailConfirmation";
import { Login } from "./Components/Login";
import { Cart } from "./Components/Cart";
import { Checkout } from "./Components/Checkout";
import { OrderConfirmation } from "./Components/OrderConfirmation";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import ScrollTop from "./ScrollToTop";
import SnackBar from "./Components/SnackBar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetCurrentUser, markUserAsReady } from "./features/users/UserSlice";
import { GetUserCart, markCartAsReady } from "./features/cart/CartSlice";
import { FilteredProducts } from "./Components/FilteredProducts";

function App() {
  const dispatch = useDispatch();
  const { user, ready: isUserReady } = useSelector((state) => state.user);
  useEffect(() => {
    const login = JSON.parse(localStorage.getItem("login"));
    if (login && login.autoLogin) {
      dispatch(
        GetCurrentUser({ email: login.email, password: login.password })
      );
    } else {
      dispatch(markUserAsReady());
    }
  }, []);

  useEffect(() => {
    if (isUserReady) {
      const hasCart = localStorage.getItem("hasCart");
      if (hasCart === "true" && user) {
        dispatch(GetUserCart(user.id));
      } else {
        dispatch(markCartAsReady());
      }
    }
  }, [isUserReady, user, dispatch]);

  const location = useLocation();
  return (
    <CategoriesProvider>
      <div className="App">
        <Header></Header>
        <ScrollTop />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/products/" element={<FilteredProducts />}>
            <Route path="new-products" element={<FilteredProducts />} />
            <Route path="best-sellers" element={<FilteredProducts />} />
            <Route path="discounted-products" element={<FilteredProducts />} />
            <Route path=":categoryName" element={<FilteredProducts />} />
          </Route>
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route element={<ProtectedRoute requireLogin />}>
            <Route
              path="/verify-email"
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

          <Route element={<ProtectedRoute requireLogin requireCart />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
        <SnackBar />
        <Footer />
      </div>
    </CategoriesProvider>
  );
}

export default App;
