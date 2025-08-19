import { DiscountedProduct } from "./DiscountedProduct";
import { HorizontalScroll } from "./HorizontalScroll";
import Title from "./Title";
import CampaignIcon from "@mui/icons-material/Campaign";
import {
  use10Products,
  GET_DISCOUNTED_PRODUCTS,
} from "../reducers/ProductsReducer";
import { Link } from "react-router-dom";
import { updateFilter } from "../features/filter/filterSlice";
import { useDispatch } from "react-redux";
import { ProductsSkeleton } from "./ProductsSkeleton";
export function DiscountsQuickLinks() {
  const {
    data: products,
    loading,
    error,
  } = use10Products(GET_DISCOUNTED_PRODUCTS);

  const dispatch = useDispatch();

  function handleAllDiscountsBtnClick() {
    dispatch(
      updateFilter({
        action: {
          actionType: GET_DISCOUNTED_PRODUCTS,
          actionValue: GET_DISCOUNTED_PRODUCTS,
        },
      })
    );
  }

  return loading ? (
    <ProductsSkeleton />
  ) : error ? (
    <h3>{error}</h3>
  ) : products && products.length > 0 ? (
    <div className="discounts">
      <Title title="discounted products" />
      <div className="see-all-btn-wraper">
        <Link
          to={"/products/discounted-products"}
          onClick={handleAllDiscountsBtnClick}
        >
          <button className="see-all-btn" variant="text">
            See All <CampaignIcon />
          </button>
        </Link>
      </div>
      <HorizontalScroll>
        {products.map((p) => {
          return (
            <DiscountedProduct
              key={p.id}
              Product={p}
              imageUrl="assets/laptop-msi.png"
            />
          );
        })}
      </HorizontalScroll>
    </div>
  ) : null;
}
