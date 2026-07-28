import { HorizontalScroll } from "./HorizontalScroll";
import { Product } from "./Product";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  getNewProducts,
  GET_NEW_PRODUCTS,
} from "../../features/products/productsSlice";
import { setFilterTag } from "../../features/productsFilter/filterSlice";
import { setTitle } from "../../features/productsPageTItle/ProductsPageTitleSlice";
import { ProductsListHeader } from "./customItems/ProductsListHeader";

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
        (storedSearch) => storedSearch.tag === GET_NEW_PRODUCTS,
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
        setProductsState({ loading: false, products: null, error: err }),
      );
  }, []);

  function handleSeeAllClick() {
    const tag = { name: GET_NEW_PRODUCTS, value: GET_NEW_PRODUCTS };
    dispatch(setFilterTag(tag));
    dispatch(setTitle("New Products"));
  }

  return productsState.products && productsState.products.length > 0 ? (
    <>
      <ProductsListHeader
        title="New products"
        onSeeAllClick={handleSeeAllClick}
        seeAllLink="/products/new-products"
      />
      <HorizontalScroll>
        {productsState.products.map((p) => {
          return <Product Product={p} key={p.id} />;
        })}
      </HorizontalScroll>
    </>
  ) : null;
}
