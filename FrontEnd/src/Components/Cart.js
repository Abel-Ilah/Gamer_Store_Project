import "./Cart.css";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { CartItem } from "./CartItem";
import { CartSkeleton } from "./CartSkeleton";
import { RelatedProducts } from "./RelatedProducts";
import { GET_CART } from "../features/cart/CartSlice";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Divider } from "@mui/material";
import { getRelatedProducts } from "../features/products/productsSlice";
import { useMediaQuery, useTheme } from "@mui/material";
import settings from "../appsettings.json";

export function Cart() {
  const [relatedproducts, setRelatedProducts] = useState(null);
  const {
    cart,
    loading: cartLoading,
    operation,
  } = useSelector((state) => state.cart);

  const [slidesToShow, setSlidesToShow] = useState(6);
  const [quantityError, setQuantityError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  useEffect(() => {
    if (cart && cart.length > 0) {
      relatedProducts();
    }
  }, [cart]);

  useEffect(() => {
    if (isXs) {
      setSlidesToShow(1);
    } else if (isSm) {
      setSlidesToShow(3);
    } else if (isMd) {
      setSlidesToShow(4);
    } else if (isLg || isXl) {
      setSlidesToShow(1);
    }
  }, [isXl, isLg, isMd, isSm, isXs]);

  const total = useMemo(() => {
    return calculateTotalPrice();
  }, [cart]);

  function calculateProductPrice(price, discountValue = 0) {
    if (typeof price !== "number") return 0;
    const newPrice =
      discountValue === 0 ? price : price - (price * discountValue) / 100;
    return newPrice;
  }

  function calculateTotalPrice() {
    return cart
      ? cart.reduce((acc, item) => {
          return (
            calculateProductPrice(
              item.product.price,
              item.product.discountValue
            ) *
              item.quantity +
            acc
          );
        }, 0)
      : 0;
  }

  function relatedProducts() {
    setRelatedProducts(null);
    const productId = cart[cart.length - 1].product.id;
    const pageSize = 10;
    dispatch(getRelatedProducts({ productId, pageSize }))
      .unwrap()
      .then((products) => {
        setRelatedProducts(products);
      })
      .catch();
  }

  function checkoutBtnClick() {
    let newError = "";
    for (const item of cart) {
      if (item.product.quantityInStock === 0) {
        newError =
          "One or more items in your cart are currently out of stock. Please remove the unavailable item(s) to proceed with checkout.";
        break;
      }
      if (item.product.quantityInStock < item.quantity) {
        newError =
          "The quantity of an item exceeds the available stock. Please adjust the quantity to continue.";
        break;
      }
    }
    console.log("error log: ", newError);
    if (newError) {
      setQuantityError(newError);
      window.scrollTo(0, 0);
    } else {
      setQuantityError(null);
      navigate("/checkout");
    }
  }
  return (
    <div className="cart">
      <Container maxWidth="xl">
        {cartLoading && operation === GET_CART && <CartSkeleton />}
        {(!cart || cart.length === 0) && (
          <div className="empty">Your cart is empty</div>
        )}
        {cart && cart.length > 0 && (
          <div className="content">
            {quantityError && (
              <div className="error-message">
                <h5>{quantityError}</h5>
              </div>
            )}
            <Grid container spacing={1}>
              <Grid size={{ sm: 12, md: 12, lg: 8.5 }}>
                {cart && (
                  <div className="items">
                    {cart.map((item) => {
                      return <CartItem item={item} key={item.id} />;
                    })}
                  </div>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3.5 }}>
                <div className="checkout">
                  <ul>
                    <li>
                      SubTotal:
                      <span>
                        {total.toFixed(2)} {settings.currrency}
                      </span>
                    </li>
                    <Divider />
                    <li>
                      Delivery:<span>0.00 {settings.currrency}</span>
                    </li>
                    <Divider />
                    <li className="total">
                      Total:
                      <span>
                        {total.toFixed(2)} {settings.currrency}
                      </span>
                    </li>
                    <Divider />
                  </ul>
                  <Button
                    className="checkout-btn btn-effect"
                    variant="contained"
                    onClick={checkoutBtnClick}
                  >
                    <span>checkout</span>
                    <span>checkout</span>
                  </Button>
                </div>
                {relatedproducts && (
                  <div className="related-products">
                    <RelatedProducts
                      products={relatedproducts}
                      slidesToShow={slidesToShow}
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
        )}
      </Container>
    </div>
  );
}
