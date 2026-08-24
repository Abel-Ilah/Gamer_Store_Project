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
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import settings from "../../../../appsettings.json";
import {
  AddNewItem,
  AddNewItemLocal,
  ADD_ITEM,
} from "../../cart/slices/CartSlice";
import {
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  showMessage,
} from "../../snackbar/SnackbarSlice";
import { AddReview } from "../../review/components/AddReview";
import {
  addNewWishlistItem,
  AddNewWishlistItemLocal,
} from "../../wishlist/slices/WishlistSlice";
import Tooltip from "@mui/material/Tooltip";
import { IconButton, Typography } from "@mui/material";
import { getProductDetails } from "../slices/productsSlice";
import {
  deleteReview,
  getProductReviews,
} from "../../../../common/APIs/ReviewAPIs";
import { GetImage, GetMainImageURL } from "../../../../common/js/helpers";
import LoadingProgress from "../../../../common/components/LoadingProgress";
import ErrorMessage from "../../../../common/components/ErrorMessage";
import BackButton from "../../../../common/components/BackButton";
import {
  addNewComparelistItem,
  AddNewCompareListItemLocal,
} from "../../Compare/slices/CompareSlice";

export function ProductDetails({ onBack = () => {} }) {
  // states management ===========
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
  const [addToComparePending, setAddToComparePending] = useState(false);
  const [reviewsState, setReviewsState] = useState({
    reviews: [],
    loading: false,
    error: null,
    hasMore: false,
  });
  const [reviewsToDelete, setReviewsToDelete] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  // ===============================
  //  variables ====================
  //productID :
  const { id: productId } = useParams();
  const { customer: user } = useSelector((state) => state.customerAuth);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { compare } = useSelector((state) => state.compare);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isProductInCart = useMemo(() => {
    if (!cart || cart.length === 0) return false;
    return cart.some((item) => item.product.id === +productId);
  }, [cart, productId]);
  const isProductInWishlist = useMemo(() => {
    if (!wishlist || wishlist.length === 0) return false;
    return wishlist.some((item) => item.product.id === +productId);
  }, [wishlist, productId]);

  const isProductIComparelist = useMemo(() => {
    if (!compare || compare.length === 0) return false;
    return compare.some((item) => item.product.id === +productId);
  }, [compare, productId]);

  const realPrice = useMemo(() => {
    return productState.product
      ? calculatePrice(
          productState.product.price,
          productState.product.discount,
        )
      : 0;
  }, [productState.product]);

  // ===============================
  useEffect(() => {
    setProductState({ loading: true, error: null, product: null });
    if (productId) {
      dispatch(getProductDetails(productId))
        .unwrap()
        .then((product) => {
          setProductState({ loading: false, error: null, product: product });
          setSelectedImage(GetMainImageURL(product.images));
          if (product.totalReviews > 0) {
            handleGetReviews(product.id, pageNumber);
          }
        })
        .catch((err) => {
          setProductState({ loading: false, error: err, product: null });
        });
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (productId && pageNumber > 1) {
      handleGetReviews(productId, pageNumber);
    }
  }, [pageNumber, productId]);

  useEffect(() => {
    if (realPrice && !isNaN(realPrice)) {
      setTotalPrice(realPrice * quantity);
    }
  }, [realPrice, quantity]);

  //  handlers ======================

  function handleGetReviews(productId, page) {
    setReviewsState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    dispatch(
      getProductReviews({
        productId: productId,
        pageNumber: page,
        pageSize: settings.reviewsPerRequest,
      }),
    )
      .unwrap()
      .then((rv) => {
        setReviewsState((prev) => ({
          ...prev,
          reviews: [...prev.reviews, ...rv],
          loading: false,
          error: null,
          hasMore: rv.length === settings.reviewsPerRequest,
        }));
      })
      .catch((err) => {
        setReviewsState((prev) => ({
          ...prev,
          loading: false,
          error: err,
          hasMore: false,
        }));
      });
  }
  function handleDeleteReview(reviewId) {
    setReviewsToDelete((prev) => [...prev, reviewId]);
    dispatch(deleteReview(reviewId))
      .unwrap()
      .then(() => {
        dispatch(
          showMessage({
            message: "the review has been deleted",
            severity: SEVERITY_SUCCESS,
          }),
        );
        setReviewsState((prev) => ({
          ...prev,
          reviews: reviewsState.reviews.filter((rv) => rv.id !== reviewId),
        }));
        setProductState((prev) => ({
          ...prev,
          product: {
            ...prev.product,
            totalReviews: prev.product.totalReviews - 1,
          },
        }));
      })
      .catch((err) => {
        dispatch(
          showMessage({
            message: err,
            severity: SEVERITY_ERROR,
          }),
        );
      })
      .finally(() => {
        setReviewsToDelete((prev) => prev.filter((id) => id !== reviewId));
      });
  }
  function handleAddToCart() {
    const product = productState.product;
    const cartItemProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      date: product.date,
      quantityInStock: product.quantity,
      discountValue: product.discount,
      imageUrl: GetMainImageURL(product.images),
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
        }),
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
            }),
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
            }),
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
      quantityInStock: product.quantity,
      discountValue: product.discount,
      imageUrl: GetMainImageURL(product.images),
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
        }),
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
            }),
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
            }),
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
  function handleAddToComparelist() {
    const p = productState.product;
    const itemProduct = {
      id: p.id,
      name: p.name,
      price: p.price,
      quantityInStock: p.quantity,
      discountValue: p.discount,
      rating: p.rating,
      imageUrl: GetMainImageURL(p.images),
    };
    if (user) {
      setAddToComparePending(true);
      dispatch(
        addNewComparelistItem({
          userId: user.id,
          productId: productState.product.id,
        }),
      )
        .unwrap()
        .then((addedItem) => {
          const localItem = {
            id: addedItem.id,
            userId: addedItem.userId,
            product: itemProduct,
          };
          dispatch(AddNewCompareListItemLocal(localItem));
          dispatch(
            showMessage({
              message: "The product has been added to your compare list.",
              severity: SEVERITY_SUCCESS,
            }),
          );
        })
        .catch((err) => {
          dispatch(
            showMessage({
              message: err,
              severity: SEVERITY_ERROR,
            }),
          );
        })
        .finally(() => setAddToComparePending(false));
    } else {
      const newItem = {
        id: crypto.randomUUID(),
        userId: null,
        product: itemProduct,
      };
      dispatch(AddNewCompareListItemLocal(newItem));
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
          imageUrl: GetMainImageURL(),
        },
        quantity,
      },
    });
  }
  function calculatePrice(price, discountValue = 0) {
    if (typeof price !== "number") return 0;
    const newPrice =
      discountValue === 0 ? price : price - (price * discountValue) / 100;
    return newPrice.toFixed(2);
  }
  function addReviewToLocalState(review) {
    setReviewsState((prev) => ({
      ...prev,
      reviews: [review, ...prev.reviews],
    }));
  }
  function handleViewMoreClick() {
    setPageNumber((prev) => prev + 1);
  }
  // ===============================

  return (
    <div className="product-details">
      <Container maxWidth="xl">
        <div className="product-page-header">
          <BackButton />

          <h1 className="page-title">Product Details</h1>
        </div>
        {productState.loading && (
          <div className="product-loading">
            <LoadingProgress />
          </div>
        )}
        {productState.error && <ErrorMessage message={productState.error} />}
        {productState.product && (
          <>
            {/* ================= MAIN PRODUCT ================= */}
            <div className="product-main">
              {/* ---------- IMAGE ---------- */}
              <div className="product-image-card">
                {/* Large image */}
                <div className="image-wrapper">
                  {productState.product.discount > 0 && (
                    <span className="discount-badge-image">
                      -{productState.product.discount}%
                    </span>
                  )}

                  <img
                    src={GetImage(selectedImage, 600)}
                    alt={productState.product.name}
                    className="product-image"
                  />
                </div>

                {/* Image thumbnails */}
                {productState.product.images?.length > 1 && (
                  <div className="image-thumbnails">
                    {productState.product.images.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`image-thumbnail ${
                          selectedImage === img.imageUrl ? "selected" : ""
                        }`}
                        onClick={() => setSelectedImage(img.imageUrl)}
                      >
                        <img
                          src={GetImage(img.imageUrl, 120)}
                          alt={`${productState.product.name} ${index + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ---------- PRODUCT INFO ---------- */}
              <div className="product-info-card">
                {/* Header */}
                <div className="product-header">
                  <span className="category">
                    {productState.product.category}
                  </span>

                  <h1 className="product-name">{productState.product.name}</h1>

                  <div className="rating">
                    <Rating
                      name="product-rating"
                      value={productState.product.rating || 0}
                      readOnly
                      precision={0.5}
                    />

                    <span className="rating-value">
                      {productState.product.rating > 0
                        ? productState.product.rating.toFixed(1)
                        : "No rating"}
                    </span>

                    <span className="review-count">
                      ({productState.product.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                <Divider />

                {/* Price */}
                <div className="price-section">
                  {productState.product.discount > 0 && (
                    <span className="old-price">
                      {productState.product.price} {settings.currrency}
                    </span>
                  )}

                  <span className="new-price">
                    {realPrice} {settings.currrency}
                  </span>

                  {productState.product.discount > 0 && (
                    <span className="discount-badge">
                      -{productState.product.discount}%
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div
                  className={`stock ${
                    productState.product.quantity > 0
                      ? "in-stock"
                      : "out-of-stock"
                  }`}
                >
                  <span className="stock-dot"></span>

                  {productState.product.quantity > 0
                    ? `In Stock — ${productState.product.quantity} available`
                    : "Out of Stock"}
                </div>

                {/* ================= DETAILS ================= */}
                {productState.product.details &&
                  productState.product.details.length > 0 && (
                    <div className="product-specifications">
                      <div className="specifications-list">
                        {productState.product.details.map((item, index) => (
                          <div className="specification-row" key={index}>
                            <span className="specification-name">
                              {item.name}
                            </span>

                            <span className="specification-value">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* ================= CTA ================= */}
                <div className="product-cta">
                  <div className="total-price">
                    <span>Total Price</span>

                    <strong>
                      {totalPrice !== null
                        ? `${totalPrice.toFixed(2)} ${settings.currrency}`
                        : "Calculating..."}
                    </strong>
                  </div>

                  <Grid className="btns" container gap={1} spacing={1}>
                    {/* Quantity */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 3,
                        md: 7,
                        lg: 3,
                      }}
                      order={{
                        xs: 1,
                        lg: 1,
                      }}
                    >
                      <div className="quantity">
                        <button
                          className="minus"
                          onClick={() => {
                            setQuantity((prevQuantity) => {
                              const newQuantity = prevQuantity - 1;

                              setTotalPrice(realPrice * newQuantity);

                              return newQuantity;
                            });
                          }}
                          disabled={quantity === 1}
                        >
                          −
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
                          disabled={quantity === productState.product.quantity}
                        >
                          +
                        </button>
                      </div>
                    </Grid>

                    {/* Add to cart */}
                    <Grid
                      size={{
                        xs: 9,
                        sm: 9,
                        md: 12,
                        lg: 9,
                      }}
                      order={{
                        xs: 2,
                        sm: 2,
                        md: 4,
                        lg: 2,
                      }}
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
                          productState.product.quantity === 0 || isProductInCart
                        }
                        style={
                          isProductInCart
                            ? {
                                backgroundColor: "#cccccc",
                              }
                            : null
                        }
                      >
                        {isProductInCart ? "Added to Cart" : "Add to Cart"}

                        <ShoppingCartIcon />
                      </Button>
                    </Grid>

                    {/* Compare */}
                    <Grid
                      size={{
                        xs: 3,
                        sm: 1.5,
                        md: 2.5,
                        lg: 1.5,
                      }}
                      order={3}
                    >
                      <Tooltip title="Compare">
                        <Button
                          variant="contained"
                          className="compare"
                          disabled={
                            productState.product.quantity === 0 ||
                            isProductIComparelist
                          }
                          onClick={handleAddToComparelist}
                        >
                          <AutorenewIcon />
                        </Button>
                      </Tooltip>
                    </Grid>

                    {/* Wishlist */}
                    <Grid
                      size={{
                        xs: 3,
                        sm: 1.5,
                        md: 2.5,
                        lg: 1.5,
                      }}
                      order={{
                        xs: 5,
                        sm: 2,
                        md: 2,
                        lg: 4,
                      }}
                    >
                      <Tooltip title="Add to wishlist">
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
                            productState.product.quantity === 0 ||
                            isProductInWishlist
                          }
                          style={
                            isProductInWishlist
                              ? {
                                  backgroundColor: "#cccccc",
                                }
                              : null
                          }
                        >
                          <FavoriteIcon />
                        </Button>
                      </Tooltip>
                    </Grid>

                    {/* Buy now */}
                    <Grid
                      size={{
                        xs: 9,
                        sm: 9,
                        md: 12,
                        lg: 9,
                      }}
                      order={{
                        xs: 4,
                        sm: 5,
                        md: 5,
                        lg: 5,
                      }}
                    >
                      <Button
                        variant="contained"
                        className="buy-now"
                        onClick={handleBuyNow}
                        disabled={productState.product.quantity === 0}
                      >
                        Buy Now
                        <LocalMallIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>

            {/* ================= DESCRIPTION ================= */}
            {productState.product.description && (
              <section className="product-section description">
                <h2 className="description-title">Description</h2>

                <p className="text">{productState.product.description}</p>
              </section>
            )}

            {/* ================= REVIEWS ================= */}
            {(user || reviewsState.reviews.length > 0) && (
              <section className="product-section reviews-section">
                <AddReview
                  productId={productState.product.id}
                  onAdd={addReviewToLocalState}
                />
                {reviewsState.reviews.length > 0 && (
                  <div className="reviews-list">
                    {reviewsState.reviews.map((review, index) => (
                      <div className="review-item" key={review.id || index}>
                        {/* Customer + actions */}
                        <div className="review-top">
                          <div className="review-customer">
                            <div className="customer-avatar">
                              <PersonOutlineOutlinedIcon />
                            </div>
                            <div className="customer-info">
                              <Typography className="customer-name">
                                {review.user.firstName +
                                  " " +
                                  review.user.lastName}
                              </Typography>

                              <Typography className="review-date">
                                {review.createdAt.split("T")[0]}
                              </Typography>
                            </div>
                          </div>

                          {user?.id === review.user.id &&
                            reviewsToDelete.every((id) => id !== review.id) && (
                              <IconButton
                                className="delete-review-button"
                                onClick={() => handleDeleteReview(review.id)}
                                aria-label="Delete review"
                              >
                                <DeleteOutlineOutlinedIcon />
                              </IconButton>
                            )}
                          {reviewsToDelete.some((id) => id === review.id) && (
                            <CircularProgress size={20} />
                          )}
                        </div>

                        {/* Rating */}
                        <div className="review-rating">
                          <Rating
                            value={review.rating}
                            precision={1}
                            size="small"
                            readOnly
                          />

                          <Typography className="rating-text">
                            {review.rating}/5
                          </Typography>
                        </div>

                        {/* Comment */}
                        <Typography className="review-comment">
                          {review.comment}
                        </Typography>
                      </div>
                    ))}
                  </div>
                )}
                {reviewsState.hasMore && (
                  <Button
                    className="btn-view-more"
                    onClick={handleViewMoreClick}
                    disabled={reviewsState.loading}
                  >
                    {reviewsState.loading ? (
                      <>
                        loading <CircularProgress size={15} color="white" />
                      </>
                    ) : (
                      <>
                        view more <KeyboardArrowDownIcon />
                      </>
                    )}
                  </Button>
                )}
              </section>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
