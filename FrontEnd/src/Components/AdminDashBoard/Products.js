import "./Products.css";
import "./styles/StyledTable.css";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import StarPurple500OutlinedIcon from "@mui/icons-material/StarPurple500Outlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import settings from "../../appsettings.json";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
} from "@mui/material";

const products = [
  {
    imageUrl: "/assets/pc-gamer1.png",
    name: "Razer Gaming Keyboard V2",
    quantityInStock: 2,
    price: 950,
    sales: 18,
    rating: 4.5,
    discount: 15,
  },
  {
    imageUrl: "/assets/pc-gamer1.png",
    name: "Corsair RGB Headset Pro",
    quantityInStock: 120,
    price: 400,
    sales: 97,
    rating: 5,
    discount: 0,
  },
  {
    imageUrl: "/assets/pc-gamer1.png",
    name: "ASUS 27'' Gaming Monitor",
    quantityInStock: 0,
    price: 105065680,
    sales: 9,
    rating: 4,
    discount: 0,
  },
  {
    imageUrl: "/assets/pc-gamer1.png",
    name: "SteelSeries Mouse Pad XL",
    quantityInStock: 79,
    price: 100,
    sales: 130,
    rating: 3.5,
    discount: 20,
  },
  {
    imageUrl: "/assets/pc-gamer1.png",
    name: "Logitech G Pro Wireless Mouse",
    quantityInStock: 4,
    price: 400,
    sales: 65,
    rating: 5,
    discount: 0,
  },
  {
    imageUrl: "/assets/pc-gamer1.png",
    name: "Razer Gaming Keyboard V2",
    quantityInStock: 2,
    price: 950,
    sales: 18,
    rating: 4.5,
    discount: 15,
  },
  {
    imageUrl: "/assets/pc-gamer1.png",
    name: "Corsair RGB Headset Pro",
    quantityInStock: 120,
    price: 400,
    sales: 97,
    rating: 5,
    discount: 0,
  },
  {
    imageUrl: "/assets/pc-gamer1.png",
    name: "ASUS 27'' Gaming Monitor",
    quantityInStock: 0,
    price: 1050,
    sales: 9,
    rating: 4,
    discount: 0,
  },
  {
    imageUrl: "/assets/pc-gamer1.png",
    name: "SteelSeries Mouse Pad XL",
    quantityInStock: 79,
    price: 100,
    sales: 130,
    rating: 3.5,
    discount: 20,
  },
  {
    imageUrl: "/assets/pc-gamer1.png",
    name: "Logitech G Pro Wireless Mouse",
    quantityInStock: 4,
    price: 400,
    sales: 65,
    rating: 5,
    discount: 0,
  },
];

export function Products() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openStockFilter, setOpenStockFilter] = useState(false);
  const [category, setCategory] = useState("All");
  const [CurrentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  function handleCategoryChange(e) {
    setCategory(e.target.value);
  }
  function handleClickFilter() {
    setOpenFilter(!openFilter);
  }
  function handleCloseFilter() {
    setOpenFilter(false);
  }

  const handleStockFilterClick = () => {
    setOpenStockFilter(!openStockFilter);
  };
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };
  function handleAddProduct() {
    navigate("/admin/products/add");
  }
  return (
    <section className="all-products-section">
      <header className="d-flex justify-content-between align-items-center flex-wrap my1 gap-2">
        <div>
          <h3 className="products-section-title">Products List</h3>
          <h6>Track your store's progress to boost your sales.</h6>
        </div>
        <Button
          id="add-product-btn"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
        >
          add product
        </Button>
      </header>
      <div
        id="products-filters"
        className="d-flex justify-content-between align-items-center flex-wrap my1 gap-3 mt-2"
      >
        <div className="left-filter d-flex  align-items-center gap-3 flex-wrap flex-grow-1">
          <form className="search-productname">
            <TextField
              placeholder="product name..."
              required
              className="input"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent", // default
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent", // remove border on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent", // remove border on focus
                  },
                  "&.Mui-focused": {
                    boxShadow: "none", // remove glow
                  },
                },
              }}
            />
            <IconButton type="submit" className="search-btn">
              <SearchOutlinedIcon />
            </IconButton>
          </form>
          <FormControl fullWidth className="custom-select">
            <InputLabel className="label" id="demo-simple-select-label">
              category
            </InputLabel>
            <Select
              className="select"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="category"
              onChange={(e) => handleCategoryChange(e)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    padding: "5px",
                    marginTop: "5px",
                    borderRadius: "10px",
                    boxShadow: "none",
                    border: "1px solid #ddd8d8ff",
                    "& .MuiMenuItem-root": {
                      color: "gray",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        color: "#333333",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#e0e0e0",
                        color: "#333333",
                      },
                    },
                    "& .MuiMenuItem-root:not(:last-of-type)": {
                      marginBottom: "5px",
                    },
                  },
                },
              }}
            >
              <MenuItem className="item" value={"all"}>
                All
              </MenuItem>
              <MenuItem className="select-item" value={"pc gamers"}>
                Pc Gamers dsfsdf dsfs dsf
              </MenuItem>
              <MenuItem className="select-item" value={"laptops"}>
                Laptops
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="right-filter align-self-start">
          <Button
            variant="contained"
            className="f-btn"
            startIcon={<TuneIcon />}
            onClick={handleClickFilter}
          >
            Filter
          </Button>

          {openFilter && (
            <ClickAwayListener onClickAway={handleCloseFilter}>
              <List
                className="f-list"
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                <ListItemButton
                  onClick={handleCloseFilter}
                  className="option-btn"
                >
                  <ListItemIcon>
                    <LocalGroceryStoreOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Best Sellers" />
                </ListItemButton>
                <ListItemButton
                  onClick={handleCloseFilter}
                  className="option-btn"
                >
                  <ListItemIcon>
                    <StarPurple500OutlinedIcon className="star" />
                  </ListItemIcon>
                  <ListItemText primary="Top Rated" />
                </ListItemButton>
                <ListItemButton
                  onClick={handleCloseFilter}
                  className="option-btn"
                >
                  <ListItemIcon>
                    <DiscountOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Discounted" />
                </ListItemButton>
                <ListItemButton
                  onClick={handleStockFilterClick}
                  className="option-btn"
                >
                  <ListItemIcon>
                    <StorefrontOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Stock" />
                  {openStockFilter ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openStockFilter} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton
                      onClick={handleCloseFilter}
                      className="option-btn"
                      sx={{ pl: 3 }}
                    >
                      <ListItemIcon>
                        <KeyboardArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="In Stock" />
                    </ListItemButton>
                    <ListItemButton
                      onClick={handleCloseFilter}
                      className="option-btn"
                      sx={{ pl: 3 }}
                    >
                      <ListItemIcon>
                        <KeyboardArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="Low Stock" />
                    </ListItemButton>
                    <ListItemButton
                      onClick={handleCloseFilter}
                      className="option-btn"
                      sx={{ pl: 3 }}
                    >
                      <ListItemIcon>
                        <KeyboardArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="Out Of Stock" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            </ClickAwayListener>
          )}
        </div>
      </div>
      <div className="products-table">
        <TableContainer className="table-container styled-scrollbar">
          <Table
            style={{ minWidth: 1200 }}
            className="styled-table"
            aria-label="table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">Price</TableCell>
                <TableCell align="left">Discount</TableCell>
                <TableCell align="left">Sales</TableCell>
                <TableCell align="left">Rating</TableCell>
                <TableCell align="left">Stock</TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.name}>
                  <TableCell>
                    <div className="d-flex align-items-center gap-2">
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
                          Q: {product.quantityInStock}
                          {` item${product.quantityInStock > 1 ? "s" : ""}`}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    {product.price}
                    <span style={{ fontSize: "11px" }}>
                      {" "}
                      {settings.currrency}
                    </span>
                  </TableCell>
                  <TableCell align="left">
                    {product.discount > 0 ? `-${product.discount}%` : "__"}
                  </TableCell>
                  <TableCell align="left">{product.sales}</TableCell>
                  <TableCell align="left">
                    <StarPurple500OutlinedIcon
                      style={{ fontSize: "1rem", color: "orange" }}
                    />
                    {" " + product.rating}
                  </TableCell>
                  <TableCell align="left">
                    <span
                      className={`stock ${
                        product.quantityInStock === 0
                          ? "out-of-stock"
                          : product.quantityInStock <= 5
                          ? "low-stock"
                          : "in-stock"
                      }`}
                    >
                      {product.quantityInStock === 0
                        ? "out of stock"
                        : product.quantityInStock <= 5
                        ? "low stock"
                        : "in stock"}
                    </span>
                  </TableCell>
                  <TableCell className="d-flex flex-nowrap gap-1" align="left">
                    <IconButton>
                      <VisibilityIcon className="icon show" />
                    </IconButton>
                    <IconButton>
                      <EditIcon className="icon edit" />
                    </IconButton>
                    <IconButton onClick={handleOpenDialog}>
                      <DeleteIcon className="icon delete" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="products-pagination d-flex justify-content-end">
        <Pagination
          variant="outlined"
          // shape="rounded"
          // size="small"
          count={50} //totalPages
          page={CurrentPage}
          onChange={handlePageChange}
          siblingCount={1}
          boundaryCount={0}
          showFirstButton
          showLastButton
          hideNextButton
          hidePrevButton
        />
      </div>
      {/* delete product dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Product"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product? This action cannot be
            undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* ================ */}
    </section>
  );
}
