import "./CartBadge.css";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [cartBadgeDisabled, setCartBadgeDisabled] = useState(false);
  const [itemsCount, setItemsCount] = useState(0);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) setItemsCount(0);
  }, [user, dispatch]);

  useEffect(() => {
    if (cart && cart.length > 0) {
      var numberOfItems = cart.reduce((acc, item) => acc + item.quantity, 0);
      setItemsCount(numberOfItems);
    } else {
      setItemsCount(0);
      setCartBadgeDisabled(true);
    }
  }, [cart, dispatch]);

  useEffect(() => {
    setCartBadgeDisabled(location.pathname === "/cart");
  }, [location]);

  return (
    <IconButton
      id="cart-badge"
      aria-label="cart"
      disabled={cartBadgeDisabled || itemsCount === 0}
      onClick={() => {
        if (itemsCount > 0 && location.pathname !== "/cart") {
          navigate("/cart");
        }
      }}
    >
      <StyledBadge badgeContent={itemsCount} color="primary">
        <ShoppingCartOutlinedIcon
          className="icon"
          fontSize="medium"
          style={{
            color:
              cartBadgeDisabled || itemsCount === 0
                ? "gray"
                : "var(--main-color)",
            fontSize: "30px",
          }}
        />
      </StyledBadge>
    </IconButton>
  );
}
