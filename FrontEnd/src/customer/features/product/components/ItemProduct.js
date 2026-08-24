import "./ItemProduct.css";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CircularProgress from "@mui/material/CircularProgress";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import settings from "../../../../appsettings.json";

import { Link } from "react-router-dom";
import {
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  showMessage,
} from "../../snackbar/SnackbarSlice";
import {
  ADD_ITEM,
  deleteWishlistItem,
  deleteWishlistItemLocal,
} from "../../wishlist/slices/WishlistSlice";
import { AddNewItem, AddNewItemLocal } from "../../cart/slices/CartSlice";
import {
  deleteComparelistItem,
  deleteComparelistItemLocal,
} from "../../Compare/slices/CompareSlice";

// itemType = "wihslist" or "comparelist"; important to handle delete click
export function ItemProduct({ item, itemType = "wishlist" }) {
  const { customer } = useSelector((state) => state.customerAuth);

  const { cart } = useSelector((state) => state.cart);

  const [addStatus, setAddStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const [deleteStatus, setDeleteStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const dispatch = useDispatch();

  const isItemInCart = useMemo(() => {
    if (!cart || cart.length === 0) return false;
    return cart.some((i) => i.product.id === item.product.id);
  }, [cart, item.product]);
  function calculatePrice(price, discountValue = 0) {
    if (typeof price !== "number") return 0;
    const newPrice =
      discountValue === 0 ? price : price - (price * discountValue) / 100;
    return newPrice.toFixed(2);
  }

  function handleAddToCart() {
    if (customer) {
      setAddStatus({
        loading: true,
        error: null,
        success: false,
      });
      dispatch(
        AddNewItem({
          userId: customer ? customer.id : null,
          productId: item.product.id,
          quantity: 1,
        }),
      )
        .unwrap()
        .then((res) => {
          const addedItem = res;
          const localItem = {
            id: addedItem.id,
            userId: addedItem.userId,
            product: item.product,
            quantity: addedItem.quantity,
          };
          dispatch(AddNewItemLocal(localItem));
          setAddStatus({
            loading: false,
            error: null,
            success: true,
          });
          dispatch(
            showMessage({
              message: "Done! The product has been added to your cart.",
              severity: SEVERITY_SUCCESS,
            }),
          );
        })
        .catch((err) => {
          setAddStatus({
            loading: false,
            error: err,
            success: false,
            operation: ADD_ITEM,
          });
          dispatch(
            showMessage({
              message: err,
              severity: SEVERITY_ERROR,
            }),
          );
        });
      return;
    }
    // local add to wishlist/comparelist when no user is logged in:
    const newItem = {
      id: crypto.randomUUID(),
      userId: null,
      product: item.product,
      quantity: 1,
    };
    dispatch(AddNewItemLocal(newItem));
  }

  function handleDeleteWishlistItem() {
    if (customer) {
      setDeleteStatus({
        loading: true,
        success: false,
        error: null,
      });
      dispatch(deleteWishlistItem(item.id))
        .unwrap()
        .then((res) => {
          if (res) {
            dispatch(deleteWishlistItemLocal(item.id));
            dispatch(
              showMessage({
                message: `Item has been deleted from your cart.`,
                severity: SEVERITY_SUCCESS,
              }),
            );
            setDeleteStatus({
              loading: false,
              success: true,
              error: null,
            });
          } else {
            throw new Error("operation failed, the item not deleted");
          }
        })
        .catch((err) => {
          setDeleteStatus({
            loading: false,
            success: false,
            error: err,
          });
          dispatch(
            showMessage({
              message: err,
              severity: SEVERITY_ERROR,
            }),
          );
        });
      return;
    }
    // local delete when no user is logged in:
    dispatch(deleteWishlistItemLocal(item.id));
    dispatch(
      showMessage({
        message: `Item has been deleted`,
        severity: SEVERITY_SUCCESS,
      }),
    );
  }

  function handleDeleteComparelistItem() {
    if (customer) {
      setDeleteStatus({
        loading: true,
        success: false,
        error: null,
      });
      dispatch(deleteComparelistItem(item.id))
        .unwrap()
        .then((res) => {
          if (res) {
            dispatch(deleteComparelistItemLocal(item.id));
            dispatch(
              showMessage({
                message: `Item has been deleted`,
                severity: SEVERITY_SUCCESS,
              }),
            );
            setDeleteStatus({
              loading: false,
              success: true,
              error: null,
            });
          } else {
            throw new Error("operation failed, the item not deleted");
          }
        })
        .catch((err) => {
          setDeleteStatus({
            loading: false,
            success: false,
            error: err,
          });
          dispatch(
            showMessage({
              message: err,
              severity: SEVERITY_ERROR,
            }),
          );
        });
      return;
    }
    // local delete when no user is logged in:
    dispatch(deleteComparelistItemLocal(item.id));
    dispatch(
      showMessage({
        message: `Item has been deleted`,
        severity: SEVERITY_SUCCESS,
      }),
    );
  }

  function handleDelete() {
    if (itemType === "wishlist") {
      handleDeleteWishlistItem();
    } else if (itemType === "comparelist") {
      handleDeleteComparelistItem();
    }
  }

  function getItemImage(url, transform = "w_600,c_fill,q_auto,f_auto") {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : "assets/pc-gamer1.png";
  }

  return (
    <div className="item-product">
      <Grid
        container
        rowSpacing={{ xs: 1, md: 2 }}
        columnSpacing={1}
        alignItems={"center"}
      >
        <Grid minWidth={"100px"} size={{ xs: 12, sm: 3, md: 2, lg: 2 }}>
          <Link to={`/product/${item.product.id}`}>
            <img
              src={getItemImage(item.product.imageUrl)}
              alt="product"
              className="image"
            />
          </Link>
        </Grid>

        <Grid size={{ xs: 12, sm: 7, md: 8, lg: 9 }} flexShrink={1}>
          <div className="info">
            <Link to={`/product/${item.product.id}`}>
              <h4 className="product-name px-1">{item.product.name}</h4>
            </Link>
            <div className="price px-1">
              {" "}
              {item.product.discountValue > 0 && (
                <span className="original-price">
                  {item.product.price} {settings.currrency}
                </span>
              )}
              <span className="new-price">
                {calculatePrice(item.product.price, item.product.discountValue)}{" "}
                {settings.currrency}
              </span>
            </div>
            <h5
              className="px-1"
              style={{
                fontSize: "0.8rem",
                fontWeight: "bold",
                color: item.product.quantityInStock > 0 ? "green" : "orange",
              }}
            >
              {item.product.quantityInStock > 0
                ? `IN STOCK (${item.product.quantityInStock})`
                : "OUT OF STOCK"}
            </h5>
          </div>
        </Grid>

        <Grid
          size={{ xs: 12, sm: 2, md: 2, lg: 1 }}
          justifyItems={{ xs: "start", sm: "end" }}
          alignSelf={"stretch"}
        >
          <div className="btns-wraper" style={{ height: "100%" }}>
            <IconButton
              loading={addStatus.loading}
              loadingIndicator={
                <CircularProgress size={25} style={{ color: "gray" }} />
              }
              className="add"
              onClick={handleAddToCart}
              disabled={isItemInCart}
            >
              <AddShoppingCartIcon
                style={
                  isItemInCart
                    ? {
                        visibility: addStatus.loading ? "hidden" : "visible",
                        color: "#cccccc",
                      }
                    : {
                        visibility: addStatus.loading ? "hidden" : "visible",
                      }
                }
              />
            </IconButton>
            <IconButton
              className="delete"
              onClick={handleDelete}
              loading={deleteStatus.loading}
              loadingIndicator={
                <CircularProgress size={25} style={{ color: "gray" }} />
              }
            >
              <DeleteIcon
                style={{
                  visibility: deleteStatus.loading ? "hidden" : "visible",
                }}
              />
            </IconButton>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
