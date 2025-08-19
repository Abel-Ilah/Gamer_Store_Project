import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

export function CartBadge() {
  const [itemsCount, setItemsCount] = useState(0);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const {
    user,
    loading: userLoading,
    error: userError,
    success: userSuccess,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) setItemsCount(0);
  }, [user, dispatch]);

  useEffect(() => {
    if (cart) {
      var numberOfItems = cart.reduce((acc, item) => acc + item.quantity, 0);
      setItemsCount(numberOfItems);
    } else setItemsCount(0);
  }, [cart, dispatch]);

  return (
    <Link
      to={itemsCount > 0 ? "/cart" : "#"}
      onClick={(e) => {
        if (itemsCount === 0) e.preventDefault();
      }}
    >
      <IconButton aria-label="cart">
        <StyledBadge badgeContent={itemsCount} color="primary">
          <ShoppingCartIcon
            fontSize="medium"
            style={{ color: "white", fontSize: "35px" }}
          />
        </StyledBadge>
      </IconButton>
    </Link>
  );
}
