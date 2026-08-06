import "./Header.css";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
//components:
import { Search } from "./Search";
import { Nav } from "./Nav";
import { AccountMenu } from "./AccountMenu";
import { CartBadge } from "../features/cart/components/CartBadge";
import { WishListBadge } from "../features/wishlist/components/WishListBadge";
import { CompareBadge } from "../features/Compare/components/CompareBadge";

export function Header() {
  return (
    <div className="header mb-2 mb-md-0">
      <Container maxWidth="xl">
        <div className="content d-flex flex-wrap flex-row justify-content-between align-items-center column-gap-2 row-gap-1">
          {/* logo */}
          <Link className="order-2 order-md-1 " to="/">
            <img id="logo" src="/assets/store-logo-1.png" alt="logo" />
          </Link>
          {/* ======= */}
          {/* search  */}
          <div id="search" className="order-4 order-md-2 flex-grow-1">
            <Search />
          </div>
          {/* ===== */}
          {/* cart / compare /wishlist / account badges */}
          <div className="order-3 d-flex flex-nowrap align-items-center gap-1">
            <div className="d-none d-lg-block">
              <CompareBadge />
            </div>
            <div className="d-none d-lg-block">
              <WishListBadge />
            </div>
            <div className="me-2">
              <CartBadge />
            </div>
            <div className="profile">
              <AccountMenu />
              <div className="list-items"></div>
            </div>
          </div>
          {/* =========== */}
          {/* nav */}
          <div className="nav-wraper order-1 order-md-4 flex-md-grow-1">
            <Nav />
          </div>
          {/* ======== */}
        </div>
      </Container>
    </div>
  );
}
