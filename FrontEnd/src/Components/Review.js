import "./Review.css";
import Rating from "@mui/material/Rating";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandableText from "./ExpandableText ";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  deleteReview,
  editReview,
  removeReviewFromLocalState,
  updateReviewInLocalState,
} from "../features/review/reviewSlice";
import {
  SEVERITY_ERROR,
  showMessage,
} from "../features/snackbar/SnackbarSlice";
import IconButton from "@mui/material/IconButton";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { redirect } from "react-router-dom";

export function Review({ review }) {
  const dispatch = useDispatch();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteReviewLoading, setDeleteReviewLoading] = useState(false);
  const [inputs, setInputs] = useState(
    review
      ? { rating: review.rating, comment: review.comment }
      : { rating: 0, comment: "" }
  );
  const { user } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateReview = () => {
    setUpdateLoading(true);
    const updatedReview = {
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      comment: inputs.comment,
      rating:
        inputs.rating > 0 && inputs.rating <= 5 ? inputs.rating : review.rating,
      createdAt: review.createdAt,
    };
    dispatch(editReview(updatedReview))
      .unwrap()
      .then(() => {
        const localUpdatedReview = { ...updatedReview, user: review.user };
        dispatch(updateReviewInLocalState(localUpdatedReview));
        setUpdateLoading(false);
      })
      .catch((err) => {
        dispatch(showMessage({ message: err, severity: SEVERITY_ERROR }));
        setUpdateLoading(false);
      });
    handleClose();
  };

  function handleDeleteReview() {
    setDeleteReviewLoading(true);
    dispatch(deleteReview(review.id))
      .unwrap()
      .then(() => {
        dispatch(removeReviewFromLocalState(review.id));
        setDeleteReviewLoading(false);
      })
      .catch((err) => {
        dispatch(showMessage({ message: err, severity: SEVERITY_ERROR }));
        setDeleteReviewLoading(false);
      });
  }

  return (
    <div className="review">
      <Dialog
        className="update-review-form"
        open={open}
        onClose={handleClose}
        maxWidth={false}
        fullWidth
      >
        <DialogTitle>Update your review</DialogTitle>
        <DialogContent>
          <form>
            <Rating
              className="rate"
              style={{ fontSize: "2rem" }}
              name="simple-controlled"
              value={inputs.rating}
              onChange={(event, newValue) => {
                setInputs({ ...inputs, rating: newValue });
              }}
            />
            <TextareaAutosize
              autoFocus
              className="text-area"
              maxRows={4}
              minRows={4}
              aria-label="maximum height"
              placeholder="put your comment here"
              value={inputs.comment}
              onChange={(e) => {
                setInputs({ ...inputs, comment: e.target.value });
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ fontWeight: "bold", color: "red" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            disabled={
              !inputs.comment.trim() ||
              updateLoading ||
              deleteReviewLoading ||
              (inputs.comment.trim() === review.comment.trim() &&
                inputs.rating === review.rating)
            }
            style={{ fontWeight: "bold" }}
            onClick={handleUpdateReview}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
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
        {user && user.id === review.userId && (
          <div className="btns-wraper">
            {(updateLoading || deleteReviewLoading) && (
              <div className="loading">
                <div className="circle"></div>
              </div>
            )}
            <IconButton
              className="edit"
              style={{
                display:
                  updateLoading || deleteReviewLoading ? "none" : "inline-flex",
              }}
              onClick={handleClickOpen}
            >
              <EditIcon className="icon" />
            </IconButton>

            <IconButton
              className="delete"
              style={{
                display:
                  updateLoading || deleteReviewLoading ? "none" : "inline-flex",
              }}
              onClick={handleDeleteReview}
            >
              <DeleteIcon className="icon" />
            </IconButton>
          </div>
        )}
      </div>
      <div className="content">
        <ExpandableText>{review.comment}</ExpandableText>
      </div>

      <div className="review-date">{review.createdAt.split("T")[0]}</div>
    </div>
  );
}
