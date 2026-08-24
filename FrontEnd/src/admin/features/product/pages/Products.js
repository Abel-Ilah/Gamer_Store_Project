import "./Products.css";
import "../../../styles/StyledTable.css";
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
import RestoreIcon from "@mui/icons-material/Restore";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteProduct,
  getProducts,
  restoreProduct,
} from "../APIs/ProductAPIs";
import settings from "../../../../appsettings.json";
import { GetImage } from "../../../../common/js/helpers";
import {
  ProductType,
  setCategory,
  setDeleteStatus,
  setPageNumber,
  setProductType,
  setSearch,
} from "../slices/productsFilterSlice";
import LoadingProgress from "../../../../common/components/LoadingProgress";
import ErrorMessage from "../../../../common/components/ErrorMessage";
import EmptyState from "../../../../common/components/EmptyState";
import BackButton from "../../../../common/components/BackButton";
import CustomDialog from "../../../../common/components/CustomDialog";
import {
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  showMessage,
} from "../../../../customer/features/snackbar/SnackbarSlice";

export function Products() {
  const filter = useSelector((state) => state.productsFilter);
  const [searchText, setSearchText] = useState("");
  const [productsState, setProductsState] = useState({
    loading: true,
    error: null,
    data: null,
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [openStockFilter, setOpenStockFilter] = useState(false);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [actionState, setActionState] = useState({
    productId: null,
    loading: false,
  });
  const [productsCount, setProductsCount] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  let totalPages = useMemo(() => {
    return Math.ceil(productsCount / filter.pageSize);
  }, [productsCount, filter.pageSize]);

  const { categories } = useSelector((state) => state.category);
  useEffect(() => {
    setProductsState((prev) => ({
      data: null,
      loading: true,
      error: null,
    }));

    dispatch(getProducts(filter))
      .unwrap()
      .then((data) => {
        setProductsState({
          loading: false,
          error: null,
          data,
        });
        if (filter.pageNumber === 1) setProductsCount(data.count);
      })
      .catch((error) => {
        setProductsState((prev) => ({
          ...prev,
          loading: false,
          error: error,
        }));
      });
  }, [filter, dispatch]);

  const action = useMemo(() => {
    return filter.deleted ? "restore" : "delete";
  }, [filter.deleted]);

  function handleCategoryChange(categoryId) {
    clearSearchText();
    if (categoryId === null) dispatch(setProductType(ProductType.All));
    else dispatch(setCategory(categoryId));
  }
  console.log("filter : ", filter);
  console.log("action : ", action);

  function handleClickFilter() {
    setOpenFilter(!openFilter);
  }
  function handleCloseFilter() {
    setOpenFilter(false);
  }
  const handleStockFilterClick = () => {
    setOpenStockFilter(!openStockFilter);
  };
  const handlePageChange = (_, page) => {
    dispatch(setPageNumber(page));
  };

  function handleAddProduct() {
    navigate("/admin/products/add");
  }

  function filterProductsByType(productType) {
    dispatch(setProductType(productType));
    clearSearchText();
  }
  function handleSearchForProduct(text) {
    dispatch(setSearch(searchText));
  }
  function clearSearchText() {
    setSearchText("");
  }
  const handleCloseDialog = () => {
    setOpenActionDialog(false);
    setActionState((prev) => ({ loading: false, productId: null }));
  };
  function handleDeleteOrRestoreIconCLick(productId) {
    setActionState((prev) => ({ ...prev, productId: productId }));
    setOpenActionDialog(true);
  }
  function handleDeleteProduct() {
    if (!actionState.productId) return;
    setActionState((prev) => ({ ...prev, loading: true }));
    dispatch(deleteProduct(actionState.productId))
      .unwrap()
      .then(() => {
        dispatch(
          showMessage({
            message: "the product has been deleted successfully.",
            severity: SEVERITY_SUCCESS,
          }),
        );
        setProductsState((prev) => ({
          ...prev,
          data: {
            count: prev.data.count - 1,
            products: prev.data.products.filter(
              (p) => p.id !== actionState.productId,
            ),
          },
        }));
      })
      .catch((err) => {
        dispatch(
          showMessage({
            message: err,
            severity: SEVERITY_ERROR,
          }),
        );
      })
      .finally(() => handleCloseDialog());
  }
  function handleRestoreProduct() {
    if (!actionState.productId) return;
    setActionState((prev) => ({ ...prev, loading: true }));
    dispatch(restoreProduct(actionState.productId))
      .unwrap()
      .then(() => {
        dispatch(
          showMessage({
            message: "the product has been restored successfully.",
            severity: SEVERITY_SUCCESS,
          }),
        );
        setProductsState((prev) => ({
          ...prev,
          data: {
            count: prev.data.count - 1,
            products: prev.data.products.filter(
              (p) => p.id !== actionState.productId,
            ),
          },
        }));
      })
      .catch((err) => {
        dispatch(
          showMessage({
            message: err,
            severity: SEVERITY_ERROR,
          }),
        );
      })
      .finally(() => handleCloseDialog());
  }
  function handleConfirm() {
    if (action === "delete") {
      handleDeleteProduct();
    } else if (action === "restore") {
      handleRestoreProduct();
    }
  }
  return (
    <section className="all-products-section">
      <header className="d-flex justify-content-between align-items-center flex-wrap my1 gap-2">
        <div className="d-flex align-items-start gap-2">
          <BackButton />
          <div>
            <h3 className="products-section-title">Products List</h3>
            <h6>Track your store's progress to boost your sales.</h6>
          </div>
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
      {productsState.data && (
        <div>
          {/* filter */}
          <div
            id="products-filters"
            className="d-flex justify-content-between align-items-center flex-wrap my1 gap-3 my-2"
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
                        borderColor: "transparent",
                      },
                      "&:hover fieldset": {
                        borderColor: "transparent",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "transparent",
                      },
                      "&.Mui-focused": {
                        boxShadow: "none",
                      },
                    },
                  }}
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                />
                <IconButton
                  disabled={!searchText || searchText.length < 3}
                  className="search-btn"
                  onClick={handleSearchForProduct}
                >
                  <SearchOutlinedIcon />
                </IconButton>
              </form>

              {categories && (
                <FormControl fullWidth className="custom-select">
                  <InputLabel className="label" id="demo-simple-select-label">
                    category
                  </InputLabel>
                  <Select
                    className="select"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={
                      filter.categoryId === null
                        ? "all"
                        : categories.find((c) => c.id === filter.categoryId)
                            .name
                    }
                    label="category"
                    MenuProps={{
                      PaperProps: {
                        className: "category-select-paper",
                      },
                    }}
                  >
                    <MenuItem
                      key={"all"}
                      value={"all"}
                      onClick={() => handleCategoryChange(null)}
                    >
                      All
                    </MenuItem>
                    {categories.map((c) => (
                      <MenuItem
                        key={c.id}
                        value={`${c.name}`}
                        onClick={() => handleCategoryChange(c.id)}
                      >
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControl className="styled-select">
                <InputLabel className="label" id="status-label">
                  Status
                </InputLabel>

                <Select
                  className="select"
                  labelId="status-label"
                  id="status"
                  value={filter.deleted}
                  label="Status"
                  onChange={(e) => dispatch(setDeleteStatus(e.target.value))}
                  MenuProps={{
                    PaperProps: {
                      className: "styled-menu",
                    },
                  }}
                >
                  <MenuItem value={false}>Active</MenuItem>
                  <MenuItem value={true}>Deleted</MenuItem>
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
                      disabled={filter.productType === ProductType.BestSeller}
                      onClick={() => {
                        filterProductsByType(ProductType.BestSeller);
                        handleCloseFilter();
                      }}
                      className="option-btn"
                    >
                      <ListItemIcon>
                        <LocalGroceryStoreOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Best Sellers" />
                    </ListItemButton>

                    <ListItemButton
                      onClick={() => {
                        filterProductsByType(ProductType.TopRated);
                        handleCloseFilter();
                      }}
                      className="option-btn"
                      disabled={filter.productType === ProductType.TopRated}
                    >
                      <ListItemIcon>
                        <StarPurple500OutlinedIcon className="star" />
                      </ListItemIcon>
                      <ListItemText primary="Top Rated" />
                    </ListItemButton>

                    <ListItemButton
                      onClick={() => {
                        filterProductsByType(ProductType.Discounted);
                        handleCloseFilter();
                      }}
                      className="option-btn"
                      disabled={filter.productType === ProductType.Discounted}
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
                          onClick={() => {
                            filterProductsByType(ProductType.InStock);
                            handleCloseFilter();
                          }}
                          className="option-btn"
                          sx={{ pl: 3 }}
                          disabled={filter.productType === ProductType.InStock}
                        >
                          <ListItemIcon>
                            <KeyboardArrowRightIcon />
                          </ListItemIcon>
                          <ListItemText primary="In Stock" />
                        </ListItemButton>

                        <ListItemButton
                          onClick={() => {
                            filterProductsByType(ProductType.LowStock);
                            handleCloseFilter();
                          }}
                          className="option-btn"
                          sx={{ pl: 3 }}
                          disabled={filter.productType === ProductType.LowStock}
                        >
                          <ListItemIcon>
                            <KeyboardArrowRightIcon />
                          </ListItemIcon>
                          <ListItemText primary="Low Stock" />
                        </ListItemButton>

                        <ListItemButton
                          onClick={() => {
                            filterProductsByType(ProductType.NoStock);
                            handleCloseFilter();
                          }}
                          className="option-btn"
                          sx={{ pl: 3 }}
                          disabled={filter.productType === ProductType.NoStock}
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
          {/* products table */}
          {productsState.data.products.length > 0 && (
            <>
              {/* table */}
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
                      {productsState.data.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="d-flex align-items-center gap-2">
                              <Link to={`/admin/products/${product.id}`}>
                                <div className="p-image">
                                  <img
                                    src={GetImage(product.imageUrl, 100)}
                                    alt={"preview"}
                                    title={product.name}
                                  />
                                </div>
                              </Link>
                              <div className="info">
                                <Link to={`/admin/products/${product.id}`}>
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
                            {`${product.discountValue}%`}
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
                                  : product.quantityInStock < 10
                                    ? "low-stock"
                                    : "in-stock"
                              }`}
                            >
                              {product.quantityInStock === 0
                                ? "out of stock"
                                : product.quantityInStock < 10
                                  ? "low stock"
                                  : "in stock"}
                            </span>
                          </TableCell>
                          <TableCell
                            className="d-flex flex-nowrap gap-1"
                            align="left"
                          >
                            {action === "delete" && (
                              <>
                                <IconButton
                                  onClick={() =>
                                    navigate(`/admin/products/${product.id}`)
                                  }
                                >
                                  <VisibilityIcon className="icon show" />
                                </IconButton>

                                <IconButton
                                  onClick={() =>
                                    navigate(
                                      `/admin/products/update/${product.id}`,
                                    )
                                  }
                                >
                                  <EditIcon className="icon edit" />
                                </IconButton>

                                <IconButton
                                  onClick={() =>
                                    handleDeleteOrRestoreIconCLick(product.id)
                                  }
                                >
                                  <DeleteIcon className="icon delete" />
                                </IconButton>
                              </>
                            )}

                            {action === "restore" && (
                              <IconButton
                                onClick={() =>
                                  handleDeleteOrRestoreIconCLick(product.id)
                                }
                              >
                                <RestoreIcon className="icon restore" />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              {/* pagination */}
              {totalPages > 1 && (
                <div className="products-pagination d-flex justify-content-end">
                  <Pagination
                    variant="outlined"
                    // shape="rounded"
                    // size="small"
                    count={totalPages}
                    page={filter.pageNumber}
                    onChange={handlePageChange}
                    siblingCount={1}
                    boundaryCount={0}
                    showFirstButton
                    showLastButton
                    hideNextButton
                    hidePrevButton
                  />
                </div>
              )}
              {/* delete/restore product dialog */}

              <CustomDialog
                open={openActionDialog}
                onClose={handleCloseDialog}
                confirmText={action}
                confirmStartIcon={
                  action === "delete" ? <DeleteIcon /> : <RestoreIcon />
                }
                message={`are you sure you want to ${action} this product ?`}
                onConfirm={() => handleConfirm()}
                loading={actionState.loading}
              />
              {/* ================ */}
            </>
          )}
          {/* handle empty case  */}
          {productsState.data.products.length === 0 && (
            <EmptyState message={"No Product Found."} />
          )}
        </div>
      )}
      {productsState.loading && <LoadingProgress />}
      {productsState.error && <ErrorMessage message={productsState.error} />}
    </section>
  );
}
