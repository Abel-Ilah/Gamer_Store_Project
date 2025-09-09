import "./ReviewCard.css";
import React from "react";
import Rating from "@mui/material/Rating";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

export function ReviewCard({ review }) {
  function addCloudinaryTransform(
    url,
    transform = "w_50,c_fill,q_auto,f_auto"
  ) {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : "assets/pc-gamer1.png";
  }

  return (
    <div className="review-card">
      <div className="info">
        <AccountCircleIcon className="avatar" />
        <h5 className="firstName">{review.userName}</h5>
      </div>

      <div className="content">
        <Rating
          className="rate"
          name="simple-controlled"
          value={review.rating}
          readOnly
        />
        <p className="comment">{review.comment}</p>
      </div>
      <span className="date">{review.createdAt.split("T")[0]}</span>
      <div className="linked-product">
        <img
          className="image"
          src={addCloudinaryTransform(review.product.imageUrl)}
          alt="product img"
        />
        <Link>
          <h6 className="name">{review.product.name}</h6>
        </Link>
      </div>
    </div>
  );
}
