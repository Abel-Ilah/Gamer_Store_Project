import "./FeaturedCategories.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Category } from "./Category";
import { ProductsListHeader } from "./customItems/ProductsListHeader";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getFeaturedCategories } from "../../features/category/CategorySlice";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useMediaQuery, useTheme } from "@mui/material";
import { GET_ALL_PRODUCTS } from "../../features/products/productsSlice";
import { setFilterTag } from "../../features/productsFilter/filterSlice";
import { setTitle } from "../../features/productsPageTItle/ProductsPageTitleSlice";

export function FeaturedCategories() {
  const [featuredCategories, setFeaturedCategories] = useState([]);

  const [showArrows, setShowArrows] = useState(true);
  const [slidesToShow, setSlidesToShow] = useState(1);

  const dispatch = useDispatch();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  const large = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    dispatch(getFeaturedCategories())
      .unwrap()
      .then((res) => setFeaturedCategories(res))
      .catch();
  }, []);

  useEffect(() => {
    if (xs) {
      setSlidesToShow(1);
    } else if (sm) {
      setSlidesToShow(Math.min(featuredCategories.length, 2));
    } else if (large) {
      setSlidesToShow(Math.min(featuredCategories.length, 4));
    }
  }, [xs, sm, large, featuredCategories.length]);

  const settings = {
    dots: false,
    infinite: featuredCategories.length > slidesToShow,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: showArrows,
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
  function handleSeeAllClick() {
    const tag = { name: GET_ALL_PRODUCTS, value: GET_ALL_PRODUCTS };
    dispatch(setFilterTag(tag));
    dispatch(setTitle("All Categories"));
  }
  return featuredCategories && featuredCategories.length > 0 ? (
    <div
      className="featured-categories"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <ProductsListHeader
        title="Featured Categories"
        seeAllLink="/products"
        onSeeAllClick={handleSeeAllClick}
      />
      <div className="content slider">
        <Slider {...settings}>
          {featuredCategories.map((c) => (
            <div key={c.id}>
              <div>
                <Category category={c} />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  ) : null;
}
