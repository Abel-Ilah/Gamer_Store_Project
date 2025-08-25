import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./DiscountedProductsQuickLinks.css";
import { DiscountedProduct } from "./DiscountedProduct";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { get10DiscountedProducts } from "../features/products/productsSlice";
import { useDispatch } from "react-redux";
import { LoadingPage } from "./LoadingPage";

export function DiscountedProductsQuickLinks() {
  const [productsState, setProductsState] = useState({
    loading: false,
    products: null,
    error: null,
  });

  const [showArrows, setShowArrows] = useState(false);
  const [slides, setSlides] = useState({ slidesToShow: 2, slidesToScroll: 2 });

  const theme = useTheme();
  const isLgOrUp = useMediaQuery(theme.breakpoints.up("lg"));
  const dispatch = useDispatch();

  useEffect(() => {
    setSlides(
      isLgOrUp
        ? { slidesToScroll: 2, slidesToShow: 2 }
        : { slidesToScroll: 1, slidesToShow: 1 }
    );
  }, [isLgOrUp]);

  useEffect(() => {
    setProductsState({ loading: true, products: null, error: null });
    dispatch(get10DiscountedProducts())
      .unwrap()
      .then((res) =>
        setProductsState({ loading: false, products: res, error: null })
      )
      .catch((err) =>
        setProductsState({ loading: false, products: null, error: err })
      );
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: productsState.products
      ? Math.min(productsState.products.length, slides.slidesToShow)
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
  if (productsState.loading) return <LoadingPage />;
  return productsState.products && productsState.products.length > 0 ? (
    <div
      className="discounted-products"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <Slider {...settings}>
        {productsState.products.map((p) => (
          <div key={p.id}>
            <div style={{ margin: "0 5px" }}>
              <DiscountedProduct product={p} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  ) : null;
}
