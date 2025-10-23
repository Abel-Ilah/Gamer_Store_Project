import "./DiscountedProduct.css";
import Button from "@mui/material/Button";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link } from "react-router-dom";
export function DiscountedProduct({ product }) {
  function addCloudinaryTransform(
    url,
    transform = "w_300,c_fill,q_auto,f_auto"
  ) {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : "/public/assets/pc-gamer1.png";
  }

  return (
    <div className="product-discounted">
      <div className="content">
        <img src={addCloudinaryTransform(product.imageUrl)} alt="product" />
        <div className="info">
          <h5 className="product-name">{product.name}</h5>
          <h3 className="discount-value">{product.discountValue}% OFF</h3>
          <Link to={`/product/${product.id}`}>
            <Button className="btn-effect" variant="contained">
              <span>
                {" "}
                check details <ArrowRightAltIcon />
              </span>
              <span>
                {" "}
                check details <ArrowRightAltIcon />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
