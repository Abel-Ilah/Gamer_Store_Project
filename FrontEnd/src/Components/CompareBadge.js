import "./CompareBadge.css";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";
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

export function CompareBadge() {
  const [isDisabled, setIsDisabled] = useState(false);
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
    if (cart) {
      var numberOfItems = cart.reduce((acc, item) => acc + item.quantity, 0);
      setItemsCount(numberOfItems);
    } else setItemsCount(0);
  }, [cart, dispatch]);

  useEffect(() => {
    setIsDisabled(location.pathname === "/compare");
  }, [location]);
  return (
    <IconButton
      className="compare-badge"
      aria-label="cart"
      disabled={isDisabled}
      onClick={() => {
        if (itemsCount > 0 && location.pathname !== "/compare") {
          navigate("/compare");
        }
      }}
      sx={{ display: { xs: "none", sm: "inline-flex" } }}
    >
      <StyledBadge badgeContent={itemsCount} color="primary">
        <CachedIcon className="compare-icon" fontSize="medium" />
      </StyledBadge>
    </IconButton>
  );
}
