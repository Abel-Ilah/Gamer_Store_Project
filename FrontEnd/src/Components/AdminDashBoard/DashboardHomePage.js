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

export function DashboardHomePage() {
  return (
    <main className="dashboard-home-page">
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
      <section className="section row g-3 ">
        <div className="col-12 col-xl-8">
          <div className="top-products-table">
            <h4 className="table-title">Top Products</h4>
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 500 }} aria-label="table">
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
        </div>
        <div className="col-12 col-xl-4">
          <div className="restock">
            <h4 className="table-title">Restock</h4>
            <TableContainer className="table-container">
              <Table sx={{ minWidth: 300 }} aria-label="table">
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
        </div>
      </section>
    </main>
  );
}
