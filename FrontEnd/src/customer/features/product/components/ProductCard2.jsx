import "./ProductCard2.css";
import { Link } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// export function DiscountedProduct({ product }) {
//   function addCloudinaryTransform(
//     url,
//     transform = "w_300,c_fill,q_auto,f_auto",
//   ) {
//     return url.length > 0
//       ? url.replace("/upload/", `/upload/${transform}/`)
//       : "/public/assets/pc-gamer1.png";
//   }

//   return product ? (
//     <div className="product2">
//       <div className="content">
//         <div className="info">
//           <h3 className="discount-value">{product.discountValue}%</h3>
//           <h5 className="discount-word">discounts</h5>
//           <Link className="link" to={`/product/${product.id}`}>
//             check details <KeyboardArrowRightIcon />
//           </Link>
//         </div>
//         <img src={addCloudinaryTransform(product.imageUrl)} alt="product" />
//       </div>
//     </div>
//   ) : null;
// }

export default function ProductCard() {
  return (
    <div className="product-card">
      <div className="product-image">
        <span className="discount-badge">
          <LocalOfferIcon fontSize="small" />
          -25%
        </span>

        <img src="assets/pc-gamer1.png" alt="product" />
      </div>

      <div className="product-info">
        <p className="product-category">Sports Collection</p>

        <h2 className="product-title">Nike Air Zoom Pegasus Running Shoes</h2>

        <div className="rating">
          <StarIcon />
          <span>4.8</span>

          <small>(235 Reviews)</small>
        </div>

        <p className="description">
          Experience lightweight comfort and superior cushioning designed for
          everyday runners. Premium materials with breathable mesh provide all
          day comfort.
        </p>

        <div className="price-row">
          <div>
            <span className="old-price">$180</span>

            <h3 className="price">$135</h3>
          </div>

          <button className="details-btn">View Details</button>
        </div>
      </div>
    </div>
  );
}
