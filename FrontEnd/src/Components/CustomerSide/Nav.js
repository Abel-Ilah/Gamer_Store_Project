import "./Nav.css";
import { useState } from "react";
import { useCategories } from "../../contexts/CategoriesProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
//mui components:
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import { GET_PRODUCTS_BY_CATEGORY } from "../../features/products/productsSlice";
import { setTitle } from "../../features/productsPageTItle/ProductsPageTitleSlice";
import {
  GET_ALL_PRODUCTS,
  GET_DISCOUNTED_PRODUCTS,
  setFilterTag,
} from "../../features/productsFilter/filterSlice";

export function Nav() {
  const categories = useCategories();
  //active page :(categorie/home/shop/deals/contact)
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [showCategoriesList_sm_md, setShowCategoriesList_sm_md] =
    useState(false);
  const [showCategoriesList_lg, setShowCategoriesList_lg] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const dispatch = useDispatch();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCategoryClick = (category) => {
    dispatch(
      setFilterTag({ name: GET_PRODUCTS_BY_CATEGORY, value: category.id })
    );
    dispatch(setTitle(category.name || "Products"));
  };
  function handleShopClick() {
    dispatch(
      setFilterTag({
        name: GET_ALL_PRODUCTS,
        value: GET_ALL_PRODUCTS,
      })
    );
    dispatch(setTitle("All Products"));
    navigate("/products");
    console.log("clicked...");
  }
  function handleDealsClick() {
    dispatch(
      setFilterTag({
        name: GET_DISCOUNTED_PRODUCTS,
        value: GET_DISCOUNTED_PRODUCTS,
      })
    );
    dispatch(setTitle("Discounts"));

    navigate("/products/discounts");
  }
  function handleHomeCLick() {
    navigate("/");
    console.log("clicked...");
  }
  function handleContactCLick() {
    // navigate("/contact");
  }
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <div className="nav">
      {/* in small screens  (screen <= md)*/}
      <Box className="f-dlex flex-grow-1 d-md-none">
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          sx={{ padding: "0px" }}
        >
          <MenuIcon sx={{ color: "gray", fontSize: "40px" }} />
        </IconButton>
        <Menu
          className="d-block d-md-none"
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          PaperProps={{
            sx: {
              // minWidth: "80vw",
              width: "100vw",
              borderRadius: 0,
              borderBottom: "2px solid teal",
              boxShadow: "none",
            },
          }}
        >
          <div>
            <Button
              id="list-btn"
              sx={{
                color: "black",
                display: "block",
                width: "100%",
                textAlign: "start",
              }}
              onClick={() => {
                showCategoriesList_sm_md
                  ? setShowCategoriesList_sm_md(false)
                  : setShowCategoriesList_sm_md(true);
              }}
            >
              Categories{" "}
              {showCategoriesList_sm_md ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </Button>
            <ul
              className="categories-list"
              style={{
                display: showCategoriesList_sm_md ? "block" : "none",
              }}
            >
              {Array.isArray(categories) &&
                categories.map((c) => {
                  return (
                    <Link
                      key={c.id}
                      to={`/products/${c.name}`}
                      onClick={() => handleCategoryClick(c)}
                    >
                      <ListItemButton className="list-item">
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                          <KeyboardArrowRightIcon />
                        </ListItemIcon>
                        <ListItemText primary={c.name} />
                      </ListItemButton>
                    </Link>
                  );
                })}
            </ul>
          </div>
          <Button
            sx={{
              color: "black",
              display: "block",
              width: "100%",
              textAlign: "start",
            }}
          >
            New Products
          </Button>
          <Button
            sx={{
              color: "black",
              display: "block",
              width: "100%",
              textAlign: "start",
            }}
          >
            % Promotions
          </Button>
          <Button
            sx={{
              color: "black",
              display: "block",
              width: "100%",
              textAlign: "start",
            }}
          >
            Contact Us
          </Button>
          <Button
            sx={{
              color: "black",
              display: "block",
              width: "100%",
              textAlign: "start",
            }}
          >
            Location
          </Button>
        </Menu>
      </Box>
      {/* ================ */}
      {/* in large screens (screen >= lg) */}
      <Box className="content-lg d-none d-md-flex gap-4 align-items-center flex-grow-md-1 w-100">
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
              location.pathname === "/contact" ? "active" : ""
            }`}
            startIcon={<HeadsetMicOutlinedIcon />}
            onClick={handleContactCLick}
          >
            Contact
          </Button>
        </div>
        {/* ======= */}
      </Box>
      {/* ================================== */}
    </div>
  );
}
