import "./ProductsFilter.css";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import TuneIcon from "@mui/icons-material/Tune";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";
import { useCategories } from "../../contexts/CategoriesProvider";
import { useDispatch } from "react-redux";
import settings from "../../appsettings.json";
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY,
  getFilteredProducts,
} from "../../features/products/productsSlice";
import { setTitle } from "../../features/productsPageTItle/ProductsPageTitleSlice";

function valuetext(value) {
  return `${value}°C`;
}
const minDistance = 100;

export function ProductsFilter({ activeCategory }) {
  const categories = useCategories();
  const [showFilterOnMediumScreens, setShowFilterOnMediumScreens] =
    useState(false);

  const dispatch = useDispatch();

  const [range, setRange] = useState([1, 100000]);

  const handleRangeChange = (event, newValue, activeThumb) => {
    if (activeThumb === 0) {
      setRange([Math.min(newValue[0], range[1] - minDistance), range[1]]);
    } else {
      setRange([range[0], Math.max(newValue[1], range[0] + minDistance)]);
    }
  };

  const handleCategoryClick = (category) => {
    const defaultRange = [1, 100000];
    setRange(defaultRange);
    const filter = {
      tag: {
        name: GET_PRODUCTS_BY_CATEGORY,
        value: category.id,
      },
      price: {
        min: defaultRange[0],
        max: defaultRange[1],
      },
      page: {
        number: 1,
        size: settings.productsPageSize,
      },
    };
    dispatch(getFilteredProducts(filter));

    dispatch(setTitle(category.name || "Products"));
  };

  const handleFilterByPrice = () => {
    const filter = JSON.parse(sessionStorage.getItem("filter"));
    if (!filter) {
      filter = {
        tag: {
          name: GET_ALL_PRODUCTS,
          value: GET_ALL_PRODUCTS,
        },
        price: {
          min: 1,
          max: 10000000,
        },
        page: {
          number: 1,
          size: settings.productsPageSize,
        },
      };
    }
    filter.price = { min: range[0], max: range[1] };

    dispatch(getFilteredProducts(filter));
  };

  const isMobile = useMediaQuery("(max-width:944px)");

  useEffect(() => {
    const filter = JSON.parse(sessionStorage.getItem("filter"));
    if (filter) {
      const { price } = filter;
      setRange([price.min, price.max]);
      console.log([price.min, price.max]);
    }
  }, []);

  return (
    <div className="filter-cmp">
      {/* show filter btn  */}
      <div
        className="show-filter-btn"
        onClick={() => {
          setShowFilterOnMediumScreens(true);
        }}
      >
        <span
          style={{
            color: "teal",
            fontWeight: "bold",
            display: "flex",
            gap: "5px",
          }}
        >
          <TuneIcon /> Filter
        </span>

        <KeyboardArrowDownIcon style={{ color: "teal", fontWeight: "bold" }} />
      </div>
      {/*===================*/}

      <div
        className="filter-container"
        style={{
          display: showFilterOnMediumScreens | !isMobile ? "block" : "none",
        }}
      >
        <div
          className="close-btn-filter-wraper"
          style={{ display: "flex", justifyContent: "end" }}
        >
          {" "}
          <Button
            variant="contained"
            className="close-filter-btn"
            onClick={() => {
              setShowFilterOnMediumScreens(false);
            }}
          >
            x
          </Button>
        </div>
        {/* price filter */}
        <div className="price-filter">
          <h4 className="f-title">Price</h4>
          <div>
            <span className="range d-flex justify-content-between">
              <span>
                {range[0].toLocaleString()} {settings.currrency}
              </span>
              <span>--</span>
              {range[1].toLocaleString()} {settings.currrency}
            </span>
          </div>
          <Box>
            <Slider
              getAriaLabel={() => "Minimum distance"}
              value={range}
              onChange={handleRangeChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              disableSwap
              max={50000}
            />
            <div className="d-flex justify-content-end mb-1">
              <Button
                id="filter-price-btn"
                variant="outlined"
                onClick={handleFilterByPrice}
              >
                Go
              </Button>
            </div>
          </Box>
        </div>
        {/* ========== */}
        {/* categories filter */}
        <div className="categories-filter mt-1">
          <h4 className="f-title">Categories</h4>
          <ul>
            {categories.map((c) => {
              return (
                <Link
                  key={c.id}
                  to={`/products/${c.name}`}
                  onClick={() => {
                    handleCategoryClick(c);
                    setShowFilterOnMediumScreens(false);
                  }}
                >
                  <li
                    className={
                      activeCategory === c.name ? "category active" : "category"
                    }
                  >
                    <span className="d-flex justify-content-between">
                      {c.name}
                      <span>+</span>
                    </span>
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
        {/* ========== */}
      </div>
    </div>
  );
}
