import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./RelatedProducts.css";

import { Product } from "./Product";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useState } from "react";

export function RelatedProducts({ products, slidesToShow = 6 }) {
  const [showArrows, setShowArrows] = useState(false);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(products.length, slidesToShow),
    slidesToScroll: 1,
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
  if (!products || products.length === 0) return null;
  return (
    <div
      className="related-products"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <Slider {...settings}>
        {products.map((p) => (
          <div key={p.id}>
            <div style={{ margin: "0 5px" }}>
              <Product Product={p} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
