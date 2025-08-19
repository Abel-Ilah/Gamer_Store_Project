import "./PromoSection.css";
import Slider from "react-slick";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// Custom Arrow Components
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

export function PromoSection() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div
      className="promo-section-container"
      style={{ width: "100%", marginBottom: "30px" }}
    >
      <Slider {...settings}>
        <div>
          <img
            style={{ height: "531.5px", width: "100%" }}
            src="assets/promoSectionBackground.jpg"
            alt="img"
          />
        </div>
        <div>
          <img
            style={{ height: "531.5px", width: "100%" }}
            src="assets/promoSectionBackground.jpg"
            alt="img"
          />
        </div>
        <div>
          <img
            style={{ height: "531.5px", width: "100%" }}
            src="assets/promoSectionBackground.jpg"
            alt="img"
          />
        </div>
      </Slider>
    </div>
  );
}
