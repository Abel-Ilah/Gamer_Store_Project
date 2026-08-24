import "./Customers.css";
import "../../../styles/StyledTable.css";
import "../../../styles/StyledSelect.css";

import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import CustomDialog from "../../../../common/components/CustomDialog";
import LoadingProgress from "../../../../common/components/LoadingProgress";
import ErrorMessage from "../../../../common/components/ErrorMessage";
import EmptyState from "../../../../common/components/EmptyState";
import {
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  showMessage,
} from "../../../../customer/features/snackbar/SnackbarSlice";

import {
  deleteCustomer,
  filterCustomers,
  restoreCustomer,
} from "../APIs/AdminCustomerAPIs";

export function Customers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [customersState, setCustomersState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 20,
    search: "",
    deleted: false,
  });
  const [customersCount, setCustomersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const totalPages = useMemo(() => {
    return Math.ceil(customersCount / filter.pageSize);
  }, [customersCount, filter.pageSize]);

  useEffect(() => {
    setCustomersState({
      data: null,
      loading: true,
      error: null,
    });

    dispatch(filterCustomers(filter))
      .unwrap()
      .then((data) => {
        setCustomersState({
          loading: false,
          error: null,
          data,
        });
        setCustomersCount(data.count);
      })
      .catch((error) => {
        setCustomersState((prev) => ({
          ...prev,
          loading: false,
          error,
        }));
      });
  }, [dispatch, filter]);

  const action = useMemo(() => {
    return filter.deleted ? "restore" : "delete";
  }, [filter.deleted]);

  function handleSearch() {
    setFilter((prev) => ({ ...prev, search: searchText, pageNumber: 1 }));
  }

  function handlePageChange(_, page) {
    setFilter((prev) => ({ ...prev, pageNumber: page }));
  }

  function handleOpenDeleteDialog(customerId) {
    setSelectedCustomerId(customerId);
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    setSelectedCustomerId(null);
  }

  function handleDeleteCustomer() {
    if (!selectedCustomerId) return;

    setLoading(true);

    dispatch(deleteCustomer(selectedCustomerId))
      .unwrap()
      .then(() => {
        dispatch(
          showMessage({
            message: "the customer has been deleted",
            severity: SEVERITY_SUCCESS,
          }),
        );
        setCustomersState((prev) => ({
          ...prev,
          data: {
            customers: prev.data.customers.filter(
              (c) => c.id !== selectedCustomerId,
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
      .finally(() => {
        setLoading(false);
        handleCloseDialog();
      });
  }
  function handleRestoreCustomer() {
    if (!selectedCustomerId) return;

    setLoading(true);

    dispatch(restoreCustomer(selectedCustomerId))
      .unwrap()
      .then(() => {
        dispatch(
          showMessage({
            message: "the customer has been restored",
            severity: SEVERITY_SUCCESS,
          }),
        );
        setCustomersState((prev) => ({
          ...prev,
          data: {
            customers: prev.data.customers.filter(
              (c) => c.id !== selectedCustomerId,
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
      .finally(() => {
        setLoading(false);
        handleCloseDialog();
      });
  }
  function handleConfirmClick() {
    if (action === "delete") {
      handleDeleteCustomer();
    } else if (action === "restore") {
      handleRestoreCustomer();
    }
  }
  return (
    <section className="all-customers-section">
      <header className="">
        <h3 className="customers-section-title">Customers List</h3>
        <h6>Manage your customers and keep track of their information.</h6>
      </header>
      {customersState.data && (
        <div>
          {/* Search */}
          <div
            id="customers-filters"
            className="d-flex align-items-center flex-wrap gap-3 my-2"
          >
            <form className="search-customername">
              <TextField
                placeholder="customer name..."
                className="input"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <IconButton
                disabled={searchText.length > 0 && searchText.length < 3}
                className="search-btn"
                onClick={handleSearch}
              >
                <SearchOutlinedIcon />
              </IconButton>
            </form>

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
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    deleted: e.target.value,
                    pageNumber: 1,
                  }))
                }
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

          {/* Customers table */}
          {customersState.data.customers.length > 0 && (
            <>
              <div className="customers-table">
                <TableContainer className="table-container styled-scrollbar">
                  <Table className="styled-table" aria-label="customers table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell align="left">Phone</TableCell>
                        <TableCell align="left">Created At</TableCell>
                        <TableCell align="left">Actions</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {customersState.data.customers.map((customer) => (
                        <TableRow key={customer.id}>
                          {/* Customer */}
                          <TableCell>
                            <div className="customer-info">
                              <div className="customer-icon">
                                <PersonOutlineOutlinedIcon />
                              </div>

                              <div className="customer-details">
                                <p className="customer-name">
                                  {customer.firstName + " " + customer.lastName}
                                </p>

                                <span className="customer-email">
                                  {customer.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Phone */}
                          <TableCell align="left">
                            {customer.phoneNumber || "—"}
                          </TableCell>

                          {/* Created At */}
                          <TableCell align="left">
                            {customer.createdAt
                              ? new Date(
                                  customer.createdAt,
                                ).toLocaleDateString()
                              : "—"}
                          </TableCell>

                          {/* Actions */}
                          <TableCell align="left">
                            {!customer.isDeleted && (
                              <IconButton
                                onClick={() =>
                                  handleOpenDeleteDialog(customer.id)
                                }
                              >
                                <DeleteIcon className="icon delete" />
                              </IconButton>
                            )}
                            {customer.isDeleted && (
                              <IconButton
                                onClick={() =>
                                  handleOpenDeleteDialog(customer.id)
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="customers-pagination d-flex justify-content-end">
                  <Pagination
                    variant="outlined"
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
            </>
          )}

          {/* Empty */}
          {customersState.data.customers.length === 0 && (
            <EmptyState message="No Customers Found." />
          )}

          {/* delete dialog */}
          <CustomDialog
            open={openDialog}
            message={`are you sure you want to ${action} this user?`}
            confirmText={action}
            confirmStartIcon={
              action === "delete" ? <DeleteIcon /> : <RestoreIcon />
            }
            onConfirm={handleConfirmClick}
            loading={loading}
            onClose={() => setOpenDialog(false)}
          />
        </div>
      )}

      {customersState.loading && <LoadingProgress />}

      {customersState.error && <ErrorMessage message={customersState.error} />}
    </section>
  );
}
