import "./Footer.css";
import Container from "@mui/material/Container";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { Link } from "react-router-dom";
import {
  GET_ALL_PRODUCTS,
  GET_BEST_SELLERS,
  GET_DISCOUNTED_PRODUCTS,
  GET_NEW_PRODUCTS,
} from "../../features/products/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { setFilterTag } from "../../features/productsFilter/filterSlice";
import { setTitle } from "../../features/productsPageTItle/ProductsPageTitleSlice";

export function Footer() {
  const dispatch = useDispatch();
  // const select = useSelector();
  const { customer } = useSelector((state) => state.customerAuth);
  function handleNewArrivalsClick() {
    const tag = { name: GET_NEW_PRODUCTS, value: GET_NEW_PRODUCTS };
    dispatch(setFilterTag(tag));
    dispatch(setTitle("New Products"));
  }
  function handleBestSellersClick() {
    const tag = { name: GET_BEST_SELLERS, value: GET_BEST_SELLERS };
    dispatch(setFilterTag(tag));
    dispatch(setTitle("Best Sellers"));
  }
  function handleDiscountsClick() {
    const tag = {
      name: GET_DISCOUNTED_PRODUCTS,
      value: GET_DISCOUNTED_PRODUCTS,
    };
    dispatch(setFilterTag(tag));
    dispatch(setTitle("Deals"));
  }
  function handleCategoriesClick() {
    const tag = {
      name: GET_ALL_PRODUCTS,
      value: GET_ALL_PRODUCTS,
    };
    dispatch(setFilterTag(tag));
    dispatch(setTitle("All Products"));
  }
  return (
    <div className="footer">
      <Container maxWidth="xl">
        <div className="row g-4 text-start">
          <div className="col-12 col-sm-6 col-md-5 col-lg-4">
            <div className="item info">
              <h4 className="col-title">Info</h4>
              <ul>
                <li>
                  <LocalPhoneIcon /> +212601836964
                </li>

                <li style={{ textTransform: "lowercase" }}>
                  <EmailIcon /> gamerstore@gmail.com
                </li>

                <li>
                  <LocationOnIcon /> morocco, agadir city, alhoda
                </li>

                <li>
                  <AccessTimeFilledIcon /> Store Open 24/7
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="item">
              {" "}
              <h4 className="col-title">Shop</h4>
              <ul>
                <Link
                  onClick={handleNewArrivalsClick}
                  to="/products/new-products"
                >
                  <li>new arrivals</li>
                </Link>
                <Link
                  onClick={handleBestSellersClick}
                  to="/products/best-sellers"
                >
                  <li>best sellers</li>
                </Link>
                <Link onClick={handleDiscountsClick} to="/products/discounts">
                  <li>discounts</li>
                </Link>
                <Link onClick={handleCategoriesClick} to="/products">
                  <li>categories</li>
                </Link>
              </ul>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3 col-lg-3">
            <div className="item">
              {" "}
              <h4 className="col-title">Services</h4>
              <ul>
                <Link to={"/FAQs"}>
                  <li>FAQs</li>
                </Link>
                <Link to={"/contact-us"}>
                  <li>Contact Us</li>
                </Link>
                <Link to={"/about-us"}>
                  <li>About Us</li>
                </Link>
              </ul>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-12 col-lg-2">
            <div className="item">
              {" "}
              <h4 className="col-title">Account</h4>
              <ul>
                {!customer && (
                  <Link to={"/login"}>
                    <li>Login/register</li>
                  </Link>
                )}
                {customer && (
                  <Link to={"/profile"}>
                    <li>My Account</li>
                  </Link>
                )}
                <Link to={"/orders-history"}>
                  <li>Order History</li>
                </Link>
                <Link to="/cart">
                  <li>Cart</li>
                </Link>
              </ul>
            </div>
          </div>
          <div className="col-12">
            <div className="copyright">
              <p>
                {" "}
                © Copyright {new Date().getFullYear()} - Abdoux. All Right
                Reserved
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
