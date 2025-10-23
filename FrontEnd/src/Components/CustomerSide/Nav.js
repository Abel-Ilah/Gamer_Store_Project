import "./Nav.css";
import { useState } from "react";
import { useCategories } from "../../contexts/CategoriesProvider";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
//mui components:
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  GET_PRODUCTS_BY_CATEGORY,
  getFilteredProducts,
} from "../../features/products/productsSlice";
import settings from "../../appsettings.json";
import { setTitle } from "../../features/productsPageTItle/ProductsPageTitleSlice";

export function Nav() {
  const categories = useCategories();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [showCategoriesList_sm_md, setShowCategoriesList_sm_md] =
    useState(false);
  const [showCategoriesList_lg, setShowCategoriesList_lg] = useState(false);

  const dispatch = useDispatch();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCategoryClick = (category) => {
    const filter = {
      tag: {
        name: GET_PRODUCTS_BY_CATEGORY,
        value: category.id,
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
    dispatch(setTitle(category.name || "Products"));
  };

  return (
    <div className="nav">
      {/* in small screens  (screen <= md)*/}
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "flex", md: "none" },
        }}
      >
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
          sx={{
            display: { xs: "block", md: "none" },
          }}
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
      <Box
        className="content-lg"
        sx={{
          flexGrow: 1,
          display: {
            xs: "none",
            md: "flex",
            justifyContent: "center",
            gap: "30px",
          },
        }}
      >
        <div
          className="list-container"
          onMouseEnter={() => {
            setShowCategoriesList_lg(true);
          }}
          onMouseLeave={() => {
            setShowCategoriesList_lg(false);
          }}
        >
          <Button className="show-categories-btn">
            Categories
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
                  <li key={c.id}>
                    <Link
                      onClick={() => {
                        handleCategoryClick(c);
                        setShowCategoriesList_lg(false);
                      }}
                      to={`/products/${c.name}`}
                    >
                      {c.name}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
        <Link>
          <Button className="link">New Products</Button>
        </Link>
        <Link>
          <Button className="link">% Promotions</Button>
        </Link>
        <Link>
          <Button className="link">Contact Us</Button>
        </Link>

        <Link>
          <Button className="link">Location</Button>
        </Link>
      </Box>
      {/* ================ */}
    </div>
  );
}
