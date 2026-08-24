import "./Sidebar.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";

export function Sidebar({ isSidebarFixed }) {
  const [expand, setExpand] = useState(true);
  const [openSection, setOpenSection] = useState("dashboard");
  const [activeBtn, setActiveBtn] = useState("dashboard");

  const navigate = useNavigate();

  function handleOpenSection(sectionName) {
    setOpenSection(openSection === sectionName ? null : sectionName);
  }
  function handleActiveBtn(name) {
    if (activeBtn !== name) setActiveBtn(name);
  }
  useEffect(() => {
    setExpand(isSidebarFixed);
  }, [isSidebarFixed]);

  return (
    <aside
      className={`dashboard-sidebar ${expand ? "expanded" : "collapsed"}`}
      onMouseEnter={() => {
        if (!isSidebarFixed) {
          setExpand(true);
        }
      }}
      onMouseLeave={() => {
        if (!isSidebarFixed) {
          setExpand(false);
        }
      }}
    >
      <header className="sidebar-header">
        <Link className="logo">
          <SportsEsportsIcon />
          <h4 className={`name ${expand ? "" : "hided"}`}>top player</h4>
        </Link>
      </header>
      <h6 className="m-title">{expand ? "menu" : ""}</h6>

      <List sx={{ width: "100%" }} className="list">
        {/* dashboard */}
        <ListItemButton
          className={`item ${activeBtn === "dashboard" ? "active" : ""}`}
          onClick={() => {
            handleActiveBtn("dashboard");
            handleOpenSection("dashboard");
            navigate("/admin");
          }}
        >
          <ListItemIcon>
            <GridViewOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={expand ? "Dashboard" : ""} />
        </ListItemButton>
        {/* ========== */}

        {/* products */}
        <ListItemButton
          className={`item products ${
            openSection === "products" ? "active" : ""
          }`}
          onClick={() => handleOpenSection("products")}
        >
          <ListItemIcon>
            <LocalMallOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={expand ? "Products" : ""} />
          {expand &&
            (openSection === "products" ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>

        {expand && (
          <Collapse
            in={openSection === "products"}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItemButton
                className={`item all-products ${
                  activeBtn === "all-products" ? "active" : ""
                }`}
                sx={{ pl: 4 }}
                onClick={() => {
                  handleActiveBtn("all-products");
                  navigate("/admin/products");
                }}
              >
                <ListItemIcon>
                  <KeyboardArrowRightOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={expand ? "All Products" : ""} />
              </ListItemButton>

              <ListItemButton
                className={`item new-product ${
                  activeBtn === "new-product" ? "active" : ""
                }`}
                sx={{ pl: 4 }}
                onClick={() => {
                  handleActiveBtn("new-product");
                  navigate("/admin/products/add");
                }}
              >
                <ListItemIcon>
                  <KeyboardArrowRightOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={expand ? "New Product" : ""} />
              </ListItemButton>
            </List>
          </Collapse>
        )}
        {/* ========== */}

        {/* orders */}
        <ListItemButton
          className={`item orders ${openSection === "orders" ? "active" : ""}`}
          onClick={() => handleOpenSection("orders")}
        >
          <ListItemIcon>
            <InventoryOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={expand ? "Orders" : ""} />
          {expand &&
            (openSection === "orders" ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>

        {expand && (
          <Collapse in={openSection === "orders"} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                className={`item all-orders ${
                  activeBtn === "all-orders" ? "active" : ""
                }`}
                sx={{ pl: 4 }}
                onClick={() => handleActiveBtn("all-orders")}
              >
                <ListItemIcon>
                  <KeyboardArrowRightOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={expand ? "All Orders" : ""} />
              </ListItemButton>

              <ListItemButton
                className={`item find-order ${
                  activeBtn === "find-order" ? "active" : ""
                }`}
                sx={{ pl: 4 }}
                onClick={() => handleActiveBtn("find-order")}
              >
                <ListItemIcon>
                  <KeyboardArrowRightOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={expand ? "Find Order" : ""} />
              </ListItemButton>
            </List>
          </Collapse>
        )}
        {/* ========== */}

        {/* categories */}

        <ListItemButton
          className={`item categories ${
            openSection === "categories" ? "active" : ""
          }`}
          onClick={() => {
            handleActiveBtn("categories");
            handleOpenSection("categories");
            navigate("/admin/categories");
          }}
        >
          <ListItemIcon>
            <CategoryOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={expand ? "Categories" : ""} />
        </ListItemButton>

        {/* ========== */}

        {/* customers */}
        <ListItemButton
          className={`item all-customers ${
            activeBtn === "all-customers" ? "active" : ""
          }`}
          onClick={() => {
            handleActiveBtn("all-customers");
            navigate("/admin/customers");
          }}
        >
          <ListItemIcon>
            <AccountCircleOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={expand ? "All customers" : ""} />
        </ListItemButton>

        {/* ========== */}
        {/* analytics */}
        <ListItemButton
          className={`item analytics ${
            activeBtn === "analytics" ? "active" : ""
          }`}
          onClick={() => {
            handleActiveBtn("analytics");
            handleOpenSection("analytics");
            navigate("/admin/analytics");
          }}
        >
          <ListItemIcon>
            <EqualizerOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={expand ? "Analytics" : ""} />
        </ListItemButton>
        {/* ========== */}
        {/* profile */}
        <ListItemButton
          className={`item profile ${activeBtn === "profile" ? "active" : ""}`}
          onClick={() => {
            handleActiveBtn("profile");
            handleOpenSection("profile");
            navigate("/admin/profile");
          }}
        >
          <ListItemIcon>
            <AccountCircleOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={expand ? "Profile" : ""} />
        </ListItemButton>
        {/* ========== */}
      </List>
    </aside>
  );
}
