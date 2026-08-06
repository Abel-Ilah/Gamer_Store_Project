import React, { useEffect, useState } from "react";
import "./DiscountBanner.css";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getLastDiscoutedCategory } from "../../category/slices/CategorySlice";
import {
  GET_PRODUCTS_BY_CATEGORY,
  getFilteredProducts,
} from "../slices/productsSlice";
import settings from "../../../../appsettings.json";
import { setTitle } from "../slices/ProductsPageTitleSlice";

export const DiscountBanner = () => {
  const [discountedCategory, setDiscountedCategory] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function HandleGetDiscountedCategory() {
    setDiscountedCategory(null);
    dispatch(getLastDiscoutedCategory())
      .unwrap()
      .then((res) => {
        setDiscountedCategory(res);
      })
      .catch(() => {});
  }

  const handleCheckDetailsClick = (categoryId) => {
    const filter = {
      tag: {
        name: GET_PRODUCTS_BY_CATEGORY,
        value: categoryId,
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
    dispatch(getFilteredProducts(filter));
  };

  useEffect(() => {
    HandleGetDiscountedCategory();
  }, []);

  return discountedCategory ? (
    <div className="banner-container">
      {/* Left: Discount */}
      <div className="banner-left">
        <span className="discount-value">
          {discountedCategory.discountValue}
        </span>
        <span className="discount-percent-off">
          <span className="percent">%</span>
          <span className="off">OFF</span>
        </span>
      </div>

      {/* Middle: Title */}
      <div className="banner-middle">
        <p>
          Discount available for all{" "}
          <strong>
            <u>{discountedCategory.name}</u>
          </strong>
        </p>
        <p>
          {" "}
          until{" "}
          {new Date(discountedCategory.endDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Right: Button */}
      <div className="banner-right">
        <button
          className="banner-btn btn-effect"
          onClick={() => {
            handleCheckDetailsClick(discountedCategory.id);
            navigate(`/products/${discountedCategory.name}`);
            dispatch(setTitle(discountedCategory.name));
          }}
        >
          <span>
            Check Details{" "}
            <NorthEastIcon style={{ fontSize: "20px", marginLeft: "3px" }} />
          </span>
          <span>
            Check Details{" "}
            <NorthEastIcon style={{ fontSize: "20px", marginLeft: "3px" }} />
          </span>
        </button>
      </div>
    </div>
  ) : null;
};
