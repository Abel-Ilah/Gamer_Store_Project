import "./Category.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GET_PRODUCTS_BY_CATEGORY } from "../../product/slices/productsSlice";
import { setTitle } from "../../product/slices/ProductsPageTitleSlice";
import { setFilterTag } from "../../product/slices/filterSlice";

export function Category({ category }) {
  const dispatch = useDispatch();

  const handleCategoryClick = (category) => {
    const tag = { name: GET_PRODUCTS_BY_CATEGORY, value: category.id };
    dispatch(setFilterTag(tag));
    dispatch(setTitle(category?.name || "Products"));
  };

  function addCloudinaryTransform(
    url,
    transform = "w_350,c_fill,q_auto,f_auto",
  ) {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : url;
  }

  return category ? (
    <Link
      to={`/products/${category.name}`}
      onClick={() => {
        handleCategoryClick(category);
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
      </div>
    </Link>
  ) : null;
}
