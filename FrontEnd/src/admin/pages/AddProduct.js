import "./AddProduct.css";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import { useState, useCallback } from "react";
import settings from "../../appsettings.json";
import { useDropzone } from "react-dropzone";

export function AddNewProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("all");
  const [details, setDetails] = useState([{ key: "", value: "" }]);
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState([]);

  function handleKeyChange(index, newKey) {
    setDetails((prevDetails) =>
      prevDetails.map((detail, i) =>
        i === index ? { ...detail, key: newKey } : detail
      )
    );
  }

  function handleValueChange(index, newValue) {
    setDetails((prevDetails) =>
      prevDetails.map((detail, i) =>
        i === index ? { ...detail, value: newValue } : detail
      )
    );
  }

  function handleCategoryChange(e) {
    setCategory(e.target.value);
  }

  function addDetailDisabled() {
    return details.some((detail) => !detail.key || !detail.value);
  }
  const addDetail = () => {
    setDetails([...details, { key: "", value: "" }]);
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;

    value = value.replace(/[^0-9.]/g, "");

    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    if (value.startsWith(".")) {
      value = "0" + value;
    }

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setPrice(value);
  };

  function handleQuantityChange(e) {
    let q = e.target.value;
    q = q.replace(/[^0-9]/g, "");
    setQuantity(q);
  }
  // Drop image settings :
  const [file, setFile] = useState(null);

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

  function validateInputs() {
    let errs = [];
    if (!name) {
      errs.push("Product Name required");
    }
    if (!price) {
      errs.push("Product Price required");
    }
    if (!quantity) {
      errs.push("Product Quantity required");
    }
    if (!description) {
      errs.push("Product Description required");
    }
    setErrors(errs);

    return errs.length === 0;
  }
  return (
    <div className="add-product-page">
      <h3 className="add-product-title">Add Product</h3>
      {/* errors */}
      {errors && errors.length > 0 && (
        <div className="styled-input-errors">
          {errors.map((er) => (
            <p className="item"> {"-> " + er}</p>
          ))}
        </div>
      )}
      {/* id */}
      <h5 className="product-id mt-4">ID : #</h5>
      <form>
        <div className="d-flex flex-wrap gap-4">
          <div className="left-box flex-grow-1">
            {/* name */}
            <TextField
              fullWidth
              placeholder="product name..."
              required
              className="styled-input product-name"
              slotProps={{ htmlInput: { maxLength: 100 } }}
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            {/* price and Quantity */}
            <div className="d-flex align-items-center flex-wrap gap-3 mt-4">
              <div className="price-wraper flex-grow-1">
                <TextField
                  placeholder="Price..."
                  required
                  className="styled-input input"
                  slotProps={{
                    htmlInput: { maxLength: 12, inputMode: "decimal" },
                  }}
                  value={price}
                  onChange={(e) => handlePriceChange(e)}
                />
                <span className="currency">{settings.currrency}</span>
              </div>
              <TextField
                className="styled-input quantity flex-grow-1"
                placeholder="Quantity..."
                required
                slotProps={{
                  htmlInput: { maxLength: 7, inputMode: "decimal" },
                }}
                value={quantity}
                onChange={(e) => handleQuantityChange(e)}
              />
            </div>
            {/* category */}
            <FormControl fullWidth className="styled-select mt-4">
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
                    className: "styled-menu",
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
            {/* destails */}
            <div className="product-details mt-4">
              <h6 className="details-title">Details :</h6>
              {details.map((item, index) => (
                <div key={index} className="item d-flex flex-wrap gap-3 mb-3">
                  <TextField
                    fullWidth
                    placeholder="name..."
                    required
                    className="styled-input input "
                    value={item.key}
                    slotProps={{ htmlInput: { maxLength: 50 } }}
                    onChange={(e) => handleKeyChange(index, e.target.value)}
                  />
                  <TextField
                    fullWidth
                    placeholder="value..."
                    required
                    className="styled-input input "
                    value={item.value}
                    slotProps={{ htmlInput: { maxLength: 90 } }}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                  />
                </div>
              ))}
              <Button
                disabled={addDetailDisabled()}
                onClick={addDetail}
                variant="contained"
              >
                add more
              </Button>
            </div>
          </div>
          <div className="right-box flex-grow-1">
            <TextareaAutosize
              className="description styled-scrollbar"
              maxRows={10}
              minRows={6}
              aria-label="maximum height"
              placeholder="Description..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            {/* drop image */}
            <div className="product-image mt-4">
              <div className="drop-zone" {...getRootProps()}>
                <input {...getInputProps()} />

                <p className="text">
                  {file
                    ? `${file.name}`
                    : isDragActive
                    ? "Drop the product image here..."
                    : "Drag & drop product image here, or click to select"}
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
          </div>
        </div>
        <div className="save-wraper mt-4">
          <Button
            className="save-btn"
            variant="contained"
            startIcon={<SaveIcon />}
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              validateInputs();
            }}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
