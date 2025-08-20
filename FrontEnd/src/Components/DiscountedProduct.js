import "./DiscountedProduct.css";
import { Link } from "react-router-dom";

export function DiscountedProduct({ Product }) {
  function addCloudinaryTransform(
    url,
    transform = "w_350,c_fill,q_auto,f_auto"
  ) {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : "/public/assets/pc-gamer1.png";
  }

  return (
    <div className="discounted-product">
      <Link to={`/product/${Product.id}`}>
        <img
          className="discount-logo"
          src="/assets/discountLogo.png"
          alt="discount logo"
        ></img>

        <span className="discount-value">{`- ${Product.discountValue}%`}</span>

        <img
          className="product-image"
          src={addCloudinaryTransform(Product.imageUrl)}
          alt="product"
        />
      </Link>
    </div>
  );
}
