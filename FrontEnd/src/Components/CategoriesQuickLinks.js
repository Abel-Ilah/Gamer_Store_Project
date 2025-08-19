import { HorizontalScroll } from "./HorizontalScroll";
import { Category } from "./Category";
import Title from "./Title";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link } from "react-router-dom";
import { GET_ALL_PRODUCTS } from "../reducers/ProductsReducer";
import { useDispatch } from "react-redux";
import { updateFilter } from "../features/filter/filterSlice";
import { useCategories } from "../contexts/CategoriesProvider";

export function CategoriesQuickLinks() {
  const categories = useCategories();
  const dispatch = useDispatch();

  return (
    <>
      <Title title="Best Categories" />
      <div className="see-all-btn-wraper">
        <Link
          to={"/products/"}
          onClick={() => {
            dispatch(
              updateFilter({
                action: {
                  actionType: GET_ALL_PRODUCTS,
                  actionValue: GET_ALL_PRODUCTS,
                },
              })
            );
            window.scrollTo(0, 0);
          }}
        >
          <button className="see-all-btn" variant="text">
            all categories <ArrowRightAltIcon />
          </button>
        </Link>
      </div>
      <HorizontalScroll>
        {categories.map((c) => {
          return <Category category={c} key={c.id} />;
        })}
      </HorizontalScroll>
    </>
  );
}
