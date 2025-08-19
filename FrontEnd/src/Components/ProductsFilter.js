import "./ProductsFilter.css";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import TuneIcon from "@mui/icons-material/Tune";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";
import { useCategories } from "../contexts/CategoriesProvider";
import { GET_PRODUCTS_BY_CATEGORY } from "../reducers/ProductsReducer";
import { useSelector, useDispatch } from "react-redux";
import settings from "../appsettings.json";
import {
  getFilter,
  updateFilter,
  updatePriceRange,
} from "../features/filter/filterSlice";

function valuetext(value) {
  return `${value}°C`;
}
const minDistance = 100;

export function ProductsFilter({ activeCategory }) {
  const categories = useCategories();

  const [showFilterOnMediumScreens, setShowFilterOnMediumScreens] =
    useState(false);

  const filter = useSelector(getFilter);
  const dispatch = useDispatch();
  const { min, max } = { ...filter.priceRange };

  const [range, setRange] = useState([min, max]);
  useEffect(() => {
    setRange([min, max]);
  }, [min, max]);
  const handleRangeChange = (event, newValue, activeThumb) => {
    if (activeThumb === 0) {
      setRange([Math.min(newValue[0], range[1] - minDistance), range[1]]);
    } else {
      setRange([range[0], Math.max(newValue[1], range[0] + minDistance)]);
    }
  };
  const handleCategoryClick = (categoryName) => {
    dispatch(
      updateFilter({
        action: {
          actionType: GET_PRODUCTS_BY_CATEGORY,
          actionValue: categoryName,
        },
      })
    );
  };

  const isMobile = useMediaQuery("(max-width:944px)");
  return (
    <>
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
      {/*==== show filter btn  ====*/}

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
        <div className="price-filter">
          <h4
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              textDecoration: "underline",
            }}
          >
            Price
          </h4>
          <div style={{ textAlign: "start", width: "fit-content" }}>
            <span style={{ fontWeight: "bold" }}>
              {range[0].toLocaleString()} {settings.currrency}
            </span>
            <span style={{ fontWeight: "bold" }}> - </span>
            <span style={{ fontWeight: "bold" }}>
              {range[1].toLocaleString()} {settings.currrency}
            </span>
          </div>
          <Box
            sx={{
              textAlign: "start",
              display: "flex",
              gap: "10px",
              width: "fit-content",
            }}
          >
            <Slider
              sx={{ width: "200px" }}
              getAriaLabel={() => "Minimum distance"}
              value={range}
              onChange={handleRangeChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              disableSwap
              max={50000}
            />
            <Button
              style={{ position: "relative", top: "-18px" }}
              variant="outlined"
              onClick={() => {
                dispatch(
                  updatePriceRange({
                    priceRange: {
                      min: range[0],
                      max: range[1],
                    },
                  })
                );
              }}
            >
              Go
            </Button>
          </Box>
        </div>
        <div className="categories-filter">
          <h4
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              textDecoration: "underline",
            }}
          >
            Categories
          </h4>
          <ul>
            {categories.map((c) => {
              return (
                <Link
                  key={c.id}
                  to={`/products/${c.name}`}
                  onClick={() => {
                    handleCategoryClick(c.name);
                    setShowFilterOnMediumScreens(false);
                  }}
                >
                  <li
                    className={
                      activeCategory === c.name ? "category active" : "category"
                    }
                  >
                    {c.name}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
