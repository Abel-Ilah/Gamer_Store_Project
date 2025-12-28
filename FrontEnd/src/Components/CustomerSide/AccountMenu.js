import "./AccountMenu.css";
import React from "react";
import { useMediaQuery, useTheme } from "@mui/material";
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
import LoopIcon from "@mui/icons-material/Loop";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { clearCartState } from "../../features/cart/CartSlice";
import { customerLogout } from "../../features/auth/CustomerAuthSlice";

export function AccountMenu() {
  const { customer } = useSelector((state) => state.customerAuth);
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
    dispatch(customerLogout());
    dispatch(clearCartState());
    handleClose();
    navigate("/login");
  };

  return (
    <Box className="account-cmp">
      <Box className="account-box">
        <Tooltip title="Menu">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar className="avatar"></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        className="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            id: "account-menu",
            elevation: 0,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {!customer && (
          <div>
            <Link to={"/signup/"}>
              <MenuItem onClick={handleClose}>
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
          {customer && (
            <Link to={"/orders-history/"}>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <HistoryOutlinedIcon fontSize="medium" />
                </ListItemIcon>
                Orders History
              </MenuItem>
            </Link>
          )}

          <Link to={"/wishlist/"} style={{ display: isXs ? "unset" : "none" }}>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <FavoriteIcon className="wish-list" fontSize="medium" />
              </ListItemIcon>
              Wish List
            </MenuItem>
          </Link>
          <Link to={"/compare/"} style={{ display: isXs ? "unset" : "none" }}>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <LoopIcon fontSize="medium" />
              </ListItemIcon>
              Compare
            </MenuItem>
          </Link>

          {customer && (
            <MenuItem onClick={handleLogout}>
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
