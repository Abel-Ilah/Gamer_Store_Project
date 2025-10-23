import "./CartItems.css";
import settings from "../../appsettings.json";
import { Divider } from "@mui/material";

export function CartItems({ items }) {
  function calculateItemAmount(price, quantity, discountValue = 0) {
    if (typeof price !== "number") return 0;
    const newPrice =
      discountValue === 0 ? price : price - (price * discountValue) / 100;
    return newPrice * quantity;
  }

  function getItemImage(url, transform = "w_200,c_fill,q_auto,f_auto") {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : "assets/pc-gamer1.png";
  }

  return items && items.length > 0 ? (
    <div className="order-items">
      {items.map((item, i) => {
        return (
          <div className="item" key={i}>
            <div className="box">
              <div className="image-wraper">
                <img src={getItemImage(item.product.imageUrl)} alt="product" />
                <span className="quantity">x{item.quantity}</span>
              </div>
              <h6 className="name">{item.product.name}</h6>
            </div>
            <h5 className="amount">
              {calculateItemAmount(
                item.product.price,
                item.quantity,
                item.product.discountValue
              ).toFixed(2)}{" "}
              {settings.currrency}
            </h5>
            <Divider />
          </div>
        );
      })}
    </div>
  ) : null;
}
