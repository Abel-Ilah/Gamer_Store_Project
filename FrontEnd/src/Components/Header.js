import "./Header.css";
import Container from "@mui/material/Container";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
//components:
import { Search } from "./Search";
import { Nav } from "./Nav";
import { AccountMenu } from "./AccountMenu";
import { CartBadge } from "./CartBadge";

export function Header() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <div
      className="header"
      style={{
        background: "#1e1e1e",
        position: isLargeScreen ? "relative" : "unset",
        marginBottom: isLargeScreen ? "40px" : "0px",
      }}
    >
      <Container
        maxWidth="xl"
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "70px",
          padding: isLargeScreen ? "10px 24px" : "10px 5px",
        }}
      >
        {" "}
        <Link style={{ order: isLargeScreen ? 1 : 2 }} to="/">
          <img
            src="/assets/store-logo.png"
            alt="logo"
            style={{
              height: "40px",
            }}
          />{" "}
        </Link>
        <div
          style={{
            order: isLargeScreen ? 2 : 4,
            flexBasis: isLargeScreen ? "unset" : "100%",
            marginTop: isLargeScreen ? "0px" : "20px",
            width: isLargeScreen ? "600px" : "unset",
          }}
        >
          <Search />
        </div>
        <div
          style={{
            order: 3,
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            gap: isLargeScreen ? "20px" : "10px",
          }}
        >
          <CartBadge />
          <div className="profile">
            <AccountMenu />
            <div className="list-items"></div>
          </div>
        </div>
        <div
          style={
            isLargeScreen
              ? {
                  order: 4,
                  flexBasis: "100%",
                  marginTop: "20px",
                  position: "absolute",
                  left: "0",
                  bottom: "-30px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }
              : {
                  order: 1,
                  flexBasis: "unset",
                  marginTop: "0px",
                  position: "unset",
                }
          }
        >
          <Nav></Nav>
        </div>
      </Container>
    </div>
  );
}
