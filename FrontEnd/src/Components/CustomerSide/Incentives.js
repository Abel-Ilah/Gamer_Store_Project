import "./Incentives.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ChatIcon from "@mui/icons-material/Chat";
import LocalMallIcon from "@mui/icons-material/LocalMall";

export function Incentives() {
  return (
    <div className="incentives">
      <div className="item">
        <LocalShippingIcon className="icon" />
        <h4 className="item-title">Free Shipping</h4>
        <p className="text">
          It's not actually free we just price it into the products. Someone's
          paying for it, and it's not us.
        </p>
      </div>
      <div className="item">
        <ChatIcon className="icon" />
        <h4 className="item-title">24/7 Customer Support</h4>
        <p className="text">
          Our AI chat widget is powered by a naive series of if/else statements.
          Guaranteed to irritate.
        </p>
      </div>
      <div className="item">
        <LocalMallIcon className="icon" />
        <h4 className="item-title">Fast Shopping Cart</h4>
        <p className="text">
          Look how fast that cart is going. What does this mean for the actual
          experience? I don't know.
        </p>
      </div>
    </div>
  );
}
