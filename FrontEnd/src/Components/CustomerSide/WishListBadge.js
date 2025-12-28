import "./WishListBadge.css";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

export function WishListBadge() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [itemsCount, setItemsCount] = useState(0);
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { customer } = useSelector((state) => state.customerAuth);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (!customer) setItemsCount(100);
  }, [customer, dispatch]);

  useEffect(() => {
    if (wishlist && wishlist.length > 0) {
      var numberOfItems = wishlist.length;
      setItemsCount(numberOfItems);
    } else {
      setItemsCount(0);
      setIsDisabled(true);
    }
  }, [wishlist, dispatch]);

  useEffect(() => {
    setIsDisabled(itemsCount === 0 || location.pathname === "/wishlist");
  }, [location, itemsCount]);
  return (
    <IconButton
      className="wishlist-badge"
      aria-label="wishlist"
      disabled={isDisabled}
      onClick={() => {
        if (itemsCount > 0 && location.pathname !== "/wishlist") {
          navigate("/wishlist");
        }
      }}
      sx={{ display: { xs: "none", sm: "inline-flex" } }}
    >
      <StyledBadge badgeContent={itemsCount} color="primary">
        <FavoriteBorderIcon
          className={isDisabled ? "icon1 disabled" : "icon1"}
          fontSize="medium"
        />
        <FavoriteIcon
          className={isDisabled ? "icon2 disabled" : "icon2"}
          fontSize="medium"
        />
      </StyledBadge>
    </IconButton>
  );
}
