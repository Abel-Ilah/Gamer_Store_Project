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
} from "../../features/products/productsSlice";
import { useEffect, useState } from "react";
import settings from "../../appsettings.json";
import { setTitle } from "../../features/productsPageTItle/ProductsPageTitleSlice";

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
    dispatch(setTitle("All Products"));
  }

  return productsState.products ? (
    <div className="py-3">
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
    </div>
  ) : null;
}
