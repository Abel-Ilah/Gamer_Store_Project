import "./DiscountedProductCardDetails.css";
export function DiscountedProductCardDetails() {
  return (
    <div className="card-container">
      <div className="info"></div>
      <div className="image-wraper">
        <img src="assets/pc-gamer1.png" alt="product" />
      </div>
      <div className="info">
        <h5 className="product-name">this is the name of the product</h5>
      </div>
    </div>
  );
}
