import Title from "./Title";
import { HorizontalScroll } from "./HorizontalScroll";
import { Product } from "./Product";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getMixedProducts,
  GET_ALL_PRODUCTS,
  getFilteredProducts,
} from "../features/products/productsSlice";
import { useEffect, useState } from "react";
import settings from "../appsettings.json";

export function MixedProductsQuickLinks() {
  const [productsState, setProductsState] = useState({
    loading: false,
    products: null,
    error: null,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    setProductsState({ loading: true, products: null, error: null });
    dispatch(getMixedProducts(10))
      .unwrap()
      .then((res) =>
        setProductsState({ loading: false, products: res, error: null })
      )
      .catch((err) => {
        setProductsState({ loading: false, products: null, error: err });
        console.log("the erro is : ", err);
      });
  }, []);

  function handleSeeAllClick() {
    const filter = {
      tag: {
        name: GET_ALL_PRODUCTS,
        value: GET_ALL_PRODUCTS,
      },
      price: {
        min: 1,
        max: 10000000,
      },
      page: {
        number: 1,
        size: settings.productsPageSize,
      },
    };
    dispatch(getFilteredProducts(filter));
  }

  return productsState.products ? (
    <>
      <Title title="Mixed Products" />
      <div className="see-all-btn-wraper">
        <Link to={"/products/best-sellers"} onClick={handleSeeAllClick}>
          <button className="see-all-btn" variant="text">
            {" "}
            See All <ArrowRightAltIcon />
          </button>
        </Link>
      </div>
      <HorizontalScroll>
        {productsState.products.map((p) => {
          return <Product Product={p} key={p.id} />;
        })}
      </HorizontalScroll>
    </>
  ) : null;
}
