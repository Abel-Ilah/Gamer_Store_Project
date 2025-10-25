import "./DashboardHomePage.css";
import { StatCard } from "./StatCard ";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Link } from "react-router-dom";
import settings from "../../appsettings.json";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";

const topProducts = [
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "Razer Gaming Keyboard V2",
    quantityInStock: 8,
    price: 950,
    sales: 18,
    revenue: 17100,
  },
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "Corsair RGB Headset Pro",
    quantityInStock: 20,
    price: 780,
    sales: 25,
    revenue: 19500,
  },
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "ASUS 27'' Gaming Monitor",
    quantityInStock: 10,
    price: 2200,
    sales: 12,
    revenue: 26400,
  },
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "SteelSeries Mouse Pad XL",
    quantityInStock: 30,
    price: 150,
    sales: 45,
    revenue: 6750,
  },
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "Logitech G Pro Wireless Mouse",
    quantityInStock: 15,
    price: 1200,
    sales: 22,
    revenue: 26400,
  },
];

const restock = [
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "Razer Gaming Keyboard V2",
    quantityInStock: 8,
  },
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "Corsair RGB Headset Pro",
    quantityInStock: 3,
  },
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "ASUS 27'' Gaming Monitor",
    quantityInStock: 0,
  },
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "SteelSeries Mouse Pad XL",
    quantityInStock: 5,
  },
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "Logitech G Pro Wireless Mouse",
    quantityInStock: 4,
  },
];

const recentOrders = [
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "Razer Gaming Keyboard V2",
    quantity: 8,
    totalPrice: 6500,
    status: "processing",
    date: "2025-10-22",
  },
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "Logitech G Pro Wireless Mouse",
    quantity: 5,
    totalPrice: 4200,
    status: "delivered",
    date: "2025-10-20",
  },
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "Corsair RGB Mechanical Keyboard",
    quantity: 3,
    totalPrice: 2800,
    status: "shipped",
    date: "2025-10-19",
  },
  {
    imageUrl: "assets/pc-gamer1.png",
    name: "SteelSeries Arctis 7 Headset",
    quantity: 2,
    totalPrice: 3100,
    status: "cancelled",
    date: "2025-10-18",
  },

  {
    imageUrl: "assets/pc-gamer1.png",
    name: "ASUS TUF Gaming Keyboard K3",
    quantity: 4,
    totalPrice: 2950,
    status: "paid",
    date: "2025-10-16",
  },
];

const newCustomers = [
  {
    name: "Amina El Fassi",
    email: "amina.elfassi@example.com",
    date: "2025-10-21",
  },
  {
    name: "Youssef Benali",
    email: "youssef.benali@example.com",
    date: "2025-10-20",
  },
  {
    name: "Sara Boutaleb",
    email: "sara.boutaleb@example.com",
    date: "2025-10-19",
  },
  {
    name: "Omar Cherkaoui",
    email: "omar.cherkaoui@example.com",
    date: "2025-10-18",
  },
  {
    name: "Hassan El Idrissi",
    email: "hassan.elidrissi@example.com",
    date: "2025-10-17",
  },
];

const lastComments = [
  {
    name: "ahmed taha",
    rating: 3.5,
    comment: "this is a wonderful mouse, i realy like it",
    date: "2025-10-21",
  },
  {
    name: "soso arina",
    rating: 5,
    comment:
      "hi this is a test comment sdfsdf dsfsd fsdfd fsdfsd fsdf sdfsdf sdfsdf sdfsdf sdfds fsdfsd fsd dsf fsdfsd fsdfsd fsdfsd fsdf sdfsdf sd fdsfsdf sdfsdfsd fsdfsd fsdfsdf sdfsdfsd fsdfsd f dsfsdfsdf sdfsdf sdfsdfsd fsdfsdf sdfsdfsd fsdfsd fsdfsdf sdf ",
    date: "2025-10-22",
  },
];

export function DashboardHomePage() {
  return (
    <main className="dashboard-home-page">
      {/* general statistics */}
      <div className="row  mb-3 g-3">
        <div className="col-12 col-md-6  col-xl-4">
          <StatCard
            Icon={InventoryOutlinedIcon}
            title={"Orders"}
            value={130}
            progress={15}
            iconStyle={{ color: "white", backgroundColor: "var(--green-400)" }}
          />
        </div>
        <div className="col-12 col-md-6 col-xl-4">
          <StatCard
            Icon={AccountCircleOutlinedIcon}
            title={"Customers"}
            value={57}
            progress={-23}
          />
        </div>
        <div className="col-12 col-md-6 col-xl-4">
          <StatCard
            Icon={MonetizationOnOutlinedIcon}
            iconStyle={{ color: "white", backgroundColor: "orange" }}
            title={"Total Income"}
            value={9450}
            progress={5}
            currency
          />
        </div>
      </div>
      {/* ====================== */}
      {/* top products and stock status */}
      <section className="section d-flex flex-wrap flex-xl-nowrap  gap-3 mb-3">
        <div className="top-products-table flex-grow-1">
          <h4 className="cards-title">Top Products</h4>
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
                {topProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell>
                      <div className="name-wraper">
                        <Link>
                          <div className="p-image">
                            <img
                              src={product.imageUrl}
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
                            {product.quantityInStock}
                            {` item${product.quantityInStock > 1 ? "s" : ""}`}
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

        <div className="restock flex-grow-1">
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
                {restock.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell>
                      <div className="name-wraper">
                        <Link>
                          <div className="p-image">
                            <img
                              src={product.imageUrl}
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
                            {product.quantityInStock}
                            {` item${product.quantityInStock > 1 ? "s" : ""}`}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div
                        className={`status my-auto  ${
                          product.quantityInStock > 0
                            ? "available"
                            : "not-available"
                        }`}
                      >
                        {" "}
                        {product.quantityInStock > 0
                          ? "available"
                          : "not available"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </section>
      {/* ====================== */}

      {/* recent orders */}
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
                  <TableCell>Name</TableCell>
                  <TableCell align="left">Total Price</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>
                      <div className="name-wraper">
                        <Link>
                          <div className="p-image">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              title={item.name}
                            />
                          </div>
                        </Link>
                        <div className="info">
                          <Link>
                            <p className="name">{item.name}</p>
                          </Link>
                          <span className="p-quantity">
                            {item.quantity}
                            {` Variant${item.quantity > 1 ? "s" : ""}`}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      {item.totalPrice + " " + settings.currrency}
                    </TableCell>
                    <TableCell align="left">{item.date}</TableCell>
                    <TableCell align="left">
                      <div id="recent-orders-status" className={item.status}>
                        {item.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </section>
      {/* ====================== */}

      {/* new customers and last reviews */}
      <section className="section d-flex flex-wrap flex-xl-nowrap  gap-3">
        {newCustomers && newCustomers.length > 0 && (
          <div className="new-customers flex-grow-1">
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
                  {newCustomers.map((customer) => (
                    <TableRow key={customer.name}>
                      <TableCell>
                        <div className="info d-flex align-items-center gap-3">
                          <Avatar className="icon" />
                          <Link>
                            <p className="name">{customer.name}</p>
                            <span className="email">{customer.email}</span>
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell align="left">{customer.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {lastComments && lastComments.length > 0 && (
          <div className="last-comments flex-grow-1">
            <h4 className="cards-title">Last Reviews</h4>
            {lastComments.map((review) => (
              <div className="comment d-flex align-items-center gap-3">
                <Avatar className="align-self-start" />
                <div className="info">
                  <h5 className="name">{review.name}</h5>
                  <Rating
                    className="stars"
                    name="read-only"
                    value={review.rating}
                    precision={0.5}
                    readOnly
                  />
                  <p className="text">{review.comment}</p>
                  <div className="comment-date">{review.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* ====================== */}
    </main>
  );
}
