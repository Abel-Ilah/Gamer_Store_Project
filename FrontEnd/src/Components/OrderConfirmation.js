import "./OrderConfirmation.css";
import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import { OrderItems } from "./OrderItems";
import settings from "../appsettings.json";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Button from "@mui/material/Button";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export function OrderConfirmation() {
  const { data } = useSelector((state) => state.order);

  const order = useMemo(() => {
    return data ? data : JSON.parse(sessionStorage.getItem("order"));
  }, [data]);

  return (
    <div className="order-confirmation-page">
      <Container maxWidth="xl">
        {order && (
          <div className="content">
            <div className="box" id="thanks">
              <h3>
                {" "}
                <TaskAltIcon
                  style={{ fontWeight: "bold", fontSize: "inherit" }}
                />{" "}
                Thank You for Your Order!
              </h3>
              <h3> Your order has been placed successfully. </h3>
            </div>

            <div className="details box">
              <h5 className="sub-title">Order details</h5>
              <ul>
                <li>
                  id : <span>{order.id}</span>
                </li>
                <li>
                  Date : <span>{order.orderDate.split("T")[0]}</span>
                </li>
                <li>
                  Amount :{" "}
                  <span>
                    {order.totalAmount} {settings.currrency}
                  </span>
                </li>
                <li>
                  Shipping : <span>1-2 business days</span>
                </li>
              </ul>
            </div>

            <div className="items-wraper box">
              <h5 className="sub-title">Order items</h5>
              <OrderItems items={order.orderItems} />
            </div>

            <div className="shipping-address box">
              <h5 className="sub-title">Shipping info</h5>
              <p className="address">
                {order.fullName},<br />
                {order.address}
              </p>
            </div>
            <div className="btns-wraper">
              <Button variant="contained">
                <Link to={"/"}>Continue shopping</Link>
              </Button>
              <Button variant="contained">Orders history</Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
