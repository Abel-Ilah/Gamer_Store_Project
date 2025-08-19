import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingPage } from "./LoadingPage";

export function ProtectedRoute({
  requireLogin = false,
  requireLogout = false,
  requireCart = false,
}) {
  const { user, ready: isUserReady } = useSelector((state) => state.user);
  const { cart, ready: isCartReady } = useSelector((state) => state.cart);

  console.log("cart", cart);
  console.log("user", user);
  if (
    ((requireLogin || requireLogout) && !isUserReady) ||
    (requireCart && !isCartReady)
  ) {
    return <LoadingPage />;
  }

  if (requireLogin && !user) {
    return <Navigate to="/login" />;
  }
  if (requireLogout && user) {
    return <Navigate to="/" />;
  }
  if (requireCart && (cart === null || cart === undefined)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
