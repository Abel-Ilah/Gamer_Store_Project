import "./ProductsListHeader.css";
import { Link } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export function ProductsListHeader({
  title = "",
  seeAllLink = "",
  onSeeAllClick,
}) {
  return (
    <div className="products-list-header">
      <h4 className="list-title">{title}</h4>
      {seeAllLink && (
        <Link to={seeAllLink} onClick={onSeeAllClick}>
          <span className="see-all" variant="text">
            See All <KeyboardArrowRightIcon />
          </span>
        </Link>
      )}
    </div>
  );
}
