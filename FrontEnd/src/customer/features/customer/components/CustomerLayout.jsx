import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import {
  getSavedCustomerLoginInfo,
  loginAsCustomer,
  markCustomerAuthAsReady,
} from "../../auth/CustomerAuthSlice";
import { getGuestCart, GetUserCart } from "../../cart/slices/CartSlice";
import {
  getGuestWishlist,
  getUserWishlist,
} from "../../wishlist/slices/WishlistSlice";
import {
  getGuestCompareList,
  getUserCompareList,
} from "../../Compare/slices/CompareSlice";

function CustomerLayout() {
  const dispatch = useDispatch();
  const { customer, isAuthReady } = useSelector((state) => state.customerAuth);
  useEffect(() => {
    const savedLogin = getSavedCustomerLoginInfo();
    if (savedLogin && savedLogin.autoLogin) {
      dispatch(
        loginAsCustomer({
          email: savedLogin.email,
          password: savedLogin.password,
        }),
      );
    } else {
      dispatch(markCustomerAuthAsReady());
    }
  }, []);

  useEffect(() => {
    if (isAuthReady) {
      if (customer) {
        dispatch(GetUserCart(customer.id));
        dispatch(getUserWishlist(customer.id));
        dispatch(getUserCompareList(customer.id));
      } else {
        dispatch(getGuestCart());
        dispatch(getGuestWishlist());
        dispatch(getGuestCompareList());
      }
    }
  }, [isAuthReady, customer, dispatch]);

  return <Outlet />;
}

export default CustomerLayout;
