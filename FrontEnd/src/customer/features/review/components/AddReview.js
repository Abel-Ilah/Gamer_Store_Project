import "./AddReview.css";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addReview } from "../../../../common/APIs/ReviewAPIs";
import {
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  showMessage,
} from "../../snackbar/SnackbarSlice";

export function AddReview({ productId, onAdd }) {
  const [inputs, setInputs] = useState({ rate: 0, comment: "" });

  const { customer: user } = useSelector((state) => state.customerAuth);

  const [loading, setLoading] = useState(false);
  const [ratingError, setRatingError] = useState(false);
  const dispatch = useDispatch();

  function handleAddReview() {
    if (inputs.rate === 0) {
      handleRateNotSelected();
      return;
    }
    setLoading(true);
    const review = {
      productId,
      userId: user.id,
      rating: inputs.rate,
      comment: inputs.comment,
    };

    dispatch(addReview(review))
      .unwrap()
      .then((res) => {
        const localReview = {
          ...res,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
          },
        };
        onAdd(localReview); // add review to local state
        setLoading(false);
        dispatch(
          showMessage({ message: "Review added.", severity: SEVERITY_SUCCESS }),
        );
        setInputs({ rate: 0, comment: "" });
      })
      .catch((err) => {
        dispatch(showMessage({ message: err, severity: SEVERITY_ERROR }));
        setLoading(false);
      });
  }
  function handleRateNotSelected() {
    setRatingError(true);
    setTimeout(() => {
      setRatingError(false);
    }, 1000);
  }
  console.log("rating error : ", ratingError);
  return user ? (
    <div className="new-review">
      <div className="user">
        <div className="avatar">
          <PersonOutlineOutlinedIcon />
        </div>
        <h6 className="name">{user.firstName + " " + user.lastName}</h6>
      </div>
      <div className="content">
        <Rating
          className={`rate ${ratingError ? "required" : ""}`}
          name="simple-controlled"
          value={inputs.rate}
          onChange={(event, newValue) => {
            setInputs({ ...inputs, rate: newValue });
          }}
        />
        <TextareaAutosize
          className="comment"
          maxRows={4}
          minRows={4}
          aria-label="maximum height"
          placeholder="put your comment here"
          value={inputs.comment}
          onChange={(e) => {
            setInputs({ ...inputs, comment: e.target.value });
          }}
        />
        <div className="btn-wraper">
          {loading && (
            <div className="loading">
              <div className="circle"></div>
            </div>
          )}
          <Button
            disabled={!inputs.comment || loading || ratingError}
            variant="contained"
            className="post-btn"
            style={{
              color: "white",
              backgroundColor: !inputs.comment ? "gray" : "teal",
            }}
            onClick={handleAddReview}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  ) : null;
}
