import "./Cart.css";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import settings from "../appsettings.json";
import {
  UpdateItemQuantity,
  UPDATE_ITEM,
  DELETE_ITEM,
  updateItemQuantityLocal,
  DeleteItem,
  deleteItemLocal,
} from "../features/cart/CartSlice";
import { Link } from "react-router-dom";
import {
  SEVERITY_SUCCESS,
  showMessage,
} from "../features/snackbar/SnackbarSlice";

export function CartItem({ item }) {
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
    operation: null,
  });
  const [reduceOpacity, setReduceOpacity] = useState(false);

  useEffect(() => {
    if (item?.product.quantityInStock < item.quantity) {
      setStatus({
        ...status,
        error: "The selected quantity exceeds the available stock.",
      });
    }
    if (item?.product.quantityInStock === 0) {
      setStatus({
        ...status,
        error:
          "This product is out of stock, please remove it form the cart before checkout",
      });
      setReduceOpacity(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      setStatus({
        loading: false,
        error: null,
        success: false,
        operation: null,
      });
    };
  }, []);
  const dispatch = useDispatch();

  function calculatePrice(price, discountValue = 0) {
    if (typeof price !== "number") return 0;
    const newPrice =
      discountValue === 0 ? price : price - (price * discountValue) / 100;
    return newPrice.toFixed(2);
  }

  function increaseQunatityByOne() {
    setStatus({
      loading: true,
      success: false,
      error: null,
      operation: UPDATE_ITEM,
    });
    dispatch(
      UpdateItemQuantity({
        itemId: item.id,
        quantity: item.quantity + 1,
      })
    )
      .unwrap()
      .then((res) => {
        if (res) {
          dispatch(
            updateItemQuantityLocal({
              itemId: item.id,
              quantity: item.quantity + 1,
            })
          );
          dispatch(
            showMessage({
              message: `Item Quantity Updated !`,
              severity: SEVERITY_SUCCESS,
            })
          );
          setStatus({
            loading: false,
            success: true,
            error: null,
            operation: UPDATE_ITEM,
          });
        } else {
          throw new Error("operation failed, quantity not updated");
        }
      })
      .catch((err) => {
        setStatus({
          loading: false,
          success: false,
          error: err,
          operation: UPDATE_ITEM,
        });
      });
  }

  function decreaseQunatityByOne() {
    setStatus({
      loading: true,
      success: false,
      error: null,
      operation: UPDATE_ITEM,
    });
    dispatch(
      UpdateItemQuantity({
        itemId: item.id,
        quantity: item.quantity - 1,
      })
    )
      .unwrap()
      .then((res) => {
        if (res) {
          dispatch(
            updateItemQuantityLocal({
              itemId: item.id,
              quantity: item.quantity - 1,
            })
          );
          dispatch(
            showMessage({
              message: `Item Quantity Updated !`,
              severity: SEVERITY_SUCCESS,
            })
          );
          setStatus({
            loading: false,
            success: true,
            error: null,
            operation: UPDATE_ITEM,
          });
        } else {
          throw new Error("operation failed, quntity not updated");
        }
      })
      .catch((err) => {
        setStatus({
          loading: false,
          success: false,
          error: err,
          operation: UPDATE_ITEM,
        });
      });
  }

  function deleteItem() {
    setStatus({
      loading: true,
      success: false,
      error: null,
      operation: DELETE_ITEM,
    });
    dispatch(DeleteItem(item.id))
      .unwrap()
      .then((res) => {
        if (res) {
          dispatch(deleteItemLocal(item.id));
          dispatch(
            showMessage({
              message: `Item has been deleted from your cart.`,
              severity: SEVERITY_SUCCESS,
            })
          );
          setStatus({
            loading: false,
            success: true,
            error: null,
            operation: DELETE_ITEM,
          });
        } else {
          throw new Error("operation failed, the item not deleted");
        }
      })
      .catch((err) => {
        setStatus({
          loading: false,
          success: false,
          error: err,
          operation: DELETE_ITEM,
        });
      });
  }

  const totalPrice = useMemo(() => {
    return item
      ? calculatePrice(item.product.price, item.product.discountValue) *
          item.quantity
      : 0;
  }, [item]);

  function getItemImage(url, transform = "w_600,c_fill,q_auto,f_auto") {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : "assets/pc-gamer1.png";
  }

  return (
    <div className="cart-item">
      {status.error && (
        <div className="error-container">
          <div className="error">
            <span
              className="close"
              onClick={() => {
                setStatus({ ...status, error: null });
              }}
            >
              <CloseIcon />
            </span>
            <div className="error-message">
              <span className="icon">⚠️</span>
              <span className="text">{status.error}</span>
            </div>
          </div>
        </div>
      )}
      <Grid container spacing={0.5} alignItems={"center"}>
        <Grid
          className={reduceOpacity ? "reduce-opacity" : ""}
          size={{ xs: 12, sm: 2, md: 2 }}
        >
          <Link to={`/product/${item.product.id}`}>
            <div className="product-image">
              <img src={getItemImage(item.product.imageUrl)} alt="product" />
            </div>
          </Link>
        </Grid>
        <Grid
          className={reduceOpacity ? "reduce-opacity" : ""}
          size={{ xs: 12, sm: 10, md: 4 }}
        >
          <div className="info">
            <Link to={`/product/${item.product.id}`}>
              <h4 className="product-name">{item.product.name}</h4>
            </Link>
            <div className="price">
              {" "}
              {item.product.discountValue > 0 && (
                <span className="original-price">
                  {item.product.price} {}
                </span>
              )}
              <span className="new-price">
                {calculatePrice(item.product.price, item.product.discountValue)}{" "}
                {settings.currrency}
              </span>
            </div>
            <h5
              style={{
                fontSize: "0.8rem",
                fontWeight: "bold",
                color: item.product.quantityInStock > 0 ? "green" : "orange",
              }}
            >
              {item.product.quantityInStock > 0
                ? `IN STOCK (${item.product.quantityInStock})`
                : "OUT OF STOCK"}
            </h5>
          </div>
        </Grid>
        <Grid
          className={reduceOpacity ? "reduce-opacity" : ""}
          size={{ xs: 12, sm: 5, md: 2.5 }}
        >
          <div className="quantity">
            {status.operation === UPDATE_ITEM && status.loading && (
              <div className="loading">
                <div className="circle"></div>
              </div>
            )}
            <button
              className={"minus"}
              style={{
                color:
                  item.quantity === 1 || item.product.quantityInStock === 0
                    ? "gray"
                    : "orange",
                cursor:
                  item.quantity === 1 || item.product.quantityInStock === 0
                    ? "auto"
                    : "pointer",
              }}
              disabled={
                item.quantity === 1 ||
                item.product.quantityInStock === 0 ||
                status.loading
              }
              onClick={decreaseQunatityByOne}
            >
              -
            </button>
            <TextField
              className="input-quantity"
              variant="outlined"
              type="number"
              disabled
              inputMode="numeric"
              value={item.quantity}
              slotProps={{
                input: {
                  pattern: "[0-9]*",
                  onKeyDown: (e) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ];

                    if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "gray",
                    borderWidth: "1px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "gray",
                    borderWidth: "1px",
                  },
                },
                "& input": {
                  outline: "none",
                  padding: "5px",
                  textAlign: "center",
                  MozAppearance: "textfield",
                },
                "& input::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
            />

            <button
              className={"plus"}
              style={{
                color:
                  item.quantity < item.product.quantityInStock &&
                  item.product.quantityInStock > 0
                    ? "orange"
                    : "gray",
                cursor:
                  item.quantity < item.product.quantityInStock &&
                  item.product.quantityInStock > 0
                    ? "pointer"
                    : "auto",
              }}
              disabled={
                item.quantity >= item.product.quantityInStock ||
                item.product.quantityInStock === 0 ||
                status.loading
              }
              onClick={increaseQunatityByOne}
            >
              +
            </button>
          </div>
        </Grid>
        <Grid
          className={reduceOpacity ? "reduce-opacity" : ""}
          size={{ xs: 11, sm: 6, md: 2.5 }}
        >
          <div className="total-price" style={{ fontWeight: "bold" }}>
            {totalPrice.toFixed(2)} {settings.currrency}
          </div>
        </Grid>
        <Grid size={{ xs: 1, sm: 1 }} justifyContent={"flex-end"}>
          <div className="delete">
            {status.operation === DELETE_ITEM && status.loading && (
              <div className="loading">
                <div className="circle"></div>
              </div>
            )}
            <IconButton style={{ background: "none" }} onClick={deleteItem}>
              <DeleteIcon style={{ color: "red", fontSize: "2rem" }} />
            </IconButton>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
