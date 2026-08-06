import "./Nav.css";
import { useState } from "react";
import { useCategories } from "../../contexts/CategoriesProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
//mui components:
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";

import { GET_PRODUCTS_BY_CATEGORY } from "../../customer/features/product/slices/productsSlice";
import { setTitle } from "../../customer/features/product/slices/ProductsPageTitleSlice";
import {
  GET_ALL_PRODUCTS,
  GET_DISCOUNTED_PRODUCTS,
  setFilterTag,
} from "../../customer/features/product/slices/filterSlice";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export function Nav() {
  const categories = useCategories();

  const [showMenu, setShowMenu] = useState(false);
  const [showCategories_sm, setShowCategories_sm] = useState(false);
  const [showCategoriesList_lg, setShowCategoriesList_lg] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const dispatch = useDispatch();

  const handleCategoryClick = (category) => {
    dispatch(
      setFilterTag({ name: GET_PRODUCTS_BY_CATEGORY, value: category.id }),
    );
    dispatch(setTitle(category.name || "Products"));
  };
  function handleShopClick() {
    dispatch(
      setFilterTag({
        name: GET_ALL_PRODUCTS,
        value: GET_ALL_PRODUCTS,
      }),
    );
    dispatch(setTitle("All Products"));
  }
  function handleDealsClick() {
    dispatch(
      setFilterTag({
        name: GET_DISCOUNTED_PRODUCTS,
        value: GET_DISCOUNTED_PRODUCTS,
      }),
    );
    dispatch(setTitle("Deals"));
  }
  function handleHomeCLick() {
    navigate("/");
  }
  function handleContactCLick() {
    navigate("/contact-us");
  }
  const navigate = useNavigate();

  const location = useLocation();

  function closeMenu() {
    setShowMenu(false);
    setShowCategories_sm(false);
  }

  return (
    <div className="nav">
      {/*small screens  (screen <= md)*/}
      <ClickAwayListener onClickAway={closeMenu}>
        <div className="small flex-grow-1 d-inline-block d-md-none">
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => setShowMenu(!showMenu)}
            sx={{ padding: "0px" }}
          >
            <MenuIcon sx={{ color: "gray", fontSize: "40px" }} />
          </IconButton>
          <ul className={`menu ${!showMenu && "hide"} ${showMenu && "show"}`}>
            <div className="categories-wraper">
              <Button
                onClick={() => setShowCategories_sm(!showCategories_sm)}
                endIcon={
                  showCategories_sm ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )
                }
              >
                categories
              </Button>
              {showCategories_sm && (
                <ul className="categories">
                  {categories.length > 0 &&
                    categories.map((c) => (
                      <Link
                        key={c.id}
                        onClick={() => {
                          handleCategoryClick(c);
                          closeMenu();
                        }}
                        to={`/products/${c.name}`}
                      >
                        <li className="item">{c.name}</li>
                      </Link>
                    ))}
                </ul>
              )}
            </div>
            <Link onClick={closeMenu} to={"/home"} className="link">
              Home
            </Link>
            <Link
              onClick={() => {
                handleShopClick();
                closeMenu();
              }}
              to={"/products"}
              className="link"
            >
              Shop
            </Link>
            <Link
              onClick={() => {
                handleDealsClick();
                closeMenu();
              }}
              to={"/products/discounts"}
              className="link"
            >
              Deals
            </Link>
            <Link onClick={closeMenu} to={"/contact-us"} className="link">
              Contact Us
            </Link>
          </ul>
        </div>
      </ClickAwayListener>
      {/* ==== */}

      {/*large screens  */}
      <div className="content-lg d-none d-md-flex gap-4 align-items-center flex-grow-md-1 w-100">
        {/* categories select */}
        <div
          className="list-container"
          onMouseEnter={() => {
            setShowCategoriesList_lg(true);
          }}
          onMouseLeave={() => {
            setShowCategoriesList_lg(false);
          }}
        >
          <Button
            variant="contained"
            className="show-categories-btn d-flex gap-4"
          >
            <span className="d-flex align-items-center gap-1">
              <MenuIcon /> Categories
            </span>
            {showCategoriesList_lg ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </Button>

          <ul
            className="list"
            style={{
              opacity: showCategoriesList_lg ? 1 : 0,
              visibility: showCategoriesList_lg ? "visible" : "hidden",
              transition: "opacity 0.3s ease",
            }}
          >
            {Array.isArray(categories) &&
              categories.map((c) => {
                return (
                  <Link
                    onClick={(e) => {
                      handleCategoryClick(c);
                      setShowCategoriesList_lg(false);
                      setActiveCategoryId(c.id);
                    }}
                    to={`/products/${c.name}`}
                    style={{
                      pointerEvents:
                        activeCategoryId === c.id ? "none" : "auto",
                    }}
                  >
                    <li
                      className={`d-flex gap-2 my-1 ${
                        activeCategoryId === c.id ? "active" : ""
                      }`}
                      key={c.id}
                    >
                      <KeyboardArrowRightIcon />
                      {c.name}
                    </li>
                  </Link>
                );
              })}
          </ul>
        </div>
        {/* ======= */}
        {/* links */}
        <div className="links d-flex justify-content-center align-items-center  gap-4 flex-grow-1">
          <Button
            className={`link ${location.pathname === "/" ? "active" : ""}`}
            startIcon={<HomeOutlinedIcon />}
            onClick={handleHomeCLick}
          >
            Home
          </Button>
          <Button
            className={`link ${
              location.pathname === "/products" ? "active" : ""
            }`}
            startIcon={<LocalGroceryStoreOutlinedIcon />}
            onClick={handleShopClick}
          >
            Shop
          </Button>
          <Button
            className={`link ${
              location.pathname === "/products/discounts" ? "active" : ""
            }`}
            startIcon={<LocalOfferOutlinedIcon />}
            onClick={handleDealsClick}
          >
            Deals
          </Button>
          <Button
            className={`link ${
              location.pathname === "/contact-us" ? "active" : ""
            }`}
            startIcon={<HeadsetMicOutlinedIcon />}
            onClick={handleContactCLick}
          >
            Contact
          </Button>
        </div>
        {/* ======= */}
      </div>
      {/* ======= */}
    </div>
  );
}
