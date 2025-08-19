import Title from "./Title";
import { HorizontalScroll } from "./HorizontalScroll";
import { Product } from "./Product";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link } from "react-router-dom";
import { use10Products, GET_BEST_SELLERS } from "../reducers/ProductsReducer";
import { updateFilter } from "../features/filter/filterSlice";
import { useDispatch } from "react-redux";

export function BestSellersQuickLinks() {
  const { data: products, loading, error } = use10Products(GET_BEST_SELLERS);

  const dispatch = useDispatch();

  function handleSeeAllClick() {
    dispatch(
      updateFilter({
        action: {
          actionType: GET_BEST_SELLERS,
          actionValue: GET_BEST_SELLERS,
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
      <Title title="Best Sellers" />
      <div className="see-all-btn-wraper">
        <Link to={"/products/best-sellers"} onClick={handleSeeAllClick}>
          <button className="see-all-btn" variant="text">
            {" "}
            See All <ArrowRightAltIcon />
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
