import "./DiscountedProduct.css";
import { Link } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export function DiscountedProduct({ product }) {
  function addCloudinaryTransform(
    url,
    transform = "w_300,c_fill,q_auto,f_auto",
  ) {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : "/public/assets/pc-gamer1.png";
  }

  return product ? (
    <div className="product-discounted">
      <div className="content">
        <div className="info">
          <h3 className="discount-value">{product.discountValue}%</h3>
          <h5 className="discount-word">discounts</h5>
          <Link className="link" to={`/product/${product.id}`}>
            {/* <Button className="btn-effect" variant="contained">
              <span>
                {" "}
                check details <KeyboardArrowRightIcon />
              </span>
              <span>
                {" "}
                check details <KeyboardArrowRightIcon />
              </span>
            </Button> */}
            check details <KeyboardArrowRightIcon />
          </Link>
        </div>
        <img src={addCloudinaryTransform(product.imageUrl)} alt="product" />
      </div>
    </div>
  ) : null;
}
