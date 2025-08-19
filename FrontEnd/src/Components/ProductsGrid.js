import "./ProductsGrid.css";
import { Product } from "./Product";

export function ProductsGrid({ products }) {
  return (
    <div className="products">
      <div className="grid">
        {products.map((p) => {
          return <Product Product={p} key={p.id} />;
        })}
      </div>
    </div>
  );
}
