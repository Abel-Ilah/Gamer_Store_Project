import "./AddReview.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addReview,
  addReviewToLocalState,
} from "../../review/slices/reviewSlice";
import { SEVERITY_ERROR, showMessage } from "../../snackbar/SnackbarSlice";

export function AddReview({ productId }) {
  const [inputs, setInputs] = useState({ rate: 0, comment: "" });
  const { customer: user } = useSelector((state) => state.customerAuth);

  const [reviewState, setReviewState] = useState({
    loading: false,
  });

  const dispatch = useDispatch();

  function handlePost() {
    setReviewState({ loading: true });
    const review = {
      productId,
      userId: user.id,
      rating: inputs.rate >= 1 ? inputs.rate : 5,
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
        dispatch(addReviewToLocalState(localReview));
        setReviewState({ loading: false });
      })
      .catch((err) => {
        dispatch(showMessage({ message: err, severity: SEVERITY_ERROR }));
        setReviewState({ loading: false });
      });
  }

  return user ? (
    <div className="new-review">
      <div className="user">
        <AccountCircleIcon className="avatar" />
        <h5 className="name">{user.firstName}</h5>
      </div>
      <div className="content">
        <Rating
          className="rate"
          style={{ fontSize: "2rem" }}
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
          {reviewState.loading && (
            <div className="loading">
              <div className="circle"></div>
            </div>
          )}
          <Button
            disabled={!inputs.comment || reviewState.loading}
            variant="contained"
            className="post-btn"
            style={{
              color: "white",
              backgroundColor: !inputs.comment ? "gray" : "teal",
            }}
            onClick={handlePost}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  ) : null;
}
