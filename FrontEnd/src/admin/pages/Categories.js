import "./Categories.css";
import {
  Button,
  IconButton,
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
import { ManageCategory } from "../components/ManageCategory";
import { useState } from "react";
import BackButton from "../../common/components/BackButton";
import { useDispatch, useSelector } from "react-redux";
import CustomDialog from "../../common/components/CustomDialog";
import {
  deleteCategory,
  deleteLocalCategory,
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
  const { categories, loading, error } = useSelector((state) => state.category);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dispatch = useDispatch();

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };
  function handleAddCategoryClick() {
    setSelectedCategory(null);
    setShowAddCategoryDialog(true);
  }
  function handleUpdateCategoryClick(category) {
    setSelectedCategory(category);
    setShowAddCategoryDialog(true);
  }
  function handleDeleteClick(category) {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  }

  function handleDeleteCategory(categoryId) {
    setDeleteLoading(true);
    dispatch(deleteCategory(categoryId))
      .unwrap()
      .then((_) => {
        dispatch(
          showMessage({
            message: "the category has been deleted.",
            severity: SEVERITY_SUCCESS,
          }),
        );
        dispatch(deleteLocalCategory({ categoryId: categoryId }));
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
        setDeleteLoading(false);
        setOpenDeleteDialog(false);
      });
  }

  return (
    <div className={`categories-page ${loading && "d-flex flex-column"}`}>
      <header className="d-flex justify-content-between align-items-center flex-wrap my1 gap-2">
        <div className="d-flex align-items-center gap-2">
          <BackButton />
          <h4 className="categories-section-title">Categories</h4>
        </div>
        <Button
          id="add-category-btn"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCategoryClick}
        >
          add category
        </Button>
      </header>
      {categories && (
        <>
          {" "}
          {categories.length === 0 && (
            <EmptyState message={"no category exists in the system."} />
          )}
          {categories.length > 0 && (
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
                      {categories.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.id}</TableCell>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>{c.imagePath}</TableCell>
                          <TableCell className="text-center">
                            {c.isFeatured ? "YES" : "NO"}
                          </TableCell>
                          <TableCell
                            className="d-flex flex-nowrap gap-1"
                            align="left"
                          >
                            <IconButton
                              onClick={() => handleUpdateCategoryClick(c)}
                            >
                              <EditIcon className="icon edit" />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteClick(c)}>
                              <DeleteIcon className="icon delete" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </section>
              <CustomDialog
                open={openDeleteDialog}
                message={`are you sure you want to delete this category [${selectedCategory.name}] ?`}
                confirmText="delete"
                onClose={() => handleCloseDialog()}
                confirmStartIcon={<DeleteIcon />}
                loading={deleteLoading}
                onConfirm={() => handleDeleteCategory(selectedCategory.id)}
              />
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
      {error && <ErrorMessage message={error} />}
      {loading && (
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
