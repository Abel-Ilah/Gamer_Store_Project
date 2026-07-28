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
import { Link, useNavigate } from "react-router-dom";
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
import {
  setPageNumber,
  setFilterTag,
} from "../../features/productsFilter/filterSlice";
import { useEffect, useMemo, useState } from "react";
import { PaginationItem, useTheme, useMediaQuery } from "@mui/material";
let pageSize = settings.productsPageSize;

export function FilteredProducts() {
  const filter = useSelector((state) => state.filter);

  const CurrentPage = useMemo(() => {
    if (filter) return filter.page.number || 1;
    return 1;
  }, [filter]);

  const [totalPages, setTotalPages] = useState(1);
  const { title } = useSelector((state) => state.title);
  const { data, loading, error } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  function handleFastFilterBtnsClick(event) {
    if (event) {
      let data = event.currentTarget.getAttribute("data") || GET_ALL_PRODUCTS;
      dispatch(setFilterTag({ name: data, value: data }));
      let title = event.currentTarget.getAttribute("title") || "Products";
      dispatch(setTitle(title));
    }
  }

  const handlePageChange = (_, value) => {
    dispatch(setPageNumber(value));
    window.scrollTo(0, 0);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.totalProducts > 0) {
      setTotalPages(Math.ceil(data.totalProducts / pageSize));
    }
  }, [data]);

  useEffect(() => {
    dispatch(getFilteredProducts(filter)).unwrap().then().catch();
  }, [filter, dispatch]);

  return (
    <Container maxWidth="xl">
      <div className="products-category shared">
        <div className="head">
          <StorefrontIcon className="icon" />
          <h2 className="s-title">{title}</h2>
        </div>
        <div className="content d-flex flex-column flex-md-row gap-3 ">
          <ProductsFilter />
          <div style={{ flexGrow: 1 }}>
            <div className="fast-filter">
              <Button
                variant="outlined"
                data={GET_NEW_PRODUCTS}
                title="New Products"
                onClick={(e) => {
                  handleFastFilterBtnsClick(e);
                  navigate("/products/new-products");
                }}
              >
                <VerifiedIcon style={{ color: "green" }} />
                New Products
              </Button>

              <Button
                data={GET_DISCOUNTED_PRODUCTS}
                title="Discounts"
                variant="outlined"
                onClick={(e) => {
                  handleFastFilterBtnsClick(e);
                  navigate("/products/discounts");
                }}
              >
                <DiscountIcon style={{ color: "red" }} />
                Discounts
              </Button>

              <Button
                data={GET_BEST_SELLERS}
                title="Best Sellers"
                variant="outlined"
                onClick={(e) => {
                  handleFastFilterBtnsClick(e);
                  navigate("/products/best-sellers");
                }}
              >
                <ShoppingCartIcon style={{ color: "teal" }} />
                Best Sellers
              </Button>

              <Button
                data={GET_TOP_RATED_PRODUCTS}
                title="Top Rated"
                variant="outlined"
                onClick={(e) => {
                  handleFastFilterBtnsClick(e);
                  navigate("/products/top-rated");
                }}
              >
                <StarIcon style={{ color: "orange" }} />
                Top Rated
              </Button>
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
                    showRating={
                      filter && filter.tag.name === GET_TOP_RATED_PRODUCTS
                    }
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
