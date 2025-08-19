import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";
import { Home } from "./Components/Home";
import { CategoriesProvider } from "./contexts/CategoriesProvider";
import { Routes, Route, useLocation } from "react-router-dom";
import { ProductsCategory } from "./Components/ProductsCategory";
import { ProductDetails } from "./Components/ProductDetails";
import { SignUp } from "./Components/SignUp";
import { EmailConfirmation } from "./Components/EmailConfirmation";
import { Login } from "./Components/Login";
import { Cart } from "./Components/Cart";
import { Checkout } from "./Components/Checkout";
import { OrderConfirmation } from "./Components/OrderConfirmation";
import { ProtectedRoute } from "./Components/ProtectedRoute";

import SnackBar from "./Components/SnackBar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetCurrentUser, markUserAsReady } from "./features/users/UserSlice";
import { GetUserCart, markCartAsReady } from "./features/cart/CartSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const login = JSON.parse(localStorage.getItem("login"));
    if (login && login.autoLogin) {
      dispatch(
        GetCurrentUser({ email: login.email, password: login.password })
      );
    } else {
      dispatch(markUserAsReady());
      dispatch(markCartAsReady());
    }
  }, []);

  useEffect(() => {
    const hasCart = localStorage.getItem("hasCart");
    if (user && hasCart === "true") {
      dispatch(GetUserCart(user.id));
    } else {
      dispatch(markCartAsReady());
    }
  }, [user, dispatch]);

  const location = useLocation();
  return (
    <CategoriesProvider>
      <div className="App">
        <Header></Header>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/products/" element={<ProductsCategory />}>
            <Route path="new-products" element={<ProductsCategory />} />
            <Route path="best-sellers" element={<ProductsCategory />} />
            <Route path="discounted-products" element={<ProductsCategory />} />
            <Route path=":categoryName" element={<ProductsCategory />} />
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
