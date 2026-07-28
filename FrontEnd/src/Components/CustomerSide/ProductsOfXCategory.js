import { HorizontalScroll } from "./HorizontalScroll";
import { Product } from "./Product";
import { useDispatch } from "react-redux";
import {
  GET_PRODUCTS_BY_CATEGORY,
  getProductsByCategoryId,
} from "../../features/products/productsSlice";
import { setFilterTag } from "../../features/productsFilter/filterSlice";
import { useEffect, useMemo, useState } from "react";
import { useCategories } from "../../contexts/CategoriesProvider";
import { setTitle } from "../../features/productsPageTItle/ProductsPageTitleSlice";
import { ProductsListHeader } from "./customItems/ProductsListHeader";

export function ProductsOfXCategory({ category_name = "laptops" }) {
  const [productsState, setProductsState] = useState({
    loading: false,
    products: null,
    error: null,
  });
  const dispatch = useDispatch();
  const categories = useCategories();

  const selectedCategory = useMemo(() => {
    const randomCategory = categories.find(
      (category) => category.name.toLowerCase() === category_name.toLowerCase(),
    );
    return randomCategory;
  }, [categories, category_name]);

  useEffect(() => {
    if (selectedCategory) {
      setProductsState({ loading: true, products: null, error: null });

      let cachedProducts = JSON.parse(sessionStorage.getItem("10Products"));
      if (cachedProducts && cachedProducts.length > 0) {
        const cachedSearch = cachedProducts.find(
          (storedSearch) =>
            storedSearch.category &&
            storedSearch.category.id === selectedCategory.id,
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
          categoryId: selectedCategory.id,
        }),
      )
        .unwrap()
        .then((res) => {
          setProductsState({ loading: false, products: res, error: null });
          const newSearch = {
            products: res,
            category: selectedCategory,
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
  }, [selectedCategory, dispatch]);

  function handleSeeAllClick() {
    const tag = { name: GET_PRODUCTS_BY_CATEGORY, value: selectedCategory.id };
    dispatch(setFilterTag(tag));
    dispatch(setTitle(selectedCategory?.name || "Products"));
  }

  return selectedCategory && productsState.products ? (
    <>
      {/* <Title title={selectedCategory.name} /> */}
      {/* <div className="see-all-btn-wraper">
        <Link
          to={`/products/${selectedCategory.name}`}
          onClick={handleSeeAllClick}
        >
          <span className="see-all-btn" variant="text">
            {" "}
            See All <ArrowRightAltIcon />
          </span>
        </Link>
      </div> */}
      <ProductsListHeader
        title={selectedCategory.name}
        seeAllLink={`/products/${selectedCategory.name}`}
        onSeeAllClick={handleSeeAllClick}
      />
      <HorizontalScroll>
        {productsState.products.map((p) => {
          return <Product Product={p} key={p.id} />;
        })}
      </HorizontalScroll>
    </>
  ) : null;
}
