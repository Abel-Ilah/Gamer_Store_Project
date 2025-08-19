import Title from "./Title";
import { HorizontalScroll } from "./HorizontalScroll";
import { Product } from "./Product";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link } from "react-router-dom";
import { use10Products, GET_NEW_PRODUCTS } from "../reducers/ProductsReducer";
import { updateFilter } from "../features/filter/filterSlice";
import { useDispatch } from "react-redux";

export function NewProductsQuickLinks() {
  const { data: products, loading, error } = use10Products(GET_NEW_PRODUCTS);

  const dispatch = useDispatch();

  function handleAllDiscountsBtnClick() {
    dispatch(
      updateFilter({
        action: {
          actionType: GET_NEW_PRODUCTS,
          actionValue: GET_NEW_PRODUCTS,
        },
      })
    );
  }

  return loading ? (
    <h3>Loading...</h3>
  ) : error ? (
    <h3>{error}</h3>
  ) : (
    <>
      <Title title="New products" />
      <div className="see-all-btn-wraper">
        <Link
          to={"/products/new-products"}
          onClick={handleAllDiscountsBtnClick}
        >
          <button className="see-all-btn" variant="text">
            {" "}
            all new products <ArrowRightAltIcon />
          </button>
        </Link>
      </div>
      <HorizontalScroll>
        {products.map((p) => {
          return <Product Product={p} key={p.id} />;
        })}
      </HorizontalScroll>
    </>
  );
}
