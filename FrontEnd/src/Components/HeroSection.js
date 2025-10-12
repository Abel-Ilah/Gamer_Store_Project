import "./HeroSection.css";
import Slider from "react-slick";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getHeroSectionProducts } from "../features/products/productsSlice";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import { setPosition } from "../features/header/HeaderPositionSlice";

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

export function HeroSection() {
  const [products, setProducts] = useState(null);
  const [showArrows, setShowArrows] = useState(false);

  const dispatch = useDispatch();
  const settings = {
    dots: false,
    infinite: showSliderArrows(),
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: !true,
    autoplaySpeed: 5000,
    speed: 1000,
    pauseOnHover: true,
    nextArrow: showArrows ? <NextArrow /> : <></>,
    prevArrow: showArrows ? <PrevArrow /> : <></>,
  };

  useEffect(() => {
    dispatch(getHeroSectionProducts())
      .unwrap()
      .then((products) => setProducts(products))
      .catch(() => {});
  }, [dispatch]);

  function getProductsImage(url, transform = "w_800,c_fill,q_auto,f_auto") {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : "assets/pc-gamer1.png";
  }

  function showSliderArrows() {
    if (!products) return false;

    const productsArray = Object.values(products);

    const productsCount = productsArray.reduce((count, item) => {
      return item !== null ? count + 1 : count;
    }, 0);

    return productsCount > 1;
  }
  function objectHasData() {
    if (!products) return false;

    const hasData =
      Object.values(products).reduce((count, item) => {
        return item !== null ? count + 1 : count;
      }, 0) > 0;

    dispatch(setPosition(hasData ? "absolute" : "relative"));

    return hasData;
  }
  return objectHasData() ? (
    <div
      className="hero-section"
      onMouseEnter={() => {
        setShowArrows(true);
      }}
      onMouseLeave={() => {
        setShowArrows(false);
      }}
    >
      <Container maxWidth="xl" style={{ position: "static" }}>
        <Slider {...settings} className="content">
          {products && products.bestSeller && (
            <card className="hs-product">
              <div className="image-wraper">
                <img
                  className="image"
                  src={getProductsImage(products.bestSeller.imageUrl)}
                  alt="best seller proudct"
                  title="best seller product"
                />
              </div>
              <div className="info">
                <p className="type">Best Seller</p>
                <h2 className="name">{products.bestSeller.name}</h2>
                <Link to={`/product/${products.bestSeller.id}`}>
                  <Button variant="outlined">Check Details</Button>
                </Link>
              </div>
            </card>
          )}

          {products && products.new && (
            <card className="hs-product">
              <div className="image-wraper">
                <img
                  className="image"
                  src={getProductsImage(products.new.imageUrl)}
                  alt="best seller proudct"
                  title="best seller product"
                />
              </div>
              <div className="info">
                <p className="type">New Arrival</p>
                <h2 className="name">{products.new.name}</h2>
                <Link to={`/product/${products.new.id}`}>
                  <Button variant="outlined">Check Details</Button>
                </Link>
              </div>
            </card>
          )}
          {products && products.discounted && (
            <card className="hs-product">
              <div className="image-wraper">
                <img
                  className="image"
                  src={getProductsImage(products.discounted.imageUrl)}
                  alt="top discounted product"
                  title="top discounted product"
                />
              </div>
              <div className="info">
                <p className="type">Best Deals</p>
                <h1 className="discount-title">
                  Get Up to <span>{products.discounted.discountValue}%</span>{" "}
                  OFF
                  <br /> Limited Time Only!
                </h1>
                <Link to={`/product/${products.discounted.id}`}>
                  <Button variant="outlined">Check Details</Button>
                </Link>
              </div>
            </card>
          )}
          {products && products.trending && (
            <card className="hs-product">
              <div className="image-wraper">
                <img
                  className="image"
                  src={getProductsImage(products.trending.imageUrl)}
                  alt="best seller proudct"
                  title="best seller product"
                />
              </div>
              <div className="info">
                <p className="type">Trending</p>
                <h2 className="name">{products.trending.name}</h2>
                <Link to={`/product/${products.trending.id}`}>
                  <Button variant="outlined">Check Details</Button>
                </Link>
              </div>
            </card>
          )}

          {products && products.topRated && (
            <card className="hs-product">
              <div className="image-wraper">
                <img
                  className="image"
                  src={getProductsImage(products.topRated.imageUrl)}
                  alt="best seller proudct"
                  title="best seller product"
                />
              </div>
              <div className="info">
                <p className="type">Top Rated</p>
                <h2 className="name">{products.topRated.name}</h2>
                <Rating
                  className="rating"
                  readOnly
                  value={products.topRated.rating}
                  precision={0.1}
                />
                <Link to={`/product/${products.topRated.id}`}>
                  <Button variant="outlined">Check Details</Button>
                </Link>
              </div>
            </card>
          )}
        </Slider>
      </Container>
    </div>
  ) : null;
}
