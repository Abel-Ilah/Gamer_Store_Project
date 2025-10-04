import "./Shared.css";
import { ItemProduct } from "./ItemProduct";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import { LoadingPage } from "./LoadingPage";
import LoopIcon from "@mui/icons-material/Loop";

export function Comparelist() {
  const { compare, loading, error } = useSelector((state) => state.compare);

  return (
    <div className="comparelist shared">
      <Container maxWidth="xl">
        <div className="head">
          <LoopIcon className="icon" />
          <h2 className="s-title">Compare list</h2>
        </div>
        {loading && <LoadingPage />}
        {error && <h4 className="error">{error} </h4>}

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
          <h4 className="empty">Compare list is empty </h4>
        )}
      </Container>
    </div>
  );
}
