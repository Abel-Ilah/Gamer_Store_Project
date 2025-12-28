import "./ProductDetails.css";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Container from "@mui/material/Container";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Button from "@mui/material/Button";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CircularProgress from "@mui/material/CircularProgress";

import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import settings from "../../appsettings.json";
import {
  AddNewItem,
  AddNewItemLocal,
  ADD_ITEM,
} from "../../features/cart/CartSlice";
import {
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  showMessage,
} from "../../features/snackbar/SnackbarSlice";
import { LoadingPage } from "./LoadingPage";
import Divider from "@mui/material/Divider";
import { Review } from "./Review";
import { AddReview } from "./AddReview";
import { getProductById } from "../../features/product/productSlice";
import { getProductReviews } from "../../features/review/reviewSlice";
import MessageIcon from "@mui/icons-material/Message";
import {
  addNewWishlistItem,
  AddNewWishlistItemLocal,
} from "../../features/wishlist/WishlistSlice";

export function ProductDetails() {
  const [productState, setProductState] = useState({
    product: null,
    loading: false,
    error: null,
  });
  const [addToCartStatus, setAddToCartStatus] = useState({
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

  const { customer: user } = useSelector((state) => state.customerAuth);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  const { reviews: productReviews } = useSelector((state) => state.review);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // product-id:
  const { id } = useParams();

  useEffect(() => {
    setProductState({ product: null, loading: true, error: null });
    dispatch(getProductById(id))
      .unwrap()
      .then((product) => {
        setProductState({ product: product, loading: false, error: null });

        dispatch(getProductReviews(product.id));
      })
      .catch((err) =>
        setProductState({ product: null, loading: false, error: err })
      );
  }, [id, dispatch]);

  const realPrice = useMemo(() => {
    return productState.product
      ? calculatePrice(
          productState.product.price,
          productState.product.discountValue
        )
      : 0;
  }, [productState.product]);

  const isProductInCart = useMemo(() => {
    if (!cart || cart.length === 0) return false;
    return cart.some((item) => item.product.id === +id);
  }, [cart, id]);

  const isProductInWishlist = useMemo(() => {
    if (!wishlist || wishlist.length === 0) return false;
    return wishlist.some((item) => item.product.id === +id);
  }, [wishlist, id]);

  const [quantity, setQuantity] = useState(1);

  const [totalPrice, setTotalPrice] = useState(null);

  useEffect(() => {
    if (realPrice && !isNaN(realPrice)) {
      setTotalPrice(realPrice * quantity);
    }
  }, [realPrice, quantity]);

  function handleAddToCart() {
    const product = productState.product;
    const cartItemProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      date: product.date,
      quantityInStock: product.quantityInStock,
      discountValue: product.discountValue,
      imageUrl: getMainImageUrl(),
    };

    if (user) {
      setAddToCartStatus({
        loading: true,
        error: null,
        success: false,
        operation: ADD_ITEM,
      });
      dispatch(
        AddNewItem({
          userId: user.id,
          productId: product.id,
          quantity: quantity,
        })
      )
        .unwrap()
        .then((res) => {
          const addedItem = res;

          dispatch(
            AddNewItemLocal({
              id: addedItem.id,
              userId: addedItem.userId,
              product: cartItemProduct,
              quantity: addedItem.quantity,
            })
          );
          setAddToCartStatus({
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
          setAddToCartStatus({
            loading: false,
            error: err,
            success: false,
            operation: ADD_ITEM,
          });
        });
    } else {
      const newItem = {
        id: crypto.randomUUID(),
        userId: null,
        product: cartItemProduct,
        quantity: quantity,
      };
      dispatch(AddNewItemLocal(newItem));
    }
  }

  function handleAddToWishlist() {
    const product = productState.product;
    const wishlistItemProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      date: product.date,
      quantityInStock: product.quantityInStock,
      discountValue: product.discountValue,
      imageUrl: getMainImageUrl(),
    };
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
            product: wishlistItemProduct,
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
        product: wishlistItemProduct,
      };
      dispatch(AddNewWishlistItemLocal(newItem));
    }
  }
  function handleBuyNow() {
    const product = productState.product;
    navigate("/checkout", {
      state: {
        isDirectBuy: true,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          date: product.date,
          quantityInStock: product.quantityInStock,
          discountValue: product.discountValue,
          imageUrl: getMainImageUrl(),
        },
        quantity,
      },
    });
  }

  function generateProductDetails() {
    const details = productState.product.details
      ? productState.product.details.split("||")
      : null;
    return details != null ? (
      <table style={{ marginTop: "20px" }}>
        <tbody>
          {details.map((element, index) => {
            const [key, val] = element.split(":");
            return key !== null && key !== "" ? (
              <tr
                key={index}
                style={{
                  textAlign: "start",
                  fontSize: "18px",
                  height: "35px",
                }}
              >
                <td>
                  <span
                    style={{
                      marginRight: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {key}
                  </span>
                </td>
                <td>
                  <span>{val}</span>
                </td>
              </tr>
            ) : null;
          })}
        </tbody>
      </table>
    ) : null;
  }
  function generateProductAbout() {
    const about = productState.product.about
      ? productState.product.about.split("||")
      : null;
    return about ? (
      <div className="about-product">
        <h5 className="sub-title">About item</h5>
        <ul
          style={{
            listStyle: "outside",
            textAlign: "start",
            fontSize: "18px",
            lineHeight: "1.8",
          }}
        >
          {about.map((element) => (
            <li style={{ padding: "5px 0", marginLeft: "25px" }}>{element}</li>
          ))}
        </ul>
      </div>
    ) : null;
  }
  function calculatePrice(price, discountValue = 0) {
    if (typeof price !== "number") return 0;
    const newPrice =
      discountValue === 0 ? price : price - (price * discountValue) / 100;
    return newPrice.toFixed(2);
  }
  function addCloudinaryTransform(
    url,
    transform = "w_800,c_fill,q_auto,f_auto"
  ) {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : url;
  }
  function getMainImageUrl() {
    if (
      !productState.product ||
      !Array.isArray(productState.product.images) ||
      productState.product.images.length === 0
    ) {
      return "";
    }

    const mainImage = productState.product.images.find((img) => img.isMain);
    return mainImage
      ? mainImage.imageUrl
      : productState.product.images[0].imageUrl;
  }
  if (productState.loading) return <LoadingPage />;
  if (productState.error) return <p>Error: {productState.error}</p>;
  if (!productState.product) return <p>No product found.</p>;
  else
    return (
      <div className="product-details">
        <Container maxWidth="xl">
          <div className="box">
            <Grid container spacing={1}>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <div className="images">
                  <img
                    className="image"
                    src={addCloudinaryTransform(getMainImageUrl())}
                    alt="product"
                  />
                </div>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <div className="info">
                  <div>
                    <h3 className="product-name">
                      {productState.product.name}
                    </h3>
                    <div className="rating">
                      <Rating
                        name="read-only"
                        value={
                          productState.product.rating > 0
                            ? productState.product.rating
                            : 5
                        }
                        readOnly
                        precision={0.5}
                      />
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        {"("}
                        {productState.product.reviewsCount}
                        <MessageIcon
                          style={{
                            fontSize: "20px",
                            color: "teal",
                            marginLeft: "1px",
                          }}
                        />
                        {")"}
                      </span>
                    </div>
                    <div className="price" style={{ textAlign: "start" }}>
                      {productState.product.discountValue > 0 && (
                        <span className="old-price">
                          {productState.product.price} {settings.currrency}
                        </span>
                      )}
                      <span className="new-price">
                        {realPrice} {settings.currrency}
                      </span>
                    </div>
                    <h5
                      style={{
                        color:
                          productState.product.quantityInStock > 0
                            ? "green"
                            : "orange",
                        textAlign: "start",
                        margin: 0,
                      }}
                    >
                      {productState.product.quantityInStock > 0
                        ? "IN STOCK"
                        : "OUT OF STOCK"}
                    </h5>
                    <div className="details">{generateProductDetails()}</div>
                  </div>
                  <div className="product-cta">
                    <div className="total-price">
                      Total Price :{" "}
                      <span>
                        {totalPrice !== null
                          ? `${totalPrice.toFixed(2)} ${settings.currrency}`
                          : "Calculating..."}
                      </span>
                    </div>

                    <Grid className="btns" container spacing={1}>
                      <Grid
                        size={{ xs: 12, sm: 3, md: 7, lg: 3 }}
                        order={{ xs: 1, lg: 1 }}
                      >
                        <div className="quantity">
                          <button
                            variant="contained"
                            className="minus"
                            onClick={() => {
                              setQuantity((prevQuantity) => {
                                const newQuantity = prevQuantity - 1;
                                setTotalPrice(realPrice * newQuantity);
                                return newQuantity;
                              });
                            }}
                            disabled={quantity === 1}
                            style={{
                              color: quantity > 1 ? "orange" : "gray",
                            }}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="number"
                            disabled
                            value={quantity}
                          />
                          <button
                            className="plus"
                            onClick={() => {
                              setQuantity((prevQuantity) => {
                                const newQuantity = prevQuantity + 1;
                                setTotalPrice(realPrice * newQuantity);
                                return newQuantity;
                              });
                            }}
                            disabled={
                              quantity === productState.product.quantityInStock
                            }
                            style={{
                              color:
                                quantity < productState.product.quantityInStock
                                  ? "orange"
                                  : "gray",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </Grid>
                      <Grid
                        size={{ xs: 9, sm: 9, md: 12, lg: 9 }}
                        order={{ xs: 2, sm: 2, md: 4, lg: 2 }}
                      >
                        <Button
                          loading={addToCartStatus.loading}
                          loadingIndicator={
                            <CircularProgress
                              size={25}
                              style={{ color: "white" }}
                            />
                          }
                          variant="contained"
                          className="add-to-cart"
                          onClick={handleAddToCart}
                          disabled={
                            productState.product.quantityInStock === 0 ||
                            isProductInCart
                          }
                          style={
                            isProductInCart
                              ? { backgroundColor: "#cccccc" }
                              : null
                          }
                        >
                          add to cart <ShoppingCartIcon />
                        </Button>
                      </Grid>
                      <Grid
                        size={{ xs: 3, sm: 1.5, md: 2.5, lg: 1.5 }}
                        order={3}
                      >
                        <Button
                          variant="contained"
                          className="compare"
                          disabled={productState.product.quantityInStock === 0}
                        >
                          <AutorenewIcon />
                        </Button>
                      </Grid>
                      <Grid
                        size={{ xs: 3, sm: 1.5, md: 2.5, lg: 1.5 }}
                        order={{ xs: 5, sm: 2, md: 2, lg: 4 }}
                      >
                        <Button
                          loading={wishlistItemStatus.loading}
                          loadingIndicator={
                            <CircularProgress
                              size={25}
                              style={{ color: "white" }}
                            />
                          }
                          variant="contained"
                          className="wishlist"
                          onClick={handleAddToWishlist}
                          disabled={
                            productState.product.quantityInStock === 0 ||
                            isProductInWishlist
                          }
                          style={
                            isProductInWishlist
                              ? { backgroundColor: "#cccccc" }
                              : null
                          }
                        >
                          <FavoriteIcon />
                        </Button>
                      </Grid>
                      <Grid
                        size={{ xs: 9, sm: 9, md: 12, lg: 9 }}
                        order={{ xs: 4, sm: 5, md: 5, lg: 5 }}
                      >
                        <Button
                          variant="contained"
                          className="buy-now"
                          onClick={handleBuyNow}
                          disabled={productState.product.quantityInStock === 0}
                        >
                          buy now <LocalMallIcon />
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Grid>
            </Grid>
            {generateProductAbout()}
            <Divider style={{ height: "1px", backgroundColor: "black" }} />
            {productState.product.description && (
              <div className="product-description">
                <h5 className="sub-title">Description</h5>
                <p style={{ textAlign: "start", lineHeight: "1.8" }}>
                  {productState.product.description}
                </p>
                <Divider style={{ height: "1px", backgroundColor: "black" }} />
              </div>
            )}
            <div className="reviews">
              <AddReview productId={productState.product.id} />
              {productReviews && productReviews.length > 0 && (
                <div>
                  <h5 className="sub-title" style={{ marginBottom: "15px" }}>
                    Last Reviews
                  </h5>
                  {productReviews.map((r, i) => (
                    <Review review={r} key={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    );
}
