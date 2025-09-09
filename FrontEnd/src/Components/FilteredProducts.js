import "./FilteredProducts.css";
import { ProductsGrid } from "./ProductsGrid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DiscountIcon from "@mui/icons-material/Discount";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VerifiedIcon from "@mui/icons-material/Verified";
import { ProductsFilter } from "./ProductsFilter";
import { LoadingPage } from "./LoadingPage";
import { useParams } from "react-router-dom";
import appsettings from "../appsettings.json";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import settings from "../appsettings.json";

import {
  GET_ALL_PRODUCTS,
  GET_BEST_SELLERS,
  GET_DISCOUNTED_PRODUCTS,
  GET_NEW_PRODUCTS,
  getFilteredProducts,
} from "../features/products/productsSlice";
import { useEffect } from "react";

let pageSize = appsettings.productsPageSize;

function FastFilter({ handlBtnClick }) {
  return (
    <div className="fast-filter">
      <Link to={"/products/new-products"}>
        <Button
          variant="outlined"
          onClick={() =>
            handlBtnClick({
              name: GET_NEW_PRODUCTS,
              value: GET_NEW_PRODUCTS,
            })
          }
        >
          <VerifiedIcon style={{ color: "green" }} />
          New Products
        </Button>
      </Link>
      <Link to={"/products/discounted-products"}>
        <Button
          variant="outlined"
          onClick={() =>
            handlBtnClick({
              name: GET_DISCOUNTED_PRODUCTS,
              value: GET_DISCOUNTED_PRODUCTS,
            })
          }
        >
          <DiscountIcon style={{ color: "red" }} />
          Discounts
        </Button>
      </Link>
      <Link to={"/products/best-sellers"}>
        <Button
          variant="outlined"
          onClick={() =>
            handlBtnClick({
              name: GET_BEST_SELLERS,
              value: GET_BEST_SELLERS,
            })
          }
        >
          <ShoppingCartIcon style={{ color: "teal" }} />
          Best Sellers
        </Button>
      </Link>
      <Button variant="outlined">
        <StarIcon style={{ color: "orange" }} />
        Top Rated
      </Button>
    </div>
  );
}

export function FilteredProducts() {
  const { categoryName: selectedCategory } = useParams();
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector((state) => state.products);

  function handleFastFilterBtnsClick(tag) {
    const filter = {
      tag,
      price: {
        min: 1,
        max: 10000000,
      },
      page: {
        number: 1,
        size: settings.productsPageSize,
      },
    };
    dispatch(getFilteredProducts(filter));
  }

  useEffect(() => {
    let filter = JSON.parse(sessionStorage.getItem("filter"));
    if (!filter) {
      filter = {
        tag: {
          name: GET_ALL_PRODUCTS,
          value: GET_ALL_PRODUCTS,
        },
        price: {
          min: 1,
          max: 100000,
        },
        page: {
          number: 1,
          size: settings.productsPageSize,
        },
      };
    }
    dispatch(getFilteredProducts(filter));
  }, []);

  return (
    <Container maxWidth="xl">
      <div className="products-category">
        <ProductsFilter activeCategory={selectedCategory} />
        <div style={{ flexGrow: 1 }}>
          <FastFilter handlBtnClick={handleFastFilterBtnsClick} />
          {loading && <LoadingPage />}
          {data && data.products && data.products.length > 0 && (
            <div>
              <ProductsGrid products={data.products} />
              <div className="next-prev-page-wraper">
                <Button
                  style={{
                    margin: "15px 0",
                  }}
                  variant="contained"
                >
                  {" "}
                  <ArrowBackIosIcon className="arrow" /> Prev
                </Button>
                <span id="page-number"></span>
                <Button
                  style={{
                    margin: "15px 0",
                    pointerEvents:
                      pageSize > data.products.length ? "none" : "auto",
                    opacity: pageSize > data.products.length ? 0.5 : 1,
                  }}
                  variant="contained"
                >
                  {" "}
                  Next <ArrowForwardIosIcon className="arrow" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
