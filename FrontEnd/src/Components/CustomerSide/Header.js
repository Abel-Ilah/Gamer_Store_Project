import "./Header.css";
import Container from "@mui/material/Container";
import { useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
//components:
import { Search } from "./Search";
import { Nav } from "./Nav";
import { AccountMenu } from "./AccountMenu";
import { CartBadge } from "./CartBadge";
import { WishListBadge } from "./WishListBadge";
import { CompareBadge } from "./CompareBadge";

export function Header() {
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <div className="header">
      <Container maxWidth="xl">
        <div className="content">
          {/* logo */}
          <Link style={{ order: isMdScreen ? 1 : 2 }} to="/">
            <img id="logo" src="/assets/store-logo-1.png" alt="logo" />
          </Link>
          {/* ======= */}
          {/* search  */}
          <div
            id="search"
            style={{
              order: isMdScreen ? 2 : 4,
              flexBasis: isMdScreen ? "unset" : "100%",
              marginTop: isMdScreen ? "0px" : "20px",
              maxWidth: isMdScreen ? "500px" : "unset",
              flexGrow: "1",
            }}
          >
            <Search />
          </div>
          {/* ===== */}
          {/* cart / compare /wishlist / account badges */}
          <div
            style={{
              order: 3,
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CompareBadge />
            <WishListBadge />
            <CartBadge />
            <div className="profile">
              <AccountMenu />
              <div className="list-items"></div>
            </div>
          </div>
          {/* =========== */}
          {/* nav */}
          <div
            style={
              isMdScreen
                ? {
                    order: 4,
                    flexBasis: "100%",
                    // marginTop: "20px",
                    width: "100%",
                  }
                : {
                    order: 1,
                    flexBasis: "unset",
                    marginTop: "0px",
                    position: "unset",
                  }
            }
          >
            <Nav />
          </div>
          {/* ======== */}
        </div>
      </Container>
    </div>
  );
}
