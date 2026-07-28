import "./Checkout.css";
import { Button, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import settings from "../../appsettings.json";
import Container from "@mui/material/Container";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { CartItems } from "./CartItems";
import { useDispatch } from "react-redux";
import { AddNewOrder, GetOrderById } from "../../features/order/OrderSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { DeleteCart } from "../../features/cart/CartSlice";
import {
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  showMessage,
} from "../../features/snackbar/SnackbarSlice";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
const months = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

export function Checkout() {
  const { cart } = useSelector((state) => state.cart);
  const { customer: user } = useSelector((state) => state.customerAuth);
  const [expand, setExpand] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  //direct buy ====================
  const isDirectBuy = location.state?.isDirectBuy;
  const product = location.state?.product;
  const quantity = location.state?.quantity || 1;
  //===============================

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
  });
  const [cardInfo, setCardInfo] = useState({
    cardHolder: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  });
  const [errors, setErrors] = useState(null);

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const orderItems = useMemo(() => {
    return cart ? prepareOrderItems() : [];
  }, [cart]);

  const totalPrice = useMemo(() => {
    return orderItems
      ? orderItems.reduce((acc, item) => acc + item.totalPrice, 0)
      : 0;
  }, [orderItems]);

  function prepareOrderItems() {
    let items = [];

    if (isDirectBuy) {
      const unitPrice = calculateProductPrice(
        product.price,
        product.discountValue
      );
      const totalPrice = quantity * unitPrice;

      const item = {
        quantity,
        unitPrice,
        totalPrice,
        productId: product.id,
      };
      items.push(item);
    } else {
      cart.forEach((cartItem) => {
        const quantity = cartItem.quantity;
        const unitPrice = calculateProductPrice(
          cartItem.product.price,
          cartItem.product.discountValue
        );
        const totalPrice = quantity * unitPrice;

        const orderItem = {
          quantity,
          unitPrice,
          totalPrice,
          productId: cartItem.product.id,
        };
        items.push(orderItem);
      });
    }

    return items;
  }

  function calculateProductPrice(price, discountValue = 0) {
    if (typeof price !== "number") return 0;
    const newPrice =
      discountValue === 0 ? price : price - (price * discountValue) / 100;
    return newPrice;
  }

  const validate = () => {
    const newErrors = {};

    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = "FullName is required !";
    }

    if (!shippingInfo.address.trim()) {
      newErrors.address = "Address is required !";
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = "phone Number is required !";
    }

    if (/^\+?[0-9\s\-().]{7,15}$/.test(shippingInfo.phone) === false) {
      newErrors.phone = "phone Number is not valid !";
    }

    if (shippingInfo.email && !/^\S+@\S+\.\S+$/.test(shippingInfo.email)) {
      newErrors.email = "Email is not valid !";
    }

    // check bank card inputs :
    if (!cardInfo.cardHolder.trim()) {
      newErrors.cardholder = "cardholder Name is required !";
    }

    if (!cardInfo.cardNumber.trim()) {
      newErrors.cardNumber = "card Number is required !";
    } else if (cardInfo.cardNumber.trim().length < 16) {
      newErrors.cardNumber = "card Number is not valid !";
    }

    if (!cardInfo.expMonth) {
      newErrors.expMonth = "expiration Month is required !";
    }

    if (!cardInfo.expYear) {
      newErrors.expYear = "expiration Year is required !";
    }

    if (!cardInfo.cvv.trim()) {
      newErrors.cvv = "cvv is required !";
    } else if (cardInfo.cvv.trim().length < 3) {
      newErrors.cvv = "cvv is not valid !";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo(0, 0);
      return false;
    } else {
      setErrors(null);
      return true;
    }
  };

  function handlePlaceOrder() {
    if (validate()) {
      const userId = user ? user.id : null;
      let order = {
        userId,
        orderDate: new Date().toISOString(),
        totalAmount: totalPrice,
        fullName: shippingInfo.fullName.trim(),
        address: shippingInfo.address.trim(),
        phoneNumber: shippingInfo.phone.trim(),
        email: shippingInfo.email ? shippingInfo.email : null,
        orderItems,
        statusId: 2,
      };
      setStatus({ loading: true, error: null, success: false });
      dispatch(AddNewOrder(order))
        .unwrap()
        .then((createdOrder) => {
          // clear cart from database :
          if (!isDirectBuy && user) {
            dispatch(DeleteCart(createdOrder.userId));
          }
          // get created order :
          dispatch(GetOrderById(createdOrder.id))
            .unwrap()
            .then((order) => {
              setStatus({ loading: false, error: null, success: true });
              // show success message :
              dispatch(
                showMessage({
                  message: "Order has been created successfully!",
                  severity: SEVERITY_SUCCESS,
                })
              );
              sessionStorage.setItem("order", JSON.stringify(order));
              navigate("/order-confirmation");
            })
            .catch((err) => {
              setStatus({ loading: false, error: err, success: false });
              // show error message :
              dispatch(
                showMessage({
                  message: err,
                  severity: SEVERITY_ERROR,
                })
              );
            });
        })
        .catch((err) => {
          setStatus({ loading: false, error: err, success: false });
          // show error message :
          dispatch(
            showMessage({
              message: err,
              severity: SEVERITY_ERROR,
            })
          );
        });
    }
  }
  return (
    <div className="checkout-page">
      <Container maxWidth="xl">
        {status.loading && (
          <div className="loading">
            <div className="circle"></div>
          </div>
        )}

        {cart && (
          <>
            {errors && Object.keys(errors).length > 0 && (
              <ul className="error-message">
                {Object.values(errors).map((err) => (
                  <li>{err}</li>
                ))}
              </ul>
            )}

            <Grid container spacing={1}>
              <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                <div className="shipping-info">
                  <h3 className="sub-title">Billing info</h3>
                  <form className="form">
                    <TextField
                      autoFocus
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      name="fullname"
                      value={shippingInfo.fullName}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          fullName: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                        },
                      }}
                    />
                    <TextField
                      label="Address"
                      variant="outlined"
                      fullWidth
                      name="address"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          address: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                        },
                      }}
                    />

                    <TextField
                      label="Phone"
                      variant="outlined"
                      fullWidth
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          phone: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                        },
                      }}
                    />

                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      name="email"
                      value={shippingInfo.email}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          email: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                        },
                      }}
                    />
                  </form>
                </div>
                <div className="bank-card-info">
                  <h3 className="sub-title">Bank Card Info</h3>
                  <form className="form">
                    <div className="head">
                      <AccountBalanceIcon
                        style={{ color: "teal", fontSize: "2.5rem" }}
                      />
                      <img src="assets/bankCards.png" alt="bank cards logo" />
                    </div>
                    <TextField
                      label="Cardholder Name"
                      variant="outlined"
                      fullWidth
                      name="cardholder"
                      value={cardInfo.cardHolder}
                      onChange={(e) => {
                        const noDigits = e.target.value.replace(/\d/g, "");
                        if (noDigits !== cardInfo.cardHolder) {
                          setCardInfo({ ...cardInfo, cardHolder: noDigits });
                        }
                      }}
                      className="bank-field"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                        },
                      }}
                    />

                    <TextField
                      label="Card Number"
                      variant="outlined"
                      fullWidth
                      name="cardnumber"
                      value={cardInfo.cardNumber}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, "");
                        setCardInfo({ ...cardInfo, cardNumber: onlyNums });
                      }}
                      className="bank-field"
                      placeholder="4242 4242 4242 4242"
                      inputProps={{ maxLength: 16 }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                        },
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexFlow: "row wrap",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <FormControl
                        className="exp-month"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                      >
                        <InputLabel id="exp-month-label">Exp. Month</InputLabel>
                        <Select
                          labelId="exp-month-label"
                          name="expMonth"
                          value={cardInfo.expMonth}
                          onChange={(e) =>
                            setCardInfo({
                              ...cardInfo,
                              expMonth: e.target.value,
                            })
                          }
                          label="Exp. Month"
                        >
                          {months.map((month) => (
                            <MenuItem key={month} value={month}>
                              {month}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl
                        className="exp-year"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                      >
                        <InputLabel id="exp-year-label">Exp. Year</InputLabel>
                        <Select
                          labelId="exp-year-label"
                          name="expYear"
                          value={cardInfo.expYear}
                          onChange={(e) =>
                            setCardInfo({
                              ...cardInfo,
                              expYear: e.target.value,
                            })
                          }
                          label="Exp. Year"
                        >
                          {years.map((year) => (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        className="cvv"
                        label="CVV"
                        variant="outlined"
                        name="cvv"
                        value={cardInfo.cvv}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/\D/g, "");
                          setCardInfo({ ...cardInfo, cvv: onlyNums });
                        }}
                        placeholder="123"
                        inputProps={{ maxLength: 3 }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                      />
                    </div>
                  </form>
                  <h6 className="foot">
                    ✅ Your card details are 100% secure 🔒
                  </h6>
                </div>
              </Grid>
              <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                {" "}
                <div className="summary">
                  <h3 className="sub-title">Summary</h3>
                  <div className="order-items-wraper">
                    <div
                      className="items"
                      style={{
                        height:
                          isDirectBuy || cart.length <= 5
                            ? "auto"
                            : expand
                            ? "335px"
                            : "fit-content",
                      }}
                    >
                      <CartItems
                        items={isDirectBuy ? [{ quantity, product }] : cart}
                      />
                    </div>
                    <div
                      className="arrows-wraper"
                      style={{
                        display:
                          isDirectBuy || cart.length <= 5 ? "none" : "unset",
                      }}
                      onClick={() => setExpand(!expand)}
                    >
                      <KeyboardArrowDownIcon
                        className="arrow"
                        style={{ display: expand ? "unset" : "none" }}
                      />
                      <KeyboardArrowUpIcon
                        className="arrow"
                        style={{ display: !expand ? "unset" : "none" }}
                      />
                    </div>
                  </div>
                  <div
                    className="d-flex justify-content-between"
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: "gray",
                    }}
                  >
                    Shipping fee : <span>0.00 {settings.currrency}</span>
                  </div>
                  <div
                    className="d-flex justify-content-between"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bolder",
                      margin: "15px 0",
                    }}
                  >
                    Total :{" "}
                    <span style={{ color: "orangered" }}>
                      {totalPrice.toFixed(2)} {settings.currrency}
                    </span>
                  </div>
                  <div
                    className="btn-wraper"
                    onClick={handlePlaceOrder}
                    style={{
                      display: totalPrice && totalPrice > 0 ? "flex" : "none",
                    }}
                  >
                    <Button className="place-order" variant="contained">
                      Place Order
                    </Button>
                    <Button className="place-order" variant="contained">
                      Place Order
                    </Button>
                  </div>

                  <div
                    style={{
                      marginTop: "10px",
                      textAlign: "start",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "gray",
                    }}
                  >
                    Upon clicking 'Place Order', I confirm I have read and
                    acknowledged all terms and policies.
                  </div>
                </div>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </div>
  );
}
