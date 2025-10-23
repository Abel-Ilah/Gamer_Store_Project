import "./FilteredProducts.css";
import "./Shared.css";
import { ProductsGrid } from "./ProductsGrid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import DiscountIcon from "@mui/icons-material/Discount";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VerifiedIcon from "@mui/icons-material/Verified";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Pagination from "@mui/material/Pagination";
import { ProductsFilter } from "./ProductsFilter";
import { ProductsSkeleton } from "./ProductsSkeleton";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import settings from "../../appsettings.json";
import { setTitle } from "../../features/productsPageTItle/ProductsPageTitleSlice";
import {
  GET_ALL_PRODUCTS,
  GET_BEST_SELLERS,
  GET_DISCOUNTED_PRODUCTS,
  GET_NEW_PRODUCTS,
  GET_TOP_RATED_PRODUCTS,
  getFilteredProducts,
} from "../../features/products/productsSlice";
import { useEffect, useState } from "react";
import { PaginationItem, useTheme, useMediaQuery } from "@mui/material";

let pageSize = settings.productsPageSize;
export function FilteredProducts() {
  const { categoryName: selectedCategory } = useParams();
  const [showProductsRating, setShowProductsRating] = useState(false);
  const [CurrentPage, setCurrentPage] = useState(() => {
    const storedFilter = JSON.parse(sessionStorage.getItem("filter"));
    if (storedFilter) {
      return storedFilter.page.number || 1;
    }
    return 1;
  });

  const [totalPages, setTotalPages] = useState(1);
  const { title } = useSelector((state) => state.title);
  const { data, loading, error } = useSelector((state) => state.products);

  const locaiton = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  function handleFastFilterBtnsClick(tag, event) {
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
    dispatch(getFilteredProducts(filter))
      .unwrap()
      .then()
      .catch((err) => {});
    if (event) {
      dispatch(
        setTitle(event.currentTarget.getAttribute("data") || "Products")
      );
    }
  }

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
    const filter = JSON.parse(sessionStorage.getItem("filter"));
    if (filter) {
      filter.page.number = value;
      dispatch(getFilteredProducts(filter));
    }
  };

  useEffect(
    (_) => {
      if (data && data.totalProducts > 0) {
        setTotalPages(Math.ceil(data.totalProducts / pageSize));
      }
    },
    [data]
  );

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

  useEffect(() => {
    setShowProductsRating(locaiton.pathname.includes("top-rated"));
    setCurrentPage(1);
  }, [locaiton.pathname]);

  return (
    <Container maxWidth="xl">
      <div className="products-category shared">
        <div className="head">
          <StorefrontIcon className="icon" />
          <h2 className="s-title">{title}</h2>
        </div>
        <div className="content">
          <ProductsFilter activeCategory={selectedCategory} />
          <div style={{ flexGrow: 1 }}>
            <div className="fast-filter">
              <Link to={"/products/new-products"}>
                <Button
                  variant="outlined"
                  data="New Products"
                  onClick={(e) =>
                    handleFastFilterBtnsClick(
                      {
                        name: GET_NEW_PRODUCTS,
                        value: GET_NEW_PRODUCTS,
                      },
                      e
                    )
                  }
                >
                  <VerifiedIcon style={{ color: "green" }} />
                  New Products
                </Button>
              </Link>
              <Link to={"/products/discounted-products"}>
                <Button
                  data="Discounted Products"
                  variant="outlined"
                  onClick={(e) =>
                    handleFastFilterBtnsClick(
                      {
                        name: GET_DISCOUNTED_PRODUCTS,
                        value: GET_DISCOUNTED_PRODUCTS,
                      },
                      e
                    )
                  }
                >
                  <DiscountIcon style={{ color: "red" }} />
                  Discounts
                </Button>
              </Link>
              <Link to={"/products/best-sellers"}>
                <Button
                  data="Best Sellers"
                  variant="outlined"
                  onClick={(e) =>
                    handleFastFilterBtnsClick(
                      {
                        name: GET_BEST_SELLERS,
                        value: GET_BEST_SELLERS,
                      },
                      e
                    )
                  }
                >
                  <ShoppingCartIcon style={{ color: "teal" }} />
                  Best Sellers
                </Button>
              </Link>
              <Link to={"/products/top-rated"}>
                <Button
                  data="Top Rated"
                  variant="outlined"
                  onClick={(e) => {
                    handleFastFilterBtnsClick(
                      {
                        name: GET_TOP_RATED_PRODUCTS,
                        value: GET_TOP_RATED_PRODUCTS,
                      },
                      e
                    );
                    setShowProductsRating(true);
                  }}
                >
                  <StarIcon style={{ color: "orange" }} />
                  Top Rated
                </Button>
              </Link>
            </div>

            {loading && (
              <>
                <ProductsSkeleton />
                <ProductsSkeleton />
              </>
            )}
            {data && data.products.length > 0 && (
              <div className="wraper">
                <div className="products">
                  <ProductsGrid
                    products={data.products}
                    showRating={showProductsRating}
                  />
                </div>
                {totalPages > 1 && (
                  <Pagination
                    className="pagination"
                    count={totalPages}
                    page={CurrentPage}
                    onChange={handlePageChange}
                    siblingCount={isMobile ? 1 : 2}
                    boundaryCount={1}
                    hideNextButton={isMobile}
                    hidePrevButton={isMobile}
                    renderItem={(item) => (
                      <PaginationItem
                        component={Link}
                        {...item}
                        sx={{
                          color: "white",
                          backgroundColor: "var(--main-color)",
                          "&.Mui-selected": {
                            backgroundColor: "red",
                          },
                        }}
                        disabled={
                          item.page === CurrentPage ||
                          (item.type === "previous" && CurrentPage === 1) ||
                          (item.type === "next" && CurrentPage === totalPages)
                        }
                      />
                    )}
                    variant="outlined"
                    shape="rounded"
                  />
                )}
              </div>
            )}
            {data && data.products.length === 0 && (
              <div className="empty">
                <StorefrontOutlinedIcon className="icon" />
                <h4 className="msg">no products found</h4>
              </div>
            )}
            {error && (
              <div className="error">
                <div className="icon"></div>
                <h3 className="error-title">Error</h3>
                <h4 className="text">{error}</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
