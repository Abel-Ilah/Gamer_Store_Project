import { Link } from "react-router-dom";
import "./Product.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoopIcon from "@mui/icons-material/Loop";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch } from "react-redux";
import {
  AddNewItem,
  AddNewItemLocal,
  ADD_ITEM,
} from "../features/cart/CartSlice";
import { useState } from "react";
import {
  showMessage,
  SEVERITY_SUCCESS,
} from "../features/snackbar/SnackbarSlice";
import settings from "../appsettings.json";

let last60Days = new Date(Date.now() - 60 * 86400000)
  .toISOString()
  .split("T")[0];

export function Product({ Product }) {
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
    operation: null,
  });

  const dispatch = useDispatch();

  function calculatePrice(price, discountValue = 0) {
    if (typeof price !== "number") return 0;
    const newPrice =
      discountValue === 0 ? price : price - (price * discountValue) / 100;
    return newPrice.toFixed(2);
  }

  function addCloudinaryTransform(
    url,
    transform = "w_350,c_fill,q_auto,f_auto"
  ) {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : "assets/pc-gamer1.png";
  }

  function handleAddToCart() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (currentUser) {
      setStatus({
        loading: true,
        error: null,
        success: false,
        operation: ADD_ITEM,
      });
      dispatch(
        AddNewItem({
          userId: currentUser.id,
          productId: Product.id,
          quantity: 1,
        })
      )
        .unwrap()
        .then((res) => {
          const addedItem = res;
          dispatch(
            AddNewItemLocal({
              id: addedItem.id,
              userId: addedItem.userId,
              product: Product,
              quantity: addedItem.quantity,
            })
          );
          setStatus({
            loading: false,
            error: null,
            success: true,
            operation: ADD_ITEM,
          });
          dispatch(
            showMessage({
              message: "Done! The product has been added to your cart.",
              severity: SEVERITY_SUCCESS,
            })
          );
        })
        .catch((err) => {
          setStatus({
            loading: false,
            error: err,
            success: false,
            operation: ADD_ITEM,
          });
        });
    }
  }

  return (
    <div className="product" key={Product.id}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          width: "fit-content",
          position: "absolute",
          top: "2px",
          left: "2px",
        }}
      >
        {" "}
        {Product.discountValue > 0 && (
          <span className="discount-value">-{Product.discountValue}%</span>
        )}
        {Product.date >= last60Days && <span className="new">New</span>}
      </div>
      <Link to={`/product/${Product.id}`}>
        <div className="wraper">
          <img
            className="image"
            src={addCloudinaryTransform(Product.imageUrl)}
            alt="product"
          />
        </div>
      </Link>
      <div className="details">
        <Link to={`/product/${Product.id}`}>
          <h5 className="product-name">{Product.name}</h5>
        </Link>
        <div className="price">
          {Product.discountValue > 0 && (
            <span className="old-price">
              {Product.price} {settings.currrency}
            </span>
          )}
          <span className="new-price">
            {calculatePrice(Product.price, Product.discountValue)}{" "}
            {settings.currrency}
          </span>
        </div>
        <h4
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            textAlign: "center",
            color: Product.quantityInStock >= 1 ? "green" : "orange",
            margin: 0,
          }}
        >
          {Product.quantityInStock >= 1 ? "IN STOCK" : "OUT OF STOCK"}
        </h4>
        <ul>
          <li style={{ textAlign: "center" }}>
            {" "}
            &rarr; 3 Months for new &larr;
          </li>
          <li style={{ textAlign: "center" }}> &rarr; Free delivery &larr;</li>
        </ul>
      </div>
      <div className="add-to-cart-wraper">
        {status.loading && (
          <div className="loading">
            <div className="circle"></div>
          </div>
        )}
        <Button
          className="add-to-cart-btn"
          style={{
            width: "fit-content",
            display: "block",
            pointerEvents: Product.quantityInStock === 0 ? "none" : "auto",
            backgroundColor: Product.quantityInStock === 0 ? "gray" : "auto",
          }}
          variant="contained"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
