import "../../../styles/Shared.css";
import { ItemProduct } from "../../product/components/ItemProduct";
import { LoadingPage } from "../../../components/LoadingPage";

import Container from "@mui/material/Container";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

export function Wishlist() {
  const { wishlist, loading, error } = useSelector((state) => state.wishlist);

  return (
    <div className="wishlist shared">
      <Container maxWidth="xl">
        <div className="head">
          <FavoriteBorderIcon className="icon" />
          <h2 className="s-title">Wishlist</h2>
        </div>
        {loading && <LoadingPage />}
        {error && (
          <div className="error">
            <div className="icon"></div>
            <h3 className="error-title">Error</h3>
            <h4 className="text">{error}</h4>
            <Link to={"/"}>
              <Button variant="contained">Home page</Button>
            </Link>
          </div>
        )}
        {wishlist && wishlist.length > 0 && (
          <div className="content">
            {wishlist.map((item) => (
              <ItemProduct key={item.product.id} item={item} />
            ))}
          </div>
        )}
        {wishlist && wishlist.length === 0 && (
          <div className="empty">
            <FavoriteBorderIcon className="icon" />
            <h4 className="msg">No items found in wishlist</h4>
            <Link to={"/"}>
              <Button variant="contained">Shop Now</Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
