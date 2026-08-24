import "./Dashboard.css";
import LoadingProgress from "../../../../common/components/LoadingProgress";
import { StatCard } from "../../../components/StatCard ";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Link, useNavigate } from "react-router-dom";
import settings from "../../../../appsettings.json";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { GetDashboardData } from "../slices/dashboardSlice";
import { GetImage } from "../../../../common/js/helpers";
import ErrorMessage from "../../../../common/components/ErrorMessage";
import {
  ProductType,
  setProductType,
} from "../../product/slices/productsFilterSlice";

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    loading: false,
    data: null,
    error: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setDashboardData({ loading: true, data: null, error: null });
    dispatch(GetDashboardData())
      .unwrap()
      .then((result) => {
        setDashboardData({ loading: false, data: result, error: null });
      })
      .catch((err) => {
        setDashboardData({ loading: false, data: null, error: err });
      });
  }, [dispatch]);

  function handleSeeAllTopProducts() {
    dispatch(setProductType(ProductType.BestSeller));
    navigate("/admin/products");
  }
  return (
    <div className="dashboard">
      {/* handle loading  */}
      {dashboardData.loading && <LoadingProgress />}
      {/* handle data */}
      {dashboardData.data && (
        <main className="wraper">
          {/* general statistics */}
          <div className="row mb-3 g-3">
            {/* orders */}
            <div className="col-12 col-md-6  col-xl-4">
              <StatCard
                Icon={InventoryOutlinedIcon}
                title={"Orders"}
                value={dashboardData.data.statistics.orders.count}
                progress={dashboardData.data.statistics.orders.change}
                iconStyle={{
                  color: "white",
                  backgroundColor: "var(--green-400)",
                }}
              />
            </div>
            {/* customers */}
            <div className="col-12 col-md-6 col-xl-4">
              <StatCard
                Icon={AccountCircleOutlinedIcon}
                title={"Customers"}
                value={dashboardData.data.statistics.customers.count}
                progress={dashboardData.data.statistics.customers.change}
                iconStyle={{
                  color: "white",
                  backgroundColor: "var(--main-color)",
                }}
              />
            </div>
            {/* total income */}
            <div className="col-12 col-md-6 col-xl-4">
              <StatCard
                Icon={MonetizationOnOutlinedIcon}
                iconStyle={{ color: "white", backgroundColor: "orange" }}
                title={"Total Income"}
                value={dashboardData.data.statistics.income.count}
                progress={dashboardData.data.statistics.income.change}
                currency
              />
            </div>
          </div>

          {/* top products and stock status */}
          <section
            className="section d-flex flex-wrap flex-xl-nowrap  gap-3 mb-3"
            style={{ minWidth: 0, width: "100%" }}
          >
            {/* top products */}
            {dashboardData.data?.topProducts && (
              <div
                className="top-products-table flex-grow-1"
                style={{ overflowX: "auto" }}
              >
                <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                  <h4 className="cards-title mb-0">Top Products</h4>
                  <Button
                    variant="contained"
                    id="button-see-all"
                    onClick={handleSeeAllTopProducts}
                  >
                    See all
                  </Button>
                </div>
                <TableContainer className="table-container">
                  <Table aria-label="table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="left">Price</TableCell>
                        <TableCell align="left">Sales</TableCell>
                        <TableCell align="left">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.data.topProducts.map((product) => (
                        <TableRow key={product.name}>
                          <TableCell>
                            <div className="name-wraper">
                              <Link>
                                <div className="p-image">
                                  <img
                                    src={GetImage(product.image, 200)}
                                    alt={product.name}
                                    title={product.name}
                                  />
                                </div>
                              </Link>
                              <div className="info">
                                <Link>
                                  <p className="name">{product.name}</p>
                                </Link>
                                <span className="p-quantity">
                                  {product.quantity}
                                  {` item${product.quantity > 1 ? "s" : ""}`}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            {product.price + " " + settings.currrency}
                          </TableCell>
                          <TableCell align="left">{product.sales}</TableCell>
                          <TableCell align="left">
                            {product.revenue + " " + settings.currrency}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
            {/* low stock products */}
            {dashboardData.data.lowStockProducts && (
              <div
                className="restock flex-grow-1"
                style={{ minWidth: 0, overflowX: "auto" }}
              >
                <h4 className="cards-title">Restock</h4>
                <TableContainer className="table-container">
                  <Table aria-label="table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="left">status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.data.lowStockProducts.map((product) => (
                        <TableRow key={product.name}>
                          <TableCell>
                            <div className="name-wraper">
                              <Link>
                                <div className="p-image">
                                  <img
                                    src={GetImage(product.imageUrl, 200)}
                                    alt={product.name}
                                    title={product.name}
                                  />
                                </div>
                              </Link>
                              <div className="info">
                                <Link>
                                  <p className="name">{product.name}</p>
                                </Link>
                                <span className="p-quantity">
                                  {product.quantity}
                                  {` item${product.quantity > 1 ? "s" : ""}`}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div
                              className={`status my-auto  ${
                                product.quantity > 0 && product.quantity <= 10
                                  ? "low-stock"
                                  : "not-available"
                              }`}
                            >
                              {product.quantity > 0 && product.quantity <= 10
                                ? "low stock"
                                : "out of stock"}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </section>

          {/* recent orders */}
          {dashboardData.data?.lastOrders && (
            <section className="section mb-3 ">
              <div className="recent-orders">
                <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                  <h4 className="cards-title mb-0">Recent Orders</h4>
                  <Button variant="contained" id="button-see-all">
                    See all
                  </Button>
                </div>
                <TableContainer className="table-container">
                  <Table sx={{ minWidth: 450 }} aria-label="table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="left">Total Price</TableCell>
                        <TableCell align="left">Date</TableCell>
                        <TableCell align="left">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.data.lastOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id.split("-")[0]}</TableCell>
                          <TableCell align="left">
                            {order.amount + " " + settings.currrency}
                          </TableCell>
                          <TableCell align="left">
                            {order.date.split("T")[0]}
                          </TableCell>
                          <TableCell align="left">
                            <div
                              id="recent-orders-status"
                              className={order.status}
                            >
                              {order.status}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </section>
          )}

          {/* new customers and last reviews */}

          <section className="section d-flex flex-wrap flex-xl-nowrap gap-3">
            {/* new customers */}
            {dashboardData.data?.newCustomers && (
              <div className="new-customers flex-grow-1 ">
                <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                  <h4 className="cards-title mb-0">New Customers</h4>
                  <Button variant="contained" id="button-see-all">
                    See all
                  </Button>
                </div>
                <TableContainer
                  className="table-container"
                  sx={{ overflowX: "auto" }}
                >
                  <Table sx={{ minWidth: 400 }} aria-label="table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="left">Created At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.data.newCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="info d-flex align-items-center gap-3">
                              <Avatar className="icon" />
                              <Link>
                                <p className="name">{customer.name}</p>
                                <span className="email">{customer.email}</span>
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            {customer.createdAt}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
            {/* last reviews */}
            {dashboardData.data?.lastReviews && (
              <div className="last-comments flex-grow-1 ">
                <h4 className="cards-title">Last Reviews</h4>
                <div className="comments-wraper styled-scrollbar">
                  {dashboardData.data.lastReviews.map((review) => (
                    <div className="comment d-flex align-items-center gap-3">
                      <Avatar className="align-self-start" />
                      <div className="info">
                        <h5 className="name">{review.userName}</h5>
                        <Rating
                          className="stars"
                          name="read-only"
                          value={review.rating}
                          precision={0.5}
                          readOnly
                        />
                        <p className="text">{review.comment}</p>
                        <div className="comment-date">
                          {review.createdAt.split("T")[0]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
      )}
      {/* handle error */}
      {dashboardData.error && <ErrorMessage message={dashboardData.error} />}
    </div>
  );
}
