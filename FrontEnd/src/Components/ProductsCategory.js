import "./ProductsCategory.css";
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
import {
  useProducts,
  GET_NEW_PRODUCTS,
  GET_DISCOUNTED_PRODUCTS,
  GET_BEST_SELLERS,
} from "../reducers/ProductsReducer";
import { useParams } from "react-router-dom";
import appsettings from "../appsettings.json";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getFilter,
  updatePageNumber,
  updateFilter,
} from "../features/filter/filterSlice";

let pageSize = appsettings.productsPageSize;

function FastFilter({ handlBtnClick }) {
  return (
    <div className="fast-filter">
      <Link to={"/products/new-products"}>
        <Button
          variant="outlined"
          onClick={() =>
            handlBtnClick({
              actionType: GET_NEW_PRODUCTS,
              actionValue: GET_NEW_PRODUCTS,
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
              actionType: GET_DISCOUNTED_PRODUCTS,
              actionValue: GET_DISCOUNTED_PRODUCTS,
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
              actionType: GET_BEST_SELLERS,
              actionValue: GET_BEST_SELLERS,
            })
          }
        >
          <ShoppingCartIcon style={{ color: "teal" }} />
          Best Sellers
        </Button>
      </Link>
      {/* <Button variant="outlined">
        <ShoppingCartIcon style={{ color: "teal" }} />
        Popular Products
      </Button> */}
      <Button variant="outlined">
        <StarIcon style={{ color: "orange" }} />
        Top Rated
      </Button>
    </div>
  );
}

export function ProductsCategory() {
  const { data: products, loading, error } = useProducts();
  const { categoryName: selectedCategory } = useParams();

  const filter = useSelector(getFilter);
  const dispatch = useDispatch();

  function handlBtnClick(action) {
    dispatch(
      updateFilter({
        ...filter,
        action: {
          actionType: action.actionType,
          actionValue: action.actionValue,
        },
      })
    );
  }

  function resetScroll() {
    window.scrollTo(0, 0);
  }
  return (
    <Container maxWidth="xl">
      <div className="products-category">
        <ProductsFilter activeCategory={selectedCategory} />
        <div style={{ flexGrow: 1 }}>
          <FastFilter handlBtnClick={handlBtnClick} />
          {loading ? (
            <h3>loading...</h3>
          ) : error ? (
            <h3>{error}</h3>
          ) : (
            <div>
              <ProductsGrid products={products} />
              <div className="next-prev-page-wraper">
                <Button
                  style={{
                    margin: "15px 0",
                    pointerEvents:
                      filter.page.pageNumber === 1 ? "none" : "auto",
                    opacity: filter.page.pageNumber === 1 ? 0.5 : 1,
                  }}
                  variant="contained"
                  onClick={() => {
                    dispatch(updatePageNumber(filter.page.pageNumber - 1));
                    resetScroll();
                  }}
                >
                  {" "}
                  <ArrowBackIosIcon className="arrow" /> Prev
                </Button>
                <span id="page-number">{filter.page.pageNumber}</span>
                <Button
                  style={{
                    margin: "15px 0",
                    pointerEvents: pageSize > products.length ? "none" : "auto",
                    opacity: pageSize > products.length ? 0.5 : 1,
                  }}
                  variant="contained"
                  onClick={() => {
                    dispatch(updatePageNumber(filter.page.pageNumber + 1));
                    resetScroll();
                  }}
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
