import React, { useEffect, useMemo, useState } from "react";
import "./ProductDetails.css";

import {
  Typography,
  Button,
  Rating,
  IconButton,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import appsettings from "../../../../appsettings.json";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProductDetails } from "../APIs/ProductAPIs";
import ErrorMessage from "../../../../common/components/ErrorMessage";
import LoadingProgress from "../../../../common/components/LoadingProgress";
import { GetImage } from "../../../../common/js/helpers";
import BackButton from "../../../../common/components/BackButton";
import {
  deleteReview,
  getProductReviews,
} from "../../../../common/APIs/ReviewAPIs";
import {
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  showMessage,
} from "../../../../customer/features/snackbar/SnackbarSlice";

const ProductDetails = () => {
  const [productState, setProductState] = useState({
    loading: false,
    product: null,
    error: null,
  });

  const [reviewsState, setReviewsState] = useState({
    reviews: [],
    loading: false,
    error: null,
    hasMore: false,
  });

  const [reviewsToDelete, setReviewsToDelete] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);

  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setProductState({ loading: true, error: null, product: null });

    if (productId) {
      dispatch(getProductDetails(productId))
        .unwrap()
        .then((product) => {
          setProductState({ loading: false, error: null, product: product });
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

  const action = useMemo(() => {
    if (productState.product == null) return null;
    return productState.product.isDeleted ? "restore" : "delete";
  }, [productState.product]);

  function handleViewMoreClick() {
    setPageNumber((prev) => prev + 1);
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
        pageSize: appsettings.reviewsPerRequest,
      }),
    )
      .unwrap()
      .then((rv) => {
        setReviewsState((prev) => ({
          ...prev,
          reviews: [...prev.reviews, ...rv],
          loading: false,
          error: null,
          hasMore: rv.length === appsettings.reviewsPerRequest,
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
  return (
    <div className="product-details-page">
      {productState.loading && <LoadingProgress />}
      {productState.error && <ErrorMessage message={productState.error} />}
      {productState.product && (
        <div>
          {/* ================= HEADER ================= */}
          <div className="product-details-header">
            <div className="product-details-header-left">
              <BackButton />
              <div>
                <Typography className="product-details-title">
                  Product Details
                </Typography>
                <Typography className="product-details-subtitle">
                  View product information and statistics
                </Typography>
              </div>
            </div>
            <div className="product-details-actions">
              <Button
                className="product-edit-button"
                variant="contained"
                startIcon={<EditOutlinedIcon />}
                onClick={() => navigate(`/admin/products/update/${productId}`)}
              >
                Edit Product
              </Button>
              <Button
                className="product-delete-button"
                variant="outlined"
                startIcon={<DeleteOutlineOutlinedIcon />}
                // onClick={onDelete}
              >
                Delete
              </Button>
            </div>
          </div>
          {/* ================= MAIN PRODUCT ================= */}
          <div className="product-main-card">
            {/* IMAGE */}
            <div className="product-image-container">
              <img
                src={GetImage(productState.product.imageUrl, 600)}
                alt={productState.product.name}
                className="product-details-image"
              />
            </div>
            {/* BASIC INFORMATION */}
            <div className="product-basic-info">
              <Typography className="product-name">
                {productState.product.name}
              </Typography>
              <Typography className="product-category">
                {productState.product.category}
              </Typography>
              <div className="product-price-row">
                <Typography className="product-price">
                  {productState.product.price} {appsettings.currrency}
                </Typography>
                {productState.product.discount > 0 && (
                  <div className="label discount-label">
                    {productState.product.discount}% OFF
                  </div>
                )}
              </div>
              <div className="product-stock-row">
                <Inventory2OutlinedIcon />
                <Typography>
                  {productState.product.quantity} units in stock
                </Typography>
                <div
                  className={
                    productState.product.quantity > 0
                      ? "label stock-label in-stock"
                      : "label stock-label out-stock"
                  }
                >
                  {productState.product.quantity > 0
                    ? "In Stock"
                    : "Out of Stock"}
                </div>
              </div>
            </div>
          </div>
          {/* ================= PRODUCT DETAILS ================= */}
          {productState.product.details &&
            productState.product.details.length > 0 && (
              <section className="product-section">
                <div className="section-heading">
                  <Typography className="section-title">
                    Product Details
                  </Typography>
                </div>
                <div className="details-grid">
                  {productState.product.details.map((detail, index) => (
                    <div className="detail-item" key={index}>
                      <Typography className="detail-name">
                        {detail.name}
                      </Typography>
                      <Typography className="detail-value">
                        {detail.value}
                      </Typography>
                    </div>
                  ))}
                </div>
              </section>
            )}
          {/* ================= SALES STATISTICS ================= */}
          <section className="product-section">
            <div className="section-heading">
              <div>
                <Typography className="section-title">
                  Sales Statistics
                </Typography>
                <Typography className="section-subtitle">
                  Overview of product performance
                </Typography>
              </div>
            </div>
            <div className="statistics-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <ShoppingCartOutlinedIcon />
                </div>
                <div>
                  <Typography className="stat-label">Units Sold</Typography>
                  <Typography className="stat-value">
                    {productState.product.sales}
                  </Typography>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <AttachMoneyOutlinedIcon />
                </div>
                <div>
                  <Typography className="stat-label"> Revenue </Typography>
                  <Typography className="stat-value">
                    {productState.product.revenue} {appsettings.currrency}
                  </Typography>
                </div>
              </div>
            </div>
          </section>
          {/* ================= DESCRIPTION ================= */}
          {productState.product.description && (
            <section className="product-section">
              <div className="section-heading">
                <Typography className="section-title">Description</Typography>
              </div>
              <Typography className="product-description">
                {productState.product.description ||
                  "No description available."}
              </Typography>
            </section>
          )}
          {/* ================= REVIEWS ================= */}
          <section className="product-section reviews">
            <div className="section-heading">
              <div>
                <Typography className="section-title">Reviews</Typography>
                <Typography className="section-subtitle">
                  Customer feedback about this product
                </Typography>
              </div>
            </div>
            {/* REVIEW SUMMARY */}
            <div className="review-summary">
              <div className="rating-number">
                {productState.product.rating?.toFixed(1) || "0.0"}
              </div>
              <div className="rating-summary-content">
                <Rating
                  value={productState.product.rating || 0}
                  precision={0.1}
                  readOnly
                />
                <Typography className="review-count">
                  {productState.product.totalReviews} review
                  {productState.product.totalReviews > 1 && "s"}
                </Typography>
              </div>
            </div>
            {/* COMMENTS */}
            {reviewsState.reviews.length > 0 && (
              <div>
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

                        {reviewsToDelete.every((id) => id !== review.id) && (
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
              </div>
            )}
            {reviewsState.error && (
              <ErrorMessage message={reviewsState.error} />
            )}
          </section>
        </div>
      )}
    </div>
  );
};
export default ProductDetails;
