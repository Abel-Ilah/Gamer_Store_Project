import "./ProductsFilter.css";
import { useState } from "react";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import TuneIcon from "@mui/icons-material/Tune";
import FormatIndentDecreaseOutlinedIcon from "@mui/icons-material/FormatIndentDecreaseOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";
import { useCategories } from "../../contexts/CategoriesProvider";
import { useDispatch, useSelector } from "react-redux";
import settings from "../../appsettings.json";
import { GET_PRODUCTS_BY_CATEGORY } from "../../features/products/productsSlice";
import { setTitle } from "../../features/productsPageTItle/ProductsPageTitleSlice";
import {
  setFilterTag,
  setPriceRange,
} from "../../features/productsFilter/filterSlice";
import { IconButton } from "@mui/material";

function valuetext(value) {
  return `${value}°C`;
}
const minDistance = 100;

export function ProductsFilter() {
  const { tag, price } = useSelector((state) => state.filter);
  const categories = useCategories();
  const [showFilter, setShowFilter] = useState(false);

  const [range, setRange] = useState([price.min, price.max]);

  const dispatch = useDispatch();

  const handleRangeChange = (_, newValue, activeThumb) => {
    if (activeThumb === 0) {
      setRange([Math.min(newValue[0], range[1] - minDistance), range[1]]);
    } else {
      setRange([range[0], Math.max(newValue[1], range[0] + minDistance)]);
    }
  };

  const handleCategoryClick = (category) => {
    const defaultRange = [1, 100000];
    setRange(defaultRange);
    dispatch(
      setFilterTag({ name: GET_PRODUCTS_BY_CATEGORY, value: category.id })
    );
    dispatch(setTitle(category.name || "Products"));
  };

  const handleFilterByPrice = () => {
    dispatch(setPriceRange({ min: range[0], max: range[1] }));
    setShowFilter(false);
  };

  return (
    <div className="filter-cmp">
      {/* show filter btn  */}
      <Button
        className="show-filter-btn d-flex justify-content-between align-items-center d-md-none"
        endIcon={
          <KeyboardArrowDownIcon
            style={{ color: "teal", fontWeight: "bold" }}
          />
        }
        onClick={() => {
          setShowFilter(true);
        }}
      >
        <span className="d-flex gap-2 align-items-center">
          <TuneIcon />
          Filter
        </span>
      </Button>
      {/*===================*/}

      <div
        className={`filter-container ${showFilter ? "" : "d-none"} d-md-block`}
      >
        <div className="d-flex d-md-none justify-content-end">
          <IconButton
            className="close-filter-btn"
            onClick={() => {
              setShowFilter(false);
            }}
          >
            <FormatIndentDecreaseOutlinedIcon />
          </IconButton>
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
          <div>
            <div>
              <Slider
                getAriaLabel={() => "Minimum distance"}
                value={range}
                onChange={handleRangeChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                disableSwap
                min={1}
                max={100_000}
              />
            </div>

            <div className="d-flex justify-content-end mb-1">
              <Button
                id="filter-price-btn"
                variant="outlined"
                onClick={handleFilterByPrice}
                disabled={range[0] === price.min && range[1] === price.max}
              >
                Go
              </Button>
            </div>
          </div>
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
                    setShowFilter(false);
                  }}
                >
                  <li
                    className={`category ${
                      tag.name === GET_PRODUCTS_BY_CATEGORY &&
                      tag.value === c.id
                        ? "active"
                        : ""
                    }`}
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
