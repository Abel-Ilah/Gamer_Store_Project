import "./Categories.css";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import RestoreIcon from "@mui/icons-material/Restore";
import ClearIcon from "@mui/icons-material/Clear";
import { ManageCategory } from "../components/ManageCategory";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import CustomDialog from "../../common/components/CustomDialog";
import {
  addLocalCategory,
  deleteCategory,
  deleteLocalCategory,
  getFilteredCategories,
  restoreCategory,
  status,
} from "../../common/slices/categorySlice";
import {
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  showMessage,
} from "../../customer/features/snackbar/SnackbarSlice";
import EmptyState from "../../common/components/EmptyState";
import ErrorMessage from "../../common/components/ErrorMessage";
import LoadingProgress from "../../common/components/LoadingProgress";

export function Categories() {
  const [categoreisState, setCategoriesState] = useState({
    loading: false,
    error: null,
    categories: [],
  });

  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [openCustomDialogDialog, setOpenCustomDialogDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [categoriesStatus, setCategoriesStatus] = useState(status.active);
  const dispatch = useDispatch();

  const action = useMemo(() => {
    return categoriesStatus ? "restore" : "delete";
  }, [categoriesStatus]);

  useEffect(() => {
    setCategoriesState({ error: null, categories: null, loading: true });
    dispatch(getFilteredCategories(categoriesStatus))
      .unwrap()
      .then((res) => {
        setCategoriesState({ error: null, loading: false, categories: res });
      })
      .catch((err) =>
        setCategoriesState({ error: err, loading: false, categories: null }),
      );
  }, [categoriesStatus, dispatch]);

  function handleAddCategoryClick() {
    setSelectedCategory(null);
    setShowAddCategoryDialog(true);
  }

  function handleUpdateCategoryClick(category) {
    setSelectedCategory(category);
    setShowAddCategoryDialog(true);
  }

  function handleDeleteOrRestoreClick(category) {
    setSelectedCategory(category);
    setOpenCustomDialogDialog(true);
  }

  function handleDeleteCategory() {
    setActionLoading(true);
    dispatch(deleteCategory(selectedCategory.id))
      .unwrap()
      .then((_) => {
        dispatch(
          showMessage({
            message: "the category has been deleted.",
            severity: SEVERITY_SUCCESS,
          }),
        );
        setCategoriesState((prev) => ({
          ...prev,
          categories: prev.categories.filter(
            (c) => c.id !== selectedCategory.id,
          ),
        }));
        dispatch(deleteLocalCategory({ categoryId: selectedCategory.id }));
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
        setActionLoading(false);
        setOpenCustomDialogDialog(false);
        setSelectedCategory(null);
      });
  }

  function handleRestoreProduct() {
    setActionLoading(true);
    dispatch(restoreCategory(selectedCategory.id))
      .unwrap()
      .then((_) => {
        dispatch(
          showMessage({
            message: "the category has been restored.",
            severity: SEVERITY_SUCCESS,
          }),
        );
        setCategoriesState((prev) => ({
          ...prev,
          categories: prev.categories.filter(
            (c) => c.id !== selectedCategory.id,
          ),
        }));
        dispatch(addLocalCategory(selectedCategory));
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
        setActionLoading(false);
        setOpenCustomDialogDialog(false);
        setSelectedCategory(null);
      });
  }

  function handleConfirm() {
    if (selectedCategory === null) return;
    if (action === "delete") {
      handleDeleteCategory();
    } else if (action === "restore") {
      handleRestoreProduct();
    }
  }

  return (
    <div
      className={`categories-page ${categoreisState.loading && "d-flex flex-column"}`}
    >
      <header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h4 className="categories-section-title">Categories</h4>
        <Button
          id="add-category-btn"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCategoryClick}
        >
          add category
        </Button>
      </header>
      <div className="category-status-filter my-3">
        <FormControl className="styled-select">
          <InputLabel className="label" id="status-label">
            Status
          </InputLabel>

          <Select
            className="select"
            labelId="status-label"
            id="status"
            value={categoriesStatus}
            label="Status"
            onChange={(e) => setCategoriesStatus(e.target.value)}
            MenuProps={{
              PaperProps: {
                className: "styled-menu",
              },
            }}
          >
            <MenuItem value={status.active}>Active</MenuItem>
            <MenuItem value={status.deleted}>Deleted</MenuItem>
          </Select>
        </FormControl>
      </div>
      {categoreisState.categories && (
        <>
          {" "}
          {categoreisState.categories.length === 0 && (
            <EmptyState message={"no category exists in the system."} />
          )}
          {categoreisState.categories.length > 0 && (
            <>
              <section className="categories-table mt-4">
                <TableContainer className="table-container styled-scrollbar">
                  <Table
                    style={{ minWidth: 600 }}
                    className="styled-table"
                    aria-label="table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">ID</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">IMG Path</TableCell>
                        <TableCell align="center">Featured</TableCell>
                        <TableCell align="left">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categoreisState.categories.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.id}</TableCell>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>{c.imagePath}</TableCell>
                          <TableCell className="text-center">
                            {c.isFeatured ? (
                              <CheckIcon className="featured" />
                            ) : (
                              <ClearIcon className="not-featured" />
                            )}
                          </TableCell>
                          <TableCell
                            className="d-flex flex-nowrap gap-1"
                            align="left"
                          >
                            {action === "delete" && (
                              <>
                                <IconButton
                                  onClick={() => handleUpdateCategoryClick(c)}
                                >
                                  <EditIcon className="icon edit" />
                                </IconButton>

                                <IconButton
                                  onClick={() => handleDeleteOrRestoreClick(c)}
                                >
                                  <DeleteIcon className="icon delete" />
                                </IconButton>
                              </>
                            )}
                            {action === "restore" && (
                              <IconButton
                                onClick={() => handleDeleteOrRestoreClick(c)}
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
              </section>
              {/* handle delete/restore category */}
              {selectedCategory && (
                <CustomDialog
                  open={openCustomDialogDialog}
                  message={`are you sure you want to ${action} this category?`}
                  confirmText={action}
                  confirmStartIcon={<DeleteIcon />}
                  onConfirm={handleConfirm}
                  onClose={() => setOpenCustomDialogDialog(false)}
                  loading={actionLoading}
                />
              )}
              {/* ================ */}
              {/* add category dialog */}
              {showAddCategoryDialog && (
                <ManageCategory
                  setOpen={setShowAddCategoryDialog}
                  category={selectedCategory}
                />
              )}
              {/* ================ */}
            </>
          )}
        </>
      )}
      {categoreisState.error && (
        <ErrorMessage message={categoreisState.error} />
      )}
      {categoreisState.loading && (
        <div
          className="d-flex justify-content-center  align-items-center"
          style={{ flexGrow: 1, height: "100%" }}
        >
          <LoadingProgress />
        </div>
      )}
    </div>
  );
}
