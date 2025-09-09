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
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) setItemsCount(100);
  }, [user, dispatch]);

  useEffect(() => {
    if (cart) {
      var numberOfItems = cart.reduce((acc, item) => acc + item.quantity, 0);
      setItemsCount(numberOfItems);
    } else setItemsCount(100);
  }, [cart, dispatch]);

  useEffect(() => {
    setIsDisabled(location.pathname === "/wishlist");
  }, [location]);
  return (
    <IconButton
      className="wishlist-badge"
      aria-label="cart"
      disabled={isDisabled}
      onClick={() => {
        if (itemsCount > 0 && location.pathname !== "/wishlist") {
          navigate("/wishlist");
        }
      }}
      sx={{ display: { xs: "none", sm: "inline-flex" } }}
    >
      <StyledBadge badgeContent={itemsCount} color="primary">
        <FavoriteBorderIcon className="icon1" fontSize="medium" />
        <FavoriteIcon className="icon2" fontSize="medium" />
      </StyledBadge>
    </IconButton>
  );
}
