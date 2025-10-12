import Title from "./Title";
import { HorizontalScroll } from "./HorizontalScroll";
import { Product } from "./Product";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  getNewProducts,
  GET_NEW_PRODUCTS,
  getFilteredProducts,
} from "../features/products/productsSlice";
import settings from "../appsettings.json";

export function NewProductsQuickLinks() {
  const [productsState, setProductsState] = useState({
    loading: false,
    products: null,
    error: null,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    setProductsState({ loading: true, products: null, error: null });
    let cachedProducts = JSON.parse(sessionStorage.getItem("10Products"));
    if (cachedProducts && cachedProducts.length > 0) {
      const cachedSearch = cachedProducts.find(
        (storedSearch) => storedSearch.tag === GET_NEW_PRODUCTS
      );

      if (cachedSearch) {
        setProductsState({
          loading: false,
          products: cachedSearch.products,
          error: null,
        });
        return;
      }
    }
    dispatch(getNewProducts(10))
      .unwrap()
      .then((res) => {
        const newSearch = {
          products: res,
          tag: GET_NEW_PRODUCTS,
        };
        cachedProducts = cachedProducts
          ? [newSearch, ...cachedProducts]
          : [newSearch];
        sessionStorage.setItem("10Products", JSON.stringify(cachedProducts));
        setProductsState({ loading: false, products: res, error: null });
      })
      .catch((err) =>
        setProductsState({ loading: false, products: null, error: err })
      );
  }, []);

  function handleSeeAllClick() {
    const filter = {
      tag: {
        name: GET_NEW_PRODUCTS,
        value: GET_NEW_PRODUCTS,
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
    dispatch("New Products");
  }

  return productsState.products && productsState.products.length > 0 ? (
    <>
      <Title title="New products" />
      <div className="see-all-btn-wraper">
        <Link to={"/products/new-products"} onClick={handleSeeAllClick}>
          <button className="see-all-btn" variant="text">
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
