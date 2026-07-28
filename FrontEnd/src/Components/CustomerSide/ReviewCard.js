import "./ReviewCard.css";
import { useEffect, useRef, useState } from "react";
import Rating from "@mui/material/Rating";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import EastIcon from "@mui/icons-material/East";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export function ReviewCard({ review }) {
  const [open, setOpen] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const paragraphRef = useRef(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (paragraphRef.current) {
      const computedStyle = window.getComputedStyle(paragraphRef.current);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const height = paragraphRef.current.offsetHeight;
      const lines = Math.round(height / lineHeight);
      setShowSeeMore(lines >= 5);
    }
  }, [review.comment]);

  function addCloudinaryTransform(
    url,
    transform = "w_50,c_fill,q_auto,f_auto",
  ) {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : "assets/pc-gamer1.png";
  }

  return (
    <div className="review-card">
      <div className="avatar">
        <img src="assets/account-logo.png" alt="account logo" />
      </div>
      <div className="info">
        <h5 className="firstName">{review.userName}</h5>
      </div>

      <div className="content">
        <div className="rate-wraper">
          <Rating
            className="rate"
            name="simple-controlled"
            value={review.rating}
            readOnly
          />
          <span className="rate-value">{review.rating}/5</span>
        </div>
        <p ref={paragraphRef} className="comment">
          {review.comment}
        </p>

        {/*=== see more  ===*/}
        <div style={{ display: showSeeMore ? "block" : "none" }}>
          <Button className="see-more" variant="text" onClick={handleClickOpen}>
            read more <KeyboardArrowRightIcon />
          </Button>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullWidth
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              <AccountCircleIcon
                style={{ color: "gray", fontSize: "2.2rem" }}
              />{" "}
              {review.userName}
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers>
              <p id="full-comment">{review.comment}</p>
            </DialogContent>
          </BootstrapDialog>
        </div>
        {/* =============== */}
        <span className="date">{review.createdAt.split("T")[0]}</span>
      </div>
      <div className="linked-product">
        <img
          className="image"
          src={addCloudinaryTransform(review.product.imageUrl)}
          alt="product img"
        />
        <Link to={`/product/${review.product.id}`}>
          <h6 className="name">{review.product.name}</h6>
        </Link>
      </div>
    </div>
  );
}
