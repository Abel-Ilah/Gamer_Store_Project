import "./AccountMenu.css";
import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoopIcon from "@mui/icons-material/Loop";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../features/users/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearCartState } from "../features/cart/CartSlice";
import { useMediaQuery, useTheme } from "@mui/material";

export function AccountMenu() {
  const { user: currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    dispatch(logout());
    var login = JSON.parse(localStorage.getItem("login"));
    login.autoLogin = false;
    localStorage.setItem("login", JSON.stringify(login));
    dispatch(clearCartState());
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <Box className="account">
      <Box className="account-box">
        <Tooltip title="Menu">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                width: "32px",
                height: "32px",
                fontSize: "10px",
                color: "white",
                background: "gray",
              }}
            ></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        className="account-menu"
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {!currentUser && (
          <div>
            <Link to={"/signup/"}>
              <MenuItem className="menu-item" onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="medium" />
                </ListItemIcon>
                Sign up{" "}
              </MenuItem>
            </Link>
            <Link to={"/login/"}>
              <MenuItem className="menu-item" onClick={handleClose}>
                <ListItemIcon>
                  <LoginIcon fontSize="medium" />
                </ListItemIcon>
                Login
              </MenuItem>
            </Link>
          </div>
        )}

        <div>
          {currentUser && (
            <Link to={"/accont/"}>
              <MenuItem className="menu-item" onClick={handleClose}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="medium" />
                </ListItemIcon>
                Account
              </MenuItem>
            </Link>
          )}

          <Link to={"/wishlist/"} style={{ display: isXs ? "unset" : "none" }}>
            <MenuItem className="menu-item" onClick={handleClose}>
              <ListItemIcon>
                <FavoriteIcon className="wish-list" fontSize="medium" />
              </ListItemIcon>
              Wish List
            </MenuItem>
          </Link>
          <Link to={"/compare/"} style={{ display: isXs ? "unset" : "none" }}>
            <MenuItem className="menu-item" onClick={handleClose}>
              <ListItemIcon>
                <LoopIcon fontSize="medium" />
              </ListItemIcon>
              Compare
            </MenuItem>
          </Link>

          {currentUser && (
            <MenuItem
              className="menu-item"
              onClick={() => {
                handleLogout();
                handleClose();
              }}
            >
              <ListItemIcon>
                <Logout fontSize="medium" />
              </ListItemIcon>
              Logout
            </MenuItem>
          )}
        </div>
      </Menu>
    </Box>
  );
}
