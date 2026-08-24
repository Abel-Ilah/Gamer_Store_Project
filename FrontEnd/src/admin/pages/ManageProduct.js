import "./ManageProduct.css";
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import settings from "../../appsettings.json";
import { findProduct } from "../features/product/APIs/ProductAPIs";
import { GetImage } from "../../common/js/helpers";
import {
  addNewProduct,
  updateProduct,
} from "../../customer/features/product/slices/productsSlice";
import {
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  showMessage,
} from "../../customer/features/snackbar/SnackbarSlice";
import ErrorList from "../../common/components/ErrorList";
import BackButton from "../../common/components/BackButton";
export function ManageProduct() {
  // handle states ===========
  //this state holde the original product in edit mode:
  const [productState, setProductState] = useState({
    product: null,
    loading: false,
    error: null,
  });

  //this state handle inputs
  const [product, setProduct] = useState({
    id: null,
    name: "",
    price: "",
    quantity: "",
    categoryId: "",
    details: [{ name: "", value: "" }],
    description: "",
  });

  const [images, setImages] = useState([]);

  const [requestPending, setRequestPending] = useState(false);

  const [errors, setErrors] = useState([]);

  const { categories } = useSelector((state) => state.category);

  const { productId } = useParams();

  const dispatch = useDispatch();

  const mode = productId ? "edit" : "add";
  const maxImages = 4;
  //==========================

  useEffect(() => {
    if (productId && productId > 0) {
      setProductState({ loading: true, product: null, error: null });
      dispatch(findProduct(productId))
        .unwrap()
        .then((pr) => {
          setProductState({ loading: false, product: pr, error: null });
          fillInputsWithProductInfo(pr);
        })
        .catch((err) => {
          setProductState({ loading: false, product: null, error: err });
        });
    }
  }, [productId, dispatch]);

  // handlers ===========

  function fillInputsWithProductInfo(product) {
    if (product) {
      setProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
        categoryId: product.categoryId,
        details: product.details,
      });
      setImages([...product.images]);
    }
  }

  function handleProductNameChange(name) {
    setProduct((prev) => ({ ...prev, name: name ?? "" }));
  }

  function handleDescriptionChange(text) {
    setProduct((prev) => ({ ...prev, description: text ?? "" }));
  }

  function handleDetailsNameChange(index, newKey) {
    setProduct((prev) => ({
      ...prev,
      details: prev.details.map((item, i) =>
        i === index ? { ...item, name: newKey } : item,
      ),
    }));
  }

  function handleDetailsValueChange(index, newValue) {
    setProduct((prev) => ({
      ...prev,
      details: prev.details.map((item, i) =>
        i === index ? { ...item, value: newValue } : item,
      ),
    }));
  }

  function handleCategoryChange(e) {
    setProduct((prev) => ({ ...prev, categoryId: e.target.value }));
  }

  function addDetailDisabled() {
    return product.details.some((detail) => !detail.name || !detail.value);
  }

  const addDetail = () => {
    setProduct((prev) => ({
      ...prev,
      details: [...prev.details, { name: "", value: "" }],
    }));
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;

    value = value.replace(/[^0-9.]/g, "");

    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    if (value.startsWith(".")) {
      value = "";
    }

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setProduct((prev) => ({ ...prev, price: value }));
  };

  function handleQuantityChange(e) {
    let q = e.target.value;
    q = q.replace(/[^0-9]/g, "");
    setProduct((prev) => ({ ...prev, quantity: q }));
  }

  const onDrop = useCallback((acceptedFiles) => {
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      setImages((prev) => [
        ...prev,
        {
          id: null,
          imageUrl: URL.createObjectURL(imageFile),
          isMain: prev.length === 0,
          file: imageFile,
          isNew: true,
        },
      ]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [] },
    multiple: false, // only one image
  });

  function removeImage(index) {
    setImages((prev) => {
      const removedImage = prev[index];
      const imgs = prev.filter((_, i) => i !== index);

      if (removedImage?.isMain && imgs.length > 0) {
        imgs[0] = {
          ...imgs[0],
          isMain: true,
        };
      }

      return imgs;
    });
  }

  function getImageSrc(image) {
    return !image.isNew
      ? GetImage(image.imageUrl, 400)
      : image.file
        ? image.imageUrl
        : "";
  }

  function validateInputs() {
    let errs = [];
    if (!product.name.trim()) {
      errs.push("Product Name required");
    }
    if (!product.price || Number(product.price) <= 0) {
      errs.push("Product Price required");
    }
    if (
      product.quantity === "" ||
      product.quantity === null ||
      Number(product.quantity) < 0
    ) {
      errs.push("Product Quantity required");
    }
    if (!product.description.trim()) {
      errs.push("Product Description required");
    }
    if (!product.categoryId || Number(product.categoryId) <= 0) {
      errs.push("Product Category required");
    }

    if (images.length === 0) {
      errs.push("Product image required");
    }

    const hasIncompleteDetail = product.details.some((item) => {
      const hasName = item.name.trim().length > 0;
      const hasValue = item.value.trim().length > 0;

      return hasName !== hasValue;
    });

    if (hasIncompleteDetail) {
      errs.push(
        "Some Product details are incomplete. Please fill in both the name and value.",
      );
    }

    setErrors(errs);

    return errs.length === 0;
  }

  function clearProduct() {
    setProduct({
      id: null,
      name: "",
      price: "",
      quantity: 0,
      categoryId: "",
      details: [{ name: "", value: "" }],
      description: "",
    });
  }

  function handleSaveProduct() {
    if (!validateInputs()) return;
    setRequestPending(true);
    if (mode === "add") {
      const p = {
        name: product.name,
        description: product.description,
        details: product.details.filter(
          (item) => item.name.trim().length > 0 && item.value.trim().length > 0,
        ),
        price: Number(product.price),
        quantity: Number(product.quantity),
        categoryId: Number(product.categoryId),
        images: images.map((img) => {
          return { image: img.file, isMain: img.isMain };
        }),
      };
      dispatch(addNewProduct(p))
        .unwrap()
        .then((addedProductId) => {
          dispatch(
            showMessage({
              message: `The product has been added with ID : #${addedProductId}`,
              severity: SEVERITY_SUCCESS,
            }),
          );
          clearProduct();
        })
        .catch((err) => {
          dispatch(
            showMessage({
              message: err,
              severity: SEVERITY_ERROR,
            }),
          );
          setErrors([err]);
        })
        .finally(() => {
          setRequestPending(false);
        });
    } else {
      const p = {
        id: product.id,
        name: product.name,
        description: product.description,
        details: product.details.filter(
          (item) => item.name.trim().length > 0 && item.value.trim().length > 0,
        ),
        price: Number(product.price),
        quantity: Number(product.quantity),
        categoryId: Number(product.categoryId),
        images: images.map((img) => {
          return { id: img.id, image: img.file, isMain: img.isMain };
        }),
      };
      dispatch(updateProduct(p))
        .unwrap()
        .then(() => {
          dispatch(
            showMessage({
              message: `The product has been updated.`,
              severity: SEVERITY_SUCCESS,
            }),
          );
        })
        .catch((err) => {
          dispatch(
            showMessage({
              message: err,
              severity: SEVERITY_ERROR,
            }),
          );
          setErrors([err]);
        })
        .finally(() => {
          setRequestPending(false);
        });
    }
  }

  //==========================

  return (
    <div className="add-product-page">
      <h4 className="add-product-title">
        <BackButton />
        {productId ? "Edit" : "Add"} Product
      </h4>
      {/* errors */}
      {errors.length > 0 && <ErrorList errors={errors} />}
      {/* id */}
      {mode === "edit" && <h5 className="product-id">#{productId}</h5>}
      <form>
        <fieldset disabled={productState.loading || requestPending}>
          <div className="d-flex flex-column flex-md-row flex-wrap gap-4">
            <div className="left-box ">
              {/* name */}
              <TextField
                fullWidth
                placeholder="product name..."
                required
                className="styled-input product-name"
                slotProps={{ htmlInput: { maxLength: 100 } }}
                value={product.name}
                onChange={(e) => handleProductNameChange(e.currentTarget.value)}
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
                    value={product.price}
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
                  value={product.quantity}
                  onChange={(e) => handleQuantityChange(e)}
                />
              </div>
              {/* category */}
              {categories && (
                <FormControl fullWidth className="styled-select mt-4">
                  <InputLabel className="label" id="demo-simple-select-label">
                    category
                  </InputLabel>
                  <Select
                    className="select"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={product.categoryId}
                    label="category"
                    onChange={(e) => handleCategoryChange(e)}
                    MenuProps={{
                      PaperProps: {
                        className: "styled-menu",
                      },
                    }}
                  >
                    {categories.map((c) => (
                      <MenuItem key={c.id} className="item" value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {/* destails */}
              <div className="product-details-property mt-4">
                <h6 className="details-title">Details :</h6>
                {product.details.map((item, index) => (
                  <div
                    key={index}
                    className="details-item d-flex flex-xs-column flex-sm-row flex-wrap mb-2"
                  >
                    <TextField
                      fullWidth
                      placeholder="name..."
                      required
                      className="styled-input input"
                      value={item.name}
                      slotProps={{ htmlInput: { maxLength: 50 } }}
                      onChange={(e) =>
                        handleDetailsNameChange(index, e.target.value)
                      }
                    />
                    <div className="linker"></div>
                    <TextField
                      fullWidth
                      placeholder="value..."
                      required
                      className="styled-input input"
                      value={item.value}
                      slotProps={{ htmlInput: { maxLength: 90 } }}
                      onChange={(e) =>
                        handleDetailsValueChange(index, e.target.value)
                      }
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

            <div className="right-box ">
              <TextareaAutosize
                className="description styled-scrollbar"
                maxRows={10}
                minRows={6}
                aria-label="maximum height"
                placeholder="Description..."
                value={product.description}
                onChange={(e) => {
                  handleDescriptionChange(e.target.value);
                }}
              />

              {/*=====manage images===== */}

              <div className="manage-images mt-4">
                {images.length > 0 && (
                  <div className="images-grid">
                    {images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img
                          className="image"
                          src={getImageSrc(image)}
                          alt="preview"
                        />
                        <div className="image-actions">
                          <FormControlLabel
                            className="main-image-radio"
                            control={
                              <Radio
                                checked={image.isMain}
                                onChange={() => {
                                  setImages((prev) =>
                                    prev.map((img, i) => ({
                                      ...img,
                                      isMain: i === index,
                                    })),
                                  );
                                }}
                              />
                            }
                            label="Main image"
                          />
                          <Button
                            className="delete-image-btn mt-1 px-0"
                            onClick={() => removeImage(index)}
                            startIcon={<DeleteIcon />}
                          >
                            remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {images.length < maxImages && (
                  <div className="drop-zone" {...getRootProps()}>
                    <input {...getInputProps()} />

                    <p className="text">
                      {isDragActive
                        ? "Drop the product image here..."
                        : "Drag & drop product image here, or click to select"}
                    </p>
                  </div>
                )}
              </div>
              {/* ======================*/}
            </div>
          </div>
          <div className="save-wraper mt-4">
            <Button
              className="save-btn"
              variant="contained"
              startIcon={
                requestPending ? (
                  <CircularProgress size={15} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={handleSaveProduct}
              disabled={requestPending}
            >
              {requestPending ? "loading" : "save"}
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
