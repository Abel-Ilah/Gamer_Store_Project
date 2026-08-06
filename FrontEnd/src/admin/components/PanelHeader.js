import "./PanelHeader.css";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Badge from "@mui/material/Badge";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../features/theme/slices/ThemeSlice";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export function PanelHeader({ toggleSidebar, isSidebarFixed }) {
  const [open, setOpen] = useState(false);

  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };
  function switchTheme() {
    dispatch(toggleDarkMode());
  }
  return (
    <header className="dashboard-header">
      <div className="drop-menu-icon" onClick={toggleSidebar}>
        {isSidebarFixed && <FormatIndentDecreaseIcon />}
        {!isSidebarFixed && <FormatIndentIncreaseIcon />}
      </div>
      <div className="right-side">
        <IconButton
          className="theme icon"
          onClick={switchTheme}
          color="primary"
          style={{ backgroundColor: "inherit" }}
        >
          {darkMode && <WbSunnyOutlinedIcon />}
          {!darkMode && <DarkModeOutlinedIcon />}
        </IconButton>
        <div className="notifications">
          <IconButton className="icon">
            <Badge color="secondary" badgeContent={20}>
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
        </div>
        <div className="account-menu">
          <IconButton className="account-icon icon" onClick={handleClick}>
            <Avatar id="admin-avatar" />
          </IconButton>
          {open && (
            <ClickAwayListener onClickAway={handleClose}>
              <ul className="menu" onClick={handleClose}>
                <MenuItem>
                  <ListItemIcon>
                    <AccountCircleOutlinedIcon />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <LogoutOutlinedIcon />
                  </ListItemIcon>
                  Log out
                </MenuItem>
              </ul>
            </ClickAwayListener>
          )}
        </div>
      </div>
    </header>
  );
}
