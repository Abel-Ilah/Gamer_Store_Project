import "./Category.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  GET_PRODUCTS_BY_CATEGORY,
  getFilteredProducts,
} from "../../features/products/productsSlice";
import settings from "../../appsettings.json";
import { setTitle } from "../../features/productsPageTItle/ProductsPageTitleSlice";

export function Category({ category }) {
  const dispatch = useDispatch();

  const handleCategoryClick = (category) => {
    const filter = {
      tag: {
        name: GET_PRODUCTS_BY_CATEGORY,
        value: category.id,
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
    dispatch(setTitle(category.name || "Products"));
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
        <h5 className="category-title">{category.name}</h5>
      </div>
    </Link>
  ) : null;
}
