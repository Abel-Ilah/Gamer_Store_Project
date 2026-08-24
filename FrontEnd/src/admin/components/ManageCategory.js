import "./ManageCategory.css";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, CircularProgress, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import ErrorList from "../../common/components/ErrorList";
import { GetImage } from "../../common/js/helpers";
import { useDispatch } from "react-redux";
import { addCategory, UpdateCategory } from "../../common/slices/categorySlice";
import {
  SEVERITY_SUCCESS,
  showMessage,
} from "../../customer/features/snackbar/SnackbarSlice";

export function ManageCategory({ setOpen, category = null }) {
  const [categoryState, setCategoryState] = useState({
    id: null,
    name: "",
    imagePath: null,
    imageFile: null,
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState([]);

  const mode = category ? "edit" : "add";

  const dispatch = useDispatch();

  useEffect(() => {
    if (category) {
      setCategoryState({
        id: category.id,
        name: category.name,
        isFeatured: category.isFeatured,
        imagePath: category.imagePath,
        imageFile: null,
      });
    }
  }, [category]);

  // Drop image settings :
  const onDrop = useCallback((acceptedFiles) => {
    const image = acceptedFiles[0];
    if (image) {
      image.preview = URL.createObjectURL(image);
      setCategoryState((prev) => ({
        ...prev,
        imageFile: image,
        imagePath: null,
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [] },
    multiple: false,
  });

  // ================

  const handleClose = () => {
    setOpen(false);
  };
  function validateInputs() {
    let errs = [];

    if (!categoryState.name) errs.push("category name required");

    if (
      (mode === "add" && categoryState.imageFile == null) ||
      (mode === "edit" &&
        categoryState.imageFile === null &&
        categoryState.imagePath === null)
    )
      errs.push("category image required");

    setErrors(errs);
    return errs.length === 0;
  }
  function handleNameChange(e) {
    setCategoryState((prev) => ({ ...prev, name: e.target.value }));
  }
  function handleFeaturedChange() {
    setCategoryState((prev) => ({ ...prev, isFeatured: !prev.isFeatured }));
  }
  function getImageSRC() {
    if (categoryState.imageFile !== null) {
      return categoryState.imageFile.preview;
    }
    return categoryState.imagePath
      ? GetImage(categoryState.imagePath, 300)
      : "";
  }

  function handleSaveClick() {
    if (!validateInputs()) return;
    setLoading(true);
    if (mode === "add") {
      const obj = {
        name: categoryState.name,
        isFeatured: categoryState.isFeatured,
        imageFile: categoryState.imageFile,
      };
      dispatch(addCategory(obj))
        .unwrap()
        .then(() => {
          dispatch(
            showMessage({
              message: "the new category has been added successfully.",
              severity: SEVERITY_SUCCESS,
            }),
          );
        })
        .catch((err) => setErrors([err]))
        .finally(() => setLoading(false));
    } else if (mode === "edit") {
      const obj = {
        id: categoryState.id,
        name: categoryState.name,
        isFeatured: categoryState.isFeatured,
        imageFile: categoryState.imageFile,
      };
      dispatch(UpdateCategory(obj))
        .unwrap()
        .then(() => {
          dispatch(
            showMessage({
              message: "the category has been updated",
              severity: SEVERITY_SUCCESS,
            }),
          );
        })
        .catch((err) => setErrors([err]))
        .finally(() => setLoading(false));
    }
  }
  return (
    <div className="add-category-page">
      <div className="content">
        <h3 className="add-category-title">{mode} Category</h3>
        {/* handle errors */}
        {errors.length > 0 && <ErrorList errors={errors} />}
        {/* ========== */}
        {category?.id && (
          <h5 className="category-id mt-4">ID : {category.id}</h5>
        )}
        <form>
          <fieldset disabled={loading}>
            {/* name */}
            <TextField
              fullWidth
              placeholder="Category name..."
              className="styled-input category-name"
              slotProps={{ htmlInput: { maxLength: 50 } }}
              value={categoryState.name}
              onChange={(e) => handleNameChange(e)}
            />
            <div className="category-image-wraper mt-4">
              {(categoryState.imagePath || categoryState.imageFile) && (
                <div className="image-preview">
                  <img className="image" src={getImageSRC()} alt="preview" />
                </div>
              )}

              <div className="drop-zone" {...getRootProps()}>
                <input {...getInputProps()} />

                <p className="text">
                  {isDragActive
                    ? "Drop the Category image here..."
                    : "Drag & drop image here, or click to select"}
                </p>
              </div>
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    className="featured-checkbox"
                    checked={categoryState.isFeatured}
                    onChange={handleFeaturedChange}
                  />
                }
                label="Featured"
              />
            </div>
            <div className="btns-wraper d-flex justify-content-end gap-2">
              <Button
                className={`cancel ${loading && "disabled"}`}
                variant="contained"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                startIcon={
                  loading ? (
                    <CircularProgress color="inherit" size={17} />
                  ) : (
                    <SaveIcon />
                  )
                }
                onClick={() => handleSaveClick()}
                className={`save ${loading && "disabled"}`}
                variant="contained"
              >
                {loading ? "Loading" : " Save"}
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
