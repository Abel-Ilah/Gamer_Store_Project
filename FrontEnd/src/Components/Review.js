import "./Review.css";
import Rating from "@mui/material/Rating";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandableText from "./ExpandableText ";
export function Review({ review }) {
  return (
    <div className="review">
      <div className="user">
        <AccountCircleIcon className="avatar" />
        <div className="r-box">
          <h6 className="name">{review.user.firstName}</h6>
          <Rating
            className="rate"
            name="half-rating-read"
            value={review.rating > 0 ? review.rating : 5}
            readOnly
          />
        </div>
      </div>
      <div className="content">
        <ExpandableText>{review.comment}</ExpandableText>
      </div>

      <div className="review-date">{review.createdAt.split("T")[0]}</div>
    </div>
  );
}
