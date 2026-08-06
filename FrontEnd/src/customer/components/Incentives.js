import "./Incentives.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ChatIcon from "@mui/icons-material/Chat";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SecurityIcon from "@mui/icons-material/Security";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Container from "@mui/material/Container";

export function Incentives() {
  return (
    <div className="incentives">
      <Container maxWidth="xl">
        <h3 className="services-title">Services</h3>
        <div className="items">
          <div class="row g-4">
            <div class="col-12 col-sm-6 col-md-4">
              <div className="item">
                <LocalShippingIcon className="icon" />
                <h4 className="item-title">Free Shipping</h4>
                <p className="text">
                  It's not actually free we just price it into the products.
                  Someone's paying for it, and it's not us.
                </p>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div className="item">
                <ChatIcon className="icon" />
                <h4 className="item-title">24/7 Customer Support</h4>
                <p className="text">
                  Our AI chat widget is powered by a naive series of if/else
                  statements. Guaranteed to irritate.
                </p>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              {" "}
              <div className="item">
                <LocalOfferIcon className="icon" />
                <h4 className="item-title">Exclusive Deals</h4>
                <p className="text">
                  Enjoy special discounts and member-only offers.
                </p>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-4">
              {" "}
              <div className="item">
                <SecurityIcon className="icon" />
                <h4 className="item-title">Secure Payment</h4>
                <p className="text">
                  Your payments are protected with secure encryption.
                </p>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div className="item">
                <LocationPinIcon className="icon" />
                <h4 className="item-title">Order Tracking</h4>
                <p className="text">
                  Track your package every step of the way by creating your
                  account.
                </p>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <div className="item">
                <LocalMallIcon className="icon" />
                <h4 className="item-title">Fast Shopping Cart</h4>
                <p className="text">
                  Look how fast that cart is going. What does this mean for the
                  actual experience? I don't know.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
