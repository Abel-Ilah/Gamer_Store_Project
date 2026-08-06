import { HorizontalScroll } from "../../../components/HorizontalScroll";
import { Product } from "./Product";
import { useDispatch } from "react-redux";
import { getBestSellers, GET_BEST_SELLERS } from "../slices/productsSlice";
import { useEffect, useState } from "react";
import { setTitle } from "../slices/ProductsPageTitleSlice";
import { setFilterTag } from "../slices/filterSlice";
import { ProductsListHeader } from "../components/ProductsListHeader";

export function BestSellersQuickLinks() {
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
        (storedSearch) =>
          storedSearch.tag && storedSearch.tag === GET_BEST_SELLERS,
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
    dispatch(getBestSellers(10))
      .unwrap()
      .then((res) => {
        const newSearch = {
          products: res,
          tag: GET_BEST_SELLERS,
        };
        cachedProducts = cachedProducts
          ? [newSearch, ...cachedProducts]
          : [newSearch];
        sessionStorage.setItem("10Products", JSON.stringify(cachedProducts));
        setProductsState({ loading: false, products: res, error: null });
      })
      .catch((err) => {
        setProductsState({ loading: false, products: null, error: err });
      });
  }, []);

  function handleSeeAllClick() {
    const tag = { name: GET_BEST_SELLERS, value: GET_BEST_SELLERS };
    dispatch(setFilterTag(tag));
    dispatch(setTitle("Best Sellers"));
  }
  console.log("best sellers : ", productsState.products);
  return productsState.products ? (
    <div>
      <ProductsListHeader
        title="Best Sellers"
        onSeeAllClick={handleSeeAllClick}
        seeAllLink="/products/best-sellers"
      />
      <HorizontalScroll>
        {productsState.products.map((p) => {
          return <Product Product={p} key={p.id} />;
        })}
      </HorizontalScroll>
    </div>
  ) : null;
}
