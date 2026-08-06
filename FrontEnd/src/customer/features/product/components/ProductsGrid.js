import "./ProductsGrid.css";
import { Product } from "./Product";

export function ProductsGrid({ products, showRating }) {
  return (
    <div className="products">
      <div className="grid">
        {products.map((p) => {
          return <Product Product={p} key={p.id} showRating={showRating} />;
        })}
      </div>
    </div>
  );
}
