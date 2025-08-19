import "./ProductDetails.css";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Container from "@mui/material/Container";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Button from "@mui/material/Button";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct, GET_PRODUCT } from "../reducers/ProductReducer";
import { useDispatch } from "react-redux";
import settings from "../appsettings.json";
import {
  AddNewItem,
  AddNewItemLocal,
  ADD_ITEM,
} from "../features/cart/CartSlice";
import {
  SEVERITY_SUCCESS,
  showMessage,
} from "../features/snackbar/SnackbarSlice";
export function ProductDetails() {
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
    operation: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { product, loading, error } = useProduct({
    actionType: GET_PRODUCT,
    payload: Number(id),
  });

  const realPrice = useMemo(() => {
    return calculatePrice(product.price, product.discountValue);
  }, [product.price, product.discountValue]);

  const [quantity, setQuantity] = useState(1);

  const [totalPrice, setTotalPrice] = useState(null);

  useEffect(() => {
    if (realPrice && !isNaN(realPrice)) {
      setTotalPrice(realPrice * quantity);
    }
  }, [realPrice, quantity]);

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
          productId: product.id,
          quantity: Number(quantity),
        })
      )
        .unwrap()
        .then((res) => {
          const addedItem = res;

          const cartItemProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            date: product.date,
            quantityInStock: product.quantityInStock,
            discountValue: product.discountValue,
            imageUrl: getMainImageUrl(),
          };

          dispatch(
            AddNewItemLocal({
              id: addedItem.id,
              userId: addedItem.userId,
              product: cartItemProduct,
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

  function handleBuyNow() {
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
    const details = product.details ? product.details.split("||") : null;
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
    const about = product.about ? product.about.split("||") : null;
    return about != null && about !== "" ? (
      <div className="about-product">
        <h4 style={{ textAlign: "start" }}>About item :</h4>
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
      !product ||
      !Array.isArray(product.images) ||
      product.images.length === 0
    ) {
      return "";
    }

    const mainImage = product.images.find((img) => img.isMain);
    return mainImage ? mainImage.imageUrl : product.images[0].imageUrl;
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product found.</p>;
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
                  <h3 className="product-name">{product.name}</h3>
                  <div className="rating" style={{ textAlign: "start" }}>
                    <Rating name="read-only" value={product.rate} readOnly />
                  </div>
                  <div className="price" style={{ textAlign: "start" }}>
                    {product.discountValue > 0 && (
                      <span className="old-price">
                        {product.price} {settings.currrency}
                      </span>
                    )}
                    <span className="new-price">
                      {realPrice} {settings.currrency}
                    </span>
                  </div>
                  <h5
                    style={{
                      color: product.quantityInStock > 0 ? "green" : "orange",
                      textAlign: "start",
                      margin: 0,
                    }}
                  >
                    {product.quantityInStock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                  </h5>
                  <div className="details">{generateProductDetails()}</div>

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
                            disabled={quantity === product.quantityInStock}
                            style={{
                              color:
                                quantity < product.quantityInStock
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
                        <div className="add-to-cart-wraper">
                          {status.loading && (
                            <div className="loading">
                              <span className="circle"></span>
                            </div>
                          )}
                          <Button
                            variant="contained"
                            className="add-to-cart"
                            onClick={handleAddToCart}
                            disabled={product.quantityInStock === 0}
                          >
                            add to cart <ShoppingCartIcon />
                          </Button>
                        </div>
                      </Grid>
                      <Grid
                        size={{ xs: 3, sm: 1.5, md: 2.5, lg: 1.5 }}
                        order={3}
                      >
                        <Button
                          variant="contained"
                          className="compare"
                          disabled={product.quantityInStock === 0}
                        >
                          <AutorenewIcon />
                        </Button>
                      </Grid>
                      <Grid
                        size={{ xs: 3, sm: 1.5, md: 2.5, lg: 1.5 }}
                        order={{ xs: 5, sm: 2, md: 2, lg: 4 }}
                      >
                        <Button
                          variant="contained"
                          className="wishlist"
                          disabled={product.quantityInStock === 0}
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
                          disabled={product.quantityInStock === 0}
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
          </div>
        </Container>
      </div>
    );
}
