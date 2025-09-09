import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./DiscountedProductsQuickLinks.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { getTopReviews } from "../features/review/reviewSlice";
import { ReviewCard } from "./ReviewCard";

export function TopReviews() {
  const [reviewsState, setReviewsState] = useState({
    loading: false,
    reviews: null,
    error: null,
  });

  const [showArrows, setShowArrows] = useState(false);
  const [slides, setSlides] = useState({ slidesToShow: 5, slidesToScroll: 2 });

  const theme = useTheme();
  //   const isLgOrUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const dispatch = useDispatch();

  useEffect(() => {
    if (isXs) {
      setSlides({ slidesToScroll: 1, slidesToShow: 1 });
    } else if (isSm) {
      if (reviewsState.reviews && reviewsState.reviews.length > 0) {
        if (reviewsState.reviews.length > 2) {
          setSlides({ slidesToScroll: 2, slidesToShow: 2 });
        } else {
          setSlides({
            slidesToScroll: reviewsState.reviews.length,
            slidesToShow: reviewsState.reviews.length,
          });
        }
      }
    } else if (isMd) {
      if (reviewsState.reviews && reviewsState.reviews.length > 0) {
        if (reviewsState.reviews.length > 3) {
          setSlides({ slidesToScroll: 3, slidesToShow: 3 });
        } else {
          setSlides({
            slidesToScroll: reviewsState.reviews.length,
            slidesToShow: reviewsState.reviews.length,
          });
        }
      }
    } else {
      if (reviewsState.reviews && reviewsState.reviews.length > 0) {
        if (reviewsState.reviews.length > 5) {
          setSlides({ slidesToScroll: 2, slidesToShow: 5 });
        } else {
          setSlides({
            slidesToScroll: reviewsState.reviews.length,
            slidesToShow: reviewsState.reviews.length,
          });
        }
      }
    }
  }, [isMd, isSm, isXs]);

  useEffect(() => {
    setReviewsState({ loading: true, reviews: null, error: null });
    let cachedReviews = JSON.parse(sessionStorage.getItem("reviews"));
    if (cachedReviews && cachedReviews.length > 0) {
      setReviewsState({
        loading: false,
        reviews: cachedReviews,
        error: null,
      });
      setShowArrows(cachedReviews.length > 5);
      return;
    }
    dispatch(getTopReviews(10))
      .unwrap()
      .then((res) => {
        console.log("reviews: ", res);
        cachedReviews = res;
        sessionStorage.setItem("reviews", JSON.stringify(cachedReviews));
        setReviewsState({ loading: false, reviews: res, error: null });
        setShowArrows(cachedReviews.length > 5);
      })
      .catch((err) => {
        setReviewsState({ loading: false, reviews: null, error: err });
      });
  }, [dispatch]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: reviewsState.reviews
      ? Math.min(reviewsState.reviews.length, slides.slidesToShow)
      : slides.slidesToShow,
    slidesToScroll: slides.slidesToScroll,
    autoplay: true,
    arrows: showArrows,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  function NextArrow(props) {
    const { onClick } = props;

    return (
      <div className="arrow next" onClick={onClick}>
        <ArrowForwardIosIcon />
      </div>
    );
  }
  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <div className="arrow prev" onClick={onClick}>
        <ArrowBackIosIcon />
      </div>
    );
  }
  return (
    reviewsState.reviews &&
    reviewsState.reviews.length > 0 && (
      <div
        className="top-reviews"
        onMouseEnter={() =>
          setShowArrows(reviewsState.reviews && reviewsState.reviews.length > 5)
        }
        onMouseLeave={() => setShowArrows(false)}
      >
        <Slider {...settings}>
          {reviewsState.reviews.map((r) => (
            <div key={r.id} style={{ height: "100%" }}>
              <div style={{ margin: "0 5px", height: "100%" }}>
                <ReviewCard review={r} />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    )
  );
}
