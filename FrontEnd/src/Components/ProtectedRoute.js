import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({
  requireLogin = false,
  requireLogout = false,
  requireCart = false,
}) {
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const { cart, loading: cartLoading } = useSelector((state) => state.cart);
  console.log(user);
  console.log(cart);

  if ((requireLogin && userLoading) || (requireCart && cartLoading)) {
    return <div>Loading...</div>; // or your spinner
  }

  if (requireLogin && !user) {
    return <Navigate to="/login" />;
  }
  if (requireLogout && user) {
    return <Navigate to="/" />;
  }
  if (requireCart && (!cart || cart.length === 0)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
