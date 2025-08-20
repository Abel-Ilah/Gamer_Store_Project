import "./Review.css";
import Rating from "@mui/material/Rating";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandableText from "./ExpandableText ";
export function Review({ comment = "hello this is a comment" }) {
  return (
    <div className="review">
      <div className="user">
        <AccountCircleIcon className="avatar" />
        <div className="r-box">
          <h6 className="name">Abdel-ilah</h6>
          <Rating
            className="rate"
            name="half-rating-read"
            defaultValue={4}
            readOnly
          />
        </div>
      </div>
      <div className="content">
        <ExpandableText>
          <p className="comment">{comment}</p>
        </ExpandableText>
      </div>

      <div className="review-date">July 12, 2021</div>
    </div>
  );
}
