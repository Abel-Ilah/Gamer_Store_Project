import "../../../styles/Shared.css";
import "./Comparelist.css";
import { ItemProduct } from "../../product/components/ItemProduct";
import { LoadingPage } from "../../../components/LoadingPage";

import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import LoopIcon from "@mui/icons-material/Loop";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

export function Comparelist() {
  const { compare, loading, error } = useSelector((state) => state.compare);

  return (
    <div className="compare-page shared">
      <Container maxWidth="xl">
        <div className="head">
          <LoopIcon className="icon" />
          <h2 className="s-title">Compare list</h2>
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

        {compare && compare.length > 0 && (
          <div className="content">
            {compare.map((item) => (
              <ItemProduct
                key={item.product.id}
                item={item}
                itemType="comparelist"
              />
            ))}
          </div>
        )}
        {compare && compare.length === 0 && (
          <div className="empty">
            <LoopIcon className="icon" />
            <h4 className="msg">No items found in comparelist</h4>
            <Link to={"/"}>
              <Button variant="contained">Shop Now</Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
