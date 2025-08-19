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

import { clearUserState } from "../features/users/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearCartState } from "../features/cart/CartSlice";

export function AccountMenu() {
  const {
    user: currentUser,
    loading,
    error,
    success,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    dispatch(clearUserState());
    var login = JSON.parse(localStorage.getItem("login"));
    login.autoLogin = false;
    localStorage.setItem("login", JSON.stringify(login));
    dispatch(clearCartState());
    sessionStorage.removeItem("currentUser");
    navigate("/home");
  };

  return (
    <Box className="account">
      <Box className="account-box">
        <Tooltip title="Menu">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                color: "gray",
                background: "white",
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
                Create Account
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
        {currentUser && (
          <div>
            <Link to={"/accont/"}>
              <MenuItem className="menu-item" onClick={handleClose}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="medium" />
                </ListItemIcon>
                Account
              </MenuItem>
            </Link>
            <Link to={"/profile/"}>
              <MenuItem className="menu-item" onClick={handleClose}>
                <ListItemIcon>
                  <FavoriteIcon className="wish-list" fontSize="medium" />
                </ListItemIcon>
                Wish List
              </MenuItem>
            </Link>
            <Link to={"/compare/"}>
              <MenuItem className="menu-item" onClick={handleClose}>
                <ListItemIcon>
                  <LoopIcon fontSize="medium" />
                </ListItemIcon>
                Compare
              </MenuItem>
            </Link>
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
          </div>
        )}
      </Menu>
    </Box>
  );
}
