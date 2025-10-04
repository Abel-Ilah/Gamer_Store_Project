import "./Shared.css";
import { ItemProduct } from "./ItemProduct";
import Container from "@mui/material/Container";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useSelector } from "react-redux";
import { LoadingPage } from "./LoadingPage";

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
        {error && <h4 className="error">{error}</h4>}
        {wishlist && wishlist.length > 0 && (
          <div className="content">
            {wishlist.map((item) => (
              <ItemProduct key={item.product.id} item={item} />
            ))}
          </div>
        )}
        {wishlist && wishlist.length === 0 && (
          <h4 className="empty">Wishlist is empty </h4>
        )}
      </Container>
    </div>
  );
}
