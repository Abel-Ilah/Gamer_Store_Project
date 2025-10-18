import "./OrdersHistory.css";
import "./Shared.css";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Container,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HistoryIcon from "@mui/icons-material/History";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import settings from "../appsettings.json";
import { useDispatch, useSelector } from "react-redux";
import { GetUserOrders } from "../features/order/OrderSlice";
import { LoadingPage } from "./LoadingPage";
import { Link } from "react-router-dom";

const OrdersHistory = () => {
  const [ordersState, setOrdersState] = useState({
    orders: null,
    loading: false,
    error: null,
  });
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  function getProductImage(url, transform = "w_150,c_fill,q_auto,f_auto") {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : "assets/pc-gamer1.png";
  }

  useEffect(() => {
    let isMounted = true;

    if (user) {
      setOrdersState({ orders: null, loading: true, error: null });
      dispatch(GetUserOrders(user.id))
        .unwrap()
        .then((res) => {
          if (isMounted)
            setOrdersState({ orders: res, loading: false, error: null });
        })
        .catch((err) => {
          if (isMounted)
            setOrdersState({ orders: null, loading: false, error: err });
        });
    } else {
      setOrdersState({ loading: false, orders: [], error: null });
    }

    return () => {
      isMounted = false;
    };
  }, [user, dispatch]);

  const chipColor = (status) => {
    const s = String(status ?? "").toLowerCase();
    if (s === "confirmed" || s === "complete" || s === "completed")
      return "success";
    if (s === "pending") return "warning";
    if (s === "cancelled" || s === "canceled" || s === "returned")
      return "error";
    return "default";
  };

  return (
    <Container maxWidth="xl" className="orders-history shared">
      <div className="head">
        <HistoryIcon className="icon" />
        <h2 className="s-title">Orders History</h2>
      </div>

      {ordersState.loading && <LoadingPage />}

      {ordersState.orders && ordersState.orders.length === 0 && (
        <div className="empty">
          <HistoryIcon className="icon" />
          <h4 className="msg">No orders found</h4>
          <Link to={"/"}>
            <Button variant="contained">Home page</Button>
          </Link>
        </div>
      )}

      {ordersState.error && (
        <div className="error">
          <div className="icon"></div>
          <h3 className="error-title">Error</h3>
          <h4 className="text">{ordersState.error}</h4>
          <Link to={"/"}>
            <Button variant="contained">Home page</Button>
          </Link>
        </div>
      )}

      {ordersState.orders && ordersState.orders.length > 0 && (
        <Box className="orders-list">
          {ordersState.orders.map((order) => {
            const items = order.orderItems ?? [];
            return (
              <Card className="order-card" key={order.id} elevation={3}>
                <CardContent style={{ height: "100%" }}>
                  {/* Header */}
                  <Box className="order-header">
                    <Box>
                      <Typography className="order-id" variant="subtitle1">
                        Order #{String(order.id).slice(0, 8)}
                      </Typography>
                      <Typography
                        className="order-date"
                        variant="body2"
                        color="text.secondary"
                      >
                        {new Date(order.orderDate).toLocaleDateString()} •{" "}
                        {new Date(order.orderDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>

                    <Chip
                      style={{ pointerEvents: "none" }}
                      label={order.status ?? "Unknown"}
                      color={chipColor(order.status)}
                      size="small"
                      className="order-chip"
                    />
                  </Box>

                  <div className="divider" />

                  {/* Main content: details + items */}
                  <Box className="order-main">
                    <Box className="order-info">
                      <Typography variant="body2" className="info-line">
                        <PersonIcon className="icon muted" />
                        <strong>{order.fullName}</strong>
                      </Typography>
                      <Typography variant="body2" className="muted info-line">
                        <EmailIcon className="icon" />
                        {order.email}
                      </Typography>
                      <Typography variant="body2" className="muted info-line">
                        <PhoneEnabledIcon className="icon" />
                        {order.phoneNumber}
                      </Typography>
                      <Typography variant="body2" className="muted info-line">
                        <LocationOnIcon className="icon" />
                        {order.address}
                      </Typography>
                    </Box>

                    <Box className="order-items-column">
                      <Box className="items-container">
                        {items.map((item) => (
                          <div className="order-item-row" key={item.id}>
                            <div id="img-wrap">
                              <img
                                src={getProductImage(item.product?.imageUrl)}
                                alt={item.product?.name ?? "product"}
                                width={65}
                                height={65}
                              />
                              <span className="qty-badge">
                                ×{item.quantity}
                              </span>
                            </div>

                            <div className="item-meta">
                              <h5
                                className="order-item-name"
                                title={item.product?.name}
                              >
                                {item.product?.name ?? "Product"}
                              </h5>
                              <h6 className="unit-price">
                                {Number(item.unitPrice).toFixed(2)}
                                {" " + settings.currrency}
                              </h6>
                            </div>
                          </div>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  <div className="divider" />

                  {/* Footer: total */}
                  <div className="order-footer">
                    <h6 className="total-text">
                      Total: {Number(order.totalAmount).toFixed(2)}
                      {" " + settings.currrency}
                    </h6>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export default OrdersHistory;
