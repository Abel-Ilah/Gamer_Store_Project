import { Link, useNavigate } from "react-router-dom";
import "./Product.css";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoopIcon from "@mui/icons-material/Loop";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { useDispatch, useSelector } from "react-redux";
import {
  AddNewItem,
  AddNewItemLocal,
  ADD_ITEM,
} from "../features/cart/CartSlice";
import { useMemo, useState } from "react";
import {
  showMessage,
  SEVERITY_SUCCESS,
  SEVERITY_ERROR,
} from "../features/snackbar/SnackbarSlice";
import settings from "../appsettings.json";
import {
  addNewWishlistItem,
  AddNewWishlistItemLocal,
} from "../features/wishlist/WishlistSlice";
import IconButton from "@mui/material/IconButton";
import {
  addNewComparelistItem,
  AddNewCompareListItemLocal,
} from "../features/Compare/CompareSlice";
import { CircularProgress } from "@mui/material";

let last60Days = new Date(Date.now() - 30 * 86400000)
  .toISOString()
  .split("T")[0];

export function Product({ Product: product, showRating = false }) {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { compare } = useSelector((state) => state.compare);

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
    operation: null,
  });

  const [wishlistItemStatus, setWishlistItemStatus] = useState({
    loading: false,
    error: null,
    success: false,
    operation: null,
  });

  const [comparelistItemStatus, setComparelistItemStatus] = useState({
    loading: false,
    error: null,
    success: false,
    operation: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isProductInCart = useMemo(() => {
    if (!cart || cart.length === 0) return false;
    return cart.some((item) => item.product.id === product.id);
  }, [cart, product.id]);

  const isProductInWishlist = useMemo(() => {
    if (!wishlist || wishlist.length === 0) return false;
    return wishlist.some((item) => item.product.id === product.id);
  }, [wishlist, product.id]);

  const isProductInComparelist = useMemo(() => {
    if (!compare || compare.length === 0) return false;
    return compare.some((item) => item.product.id === product.id);
  }, [compare, product.id]);

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
    if (user) {
      setStatus({
        loading: true,
        error: null,
        success: false,
        operation: ADD_ITEM,
      });
      dispatch(
        AddNewItem({
          userId: user ? user.id : null,
          productId: product.id,
          quantity: 1,
        })
      )
        .unwrap()
        .then((res) => {
          const addedItem = res;
          const localItem = {
            id: addedItem.id,
            userId: addedItem.userId,
            product: product,
            quantity: addedItem.quantity,
          };
          dispatch(AddNewItemLocal(localItem));
          // add item locally to temp cart in guest mode (logout)
          if (addedItem.userId === null) {
            let guestCart = JSON.parse(sessionStorage.getItem("cart"));
            guestCart =
              guestCart && guestCart.length > 0
                ? [localItem, ...guestCart]
                : [localItem];
            sessionStorage.setItem("cart", JSON.stringify(guestCart));
          }
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
          dispatch(
            showMessage({
              message: err,
              severity: SEVERITY_ERROR,
            })
          );
        });
    } else {
      const newItem = {
        id: crypto.randomUUID(),
        userId: null,
        product: product,
        quantity: 1,
      };
      dispatch(AddNewItemLocal(newItem));
    }
  }

  function handleAddToWishlist() {
    if (user) {
      setWishlistItemStatus({
        loading: true,
        error: null,
        success: false,
        operation: ADD_ITEM,
      });
      dispatch(
        addNewWishlistItem({
          userId: user.id,
          productId: product.id,
        })
      )
        .unwrap()
        .then((res) => {
          const addedItem = res;
          const localItem = {
            id: addedItem.id,
            userId: addedItem.userId,
            product: product,
          };
          dispatch(AddNewWishlistItemLocal(localItem));
          setWishlistItemStatus({
            loading: false,
            error: null,
            success: true,
            operation: ADD_ITEM,
          });
          dispatch(
            showMessage({
              message: "Done! The product has been added to your wishlist.",
              severity: SEVERITY_SUCCESS,
            })
          );
        })
        .catch((err) => {
          setWishlistItemStatus({
            loading: false,
            error: err,
            success: false,
            operation: ADD_ITEM,
          });
          dispatch(
            showMessage({
              message: err,
              severity: SEVERITY_ERROR,
            })
          );
        });
    } else {
      const newItem = {
        id: crypto.randomUUID(),
        userId: null,
        product: product,
      };
      dispatch(AddNewWishlistItemLocal(newItem));
    }
  }

  function handleAddToComparelist() {
    if (user) {
      setComparelistItemStatus({
        loading: true,
        error: null,
        success: false,
        operation: ADD_ITEM,
      });
      dispatch(
        addNewComparelistItem({
          userId: user.id,
          productId: product.id,
        })
      )
        .unwrap()
        .then((res) => {
          const addedItem = res;
          const localItem = {
            id: addedItem.id,
            userId: addedItem.userId,
            product: product,
          };
          dispatch(AddNewCompareListItemLocal(localItem));
          setComparelistItemStatus({
            loading: false,
            error: null,
            success: true,
            operation: ADD_ITEM,
          });
          dispatch(
            showMessage({
              message: "Done! The product has been added to your compare list.",
              severity: SEVERITY_SUCCESS,
            })
          );
        })
        .catch((err) => {
          setComparelistItemStatus({
            loading: false,
            error: err,
            success: false,
            operation: ADD_ITEM,
          });
          dispatch(
            showMessage({
              message: err,
              severity: SEVERITY_ERROR,
            })
          );
        });
    } else {
      const newItem = {
        id: crypto.randomUUID(),
        userId: null,
        product: product,
      };
      dispatch(AddNewCompareListItemLocal(newItem));
    }
  }

  return (
    <div className="product" key={product.id}>
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
        {product.discountValue > 0 && (
          <span className="discount-value">-{product.discountValue}%</span>
        )}
        {product.date >= last60Days && <span className="new">New</span>}
      </div>
      <div className="wraper">
        <img
          className="image"
          src={addCloudinaryTransform(product.imageUrl)}
          alt="product"
          onClick={() => {
            navigate(`/product/${product.id}`);
          }}
        />
        <div className="cta-btns">
          <IconButton
            style={{
              pointerEvents: isProductInComparelist ? "none" : "unset",
              color: isProductInComparelist ? "#ff000e" : "white",
            }}
            onClick={handleAddToComparelist}
            loading={comparelistItemStatus.loading}
            loadingIndicator={
              <CircularProgress size={25} sx={{ color: "white" }} />
            }
            disabled={comparelistItemStatus.loading}
          >
            <LoopIcon
              style={{
                display: comparelistItemStatus.loading ? "none" : "inline-flex",
              }}
            />
          </IconButton>

          <IconButton>
            <VisibilityIcon />
          </IconButton>

          <IconButton
            style={{
              pointerEvents: isProductInWishlist ? "none" : "unset",
              color: isProductInWishlist ? "#ff000e" : "white",
            }}
            onClick={handleAddToWishlist}
            loading={wishlistItemStatus.loading}
            loadingIndicator={
              <CircularProgress size={25} sx={{ color: "white" }} />
            }
          >
            <FavoriteIcon
              style={{
                display: wishlistItemStatus.loading ? "none" : "inline-flex",
              }}
            />
          </IconButton>
        </div>
      </div>

      <div className="details">
        <Link to={`/product/${product.id}`}>
          <h5 className="product-name">{product.name}</h5>
        </Link>
        {showRating && (
          <Rating
            precision={0.1}
            name="read-only"
            value={product.rating}
            readOnly
            style={{ fontSize: "25px", marginLeft: "-3px" }}
          />
        )}
        <span className="price">
          {calculatePrice(product.price, product.discountValue)}{" "}
          {settings.currrency}
        </span>

        <h4
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            textAlign: "start",
            color: product.quantityInStock >= 1 ? "green" : "orange",
            margin: 0,
          }}
        >
          {product.quantityInStock >= 1 ? "IN STOCK" : "OUT OF STOCK"}
        </h4>
      </div>
      <div className="add-to-cart-wraper">
        {status.loading && (
          <div className="loading">
            <div className="circle"></div>
          </div>
        )}
        <Button
          className="add-to-cart-btn btn-effect"
          style={{
            display: isProductInCart ? "none" : "block",
            pointerEvents: product.quantityInStock === 0 ? "none" : "auto",
            backgroundColor: product.quantityInStock === 0 ? "gray" : "auto",
          }}
          variant="contained"
          onClick={() => {
            handleAddToCart();
          }}
        >
          <span> Add to Cart</span>
          <span>
            {" "}
            <ShoppingCartIcon />
          </span>
        </Button>
        <Button
          className="view-cart-btn btn-effect"
          style={{
            display: !isProductInCart ? "none" : "block",
            pointerEvents: product.quantityInStock === 0 ? "none" : "auto",
            backgroundColor: product.quantityInStock === 0 ? "gray" : "auto",
          }}
          variant="contained"
          onClick={() => {
            navigate("/cart");
          }}
        >
          <span> View Cart</span>
          <span>
            {" "}
            <TrendingFlatIcon style={{ fontSize: "2rem" }} />
          </span>
        </Button>
      </div>
    </div>
  );
}
