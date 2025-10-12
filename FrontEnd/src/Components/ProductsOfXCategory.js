import Title from "./Title";
import { HorizontalScroll } from "./HorizontalScroll";
import { Product } from "./Product";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  GET_PRODUCTS_BY_CATEGORY,
  getFilteredProducts,
  getProductsByCategoryId,
} from "../features/products/productsSlice";
import { useEffect, useMemo, useState } from "react";
import settings from "../appsettings.json";
import { useCategories } from "../contexts/CategoriesProvider";
import { setTitle } from "../features/productsPageTItle/ProductsPageTitleSlice";
export function ProductsOfXCategory() {
  const [productsState, setProductsState] = useState({
    loading: false,
    products: null,
    error: null,
  });

  const dispatch = useDispatch();
  const categories = useCategories();

  const randomCategory = useMemo(() => {
    if (categories && categories.length > 0) {
      const randomIndex = Math.floor(Math.random() * categories.length);
      const randomCategory = categories[randomIndex];
      return randomCategory;
    }
  }, [categories]);
  console.log("category : ", randomCategory);
  if (randomCategory) {
    console.log(typeof randomCategory.id);
  }
  console.log("state : ", productsState);
  useEffect(() => {
    if (randomCategory) {
      setProductsState({ loading: true, products: null, error: null });

      let cachedProducts = JSON.parse(sessionStorage.getItem("10Products"));
      if (cachedProducts && cachedProducts.length > 0) {
        const cachedSearch = cachedProducts.find(
          (storedSearch) =>
            storedSearch.category &&
            storedSearch.category.id === randomCategory.id
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
      dispatch(
        getProductsByCategoryId({
          productsCount: 10,
          categoryId: randomCategory.id,
        })
      )
        .unwrap()
        .then((res) => {
          setProductsState({ loading: false, products: res, error: null });
          const newSearch = {
            products: res,
            category: randomCategory,
            tag: GET_PRODUCTS_BY_CATEGORY,
          };
          cachedProducts = cachedProducts
            ? [newSearch, ...cachedProducts]
            : [newSearch];
          sessionStorage.setItem("10Products", JSON.stringify(cachedProducts));
        })
        .catch((err) => {
          setProductsState({ loading: false, products: null, error: err });
        });
    }
  }, [randomCategory, dispatch]);

  function handleSeeAllClick() {
    const filter = {
      tag: {
        name: GET_PRODUCTS_BY_CATEGORY,
        value: randomCategory.id,
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
    dispatch(setTitle(randomCategory?.name || "Products"));
  }

  return productsState.products ? (
    <>
      <Title title={randomCategory.name} />
      <div className="see-all-btn-wraper">
        <Link
          to={`/products/${randomCategory.name}`}
          onClick={handleSeeAllClick}
        >
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
