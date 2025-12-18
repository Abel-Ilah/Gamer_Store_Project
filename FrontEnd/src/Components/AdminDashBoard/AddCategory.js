import "./AddCategory.css";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export function AddCategory({ setOpen, category = null }) {
  const [name, setName] = useState(category ? category.name : "");
  const [file, setFile] = useState(
    category ? { name: getImageNameFromURl(category.imagePath) } : null
  );
  const [errors, setErrors] = useState([]);
  // Drop image settings :
  const onDrop = useCallback((acceptedFiles) => {
    const image = acceptedFiles[0];

    if (image) {
      image.preview = URL.createObjectURL(image);
      setFile(image);
      console.log(image);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [] },
    multiple: false, // only one image
  });
  function clearImage() {
    if (file) setFile(null);
  }
  // ================
  const handleClickAway = () => {
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  function validateInputs() {
    let errs = [];

    if (!name) errs.push("category name required");

    if (!file) errs.push("category image required");

    setErrors(errs);
    return errs.length > 0;
  }
  function getImageNameFromURl(imagePath = "") {
    return imagePath
      ? imagePath.substring(imagePath.lastIndexOf("/") + 1, imagePath.length)
      : "";
  }
  return (
    <div className="add-category-page">
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="content">
          <h3 className="add-category-title">Add Category</h3>
          {/* handle errors */}
          {errors.length > 0 && (
            <div className="styled-input-errors">
              {errors.map((e) => (
                <p>{"--> " + e}</p>
              ))}
            </div>
          )}
          {/* ========== */}
          <h5 className="category-id mt-4">
            ID : {category === null ? "#" : category.id}
          </h5>
          <form>
            {/* name */}
            <TextField
              fullWidth
              placeholder="Category name..."
              className="styled-input category-name"
              slotProps={{ htmlInput: { maxLength: 50 } }}
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <div className="category-image mt-4">
              <div className="drop-zone" {...getRootProps()}>
                <input {...getInputProps()} />

                <p className="text">
                  {file
                    ? `${file.name}`
                    : isDragActive
                    ? "Drop the Category image here..."
                    : "Drag & drop image here, or click to select"}
                </p>
              </div>

              <IconButton
                className="clear-btn mt-1 px-0"
                onClick={clearImage}
                disabled={file === null}
              >
                <DeleteIcon className={file ? "enabled" : "disabled"} />
              </IconButton>
            </div>
            <div className="btns-wraper d-flex justify-content-end gap-2">
              <Button
                className="cancel"
                variant="contained"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  validateInputs();
                }}
                type="submit"
                className="add"
                variant="contained"
              >
                {category === null ? "Add" : "Update"}
              </Button>
            </div>
          </form>
        </div>
      </ClickAwayListener>
    </div>
  );
}
