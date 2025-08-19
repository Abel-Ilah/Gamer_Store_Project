import "./Category.css";
import { Link } from "react-router-dom";
import { GET_PRODUCTS_BY_CATEGORY } from "../reducers/ProductsReducer";
import { useDispatch } from "react-redux";

import { updateFilter } from "../features/filter/filterSlice";

export function Category({ category }) {
  const dispatch = useDispatch();
  const handleCategoryClick = (categoryName) => {
    dispatch(
      updateFilter({
        action: {
          actionType: GET_PRODUCTS_BY_CATEGORY,
          actionValue: categoryName,
        },
      })
    );
  };

  function addCloudinaryTransform(
    url,
    transform = "w_350,c_fill,q_auto,f_auto"
  ) {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : url;
  }

  return category ? (
    <Link
      to={`/products/${category.name}`}
      onClick={() => {
        handleCategoryClick(category.name);
        window.scrollTo(0, 0);
      }}
    >
      <div className="category">
        <div className="image-wraper">
          <img
            className="category-image"
            src={addCloudinaryTransform(category.imagePath)}
            alt="category logo"
          />
        </div>
        <h5 className="category-title">{category.name}</h5>
      </div>
    </Link>
  ) : null;
}
