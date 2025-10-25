import "./Products.css";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
export function Products() {
  return (
    <section className="all-products-section">
      <header className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="products-section-title">Products List</h3>
          <h6>Track your store's progress to boost your sales.</h6>
        </div>
        <Button
          id="add-product-btn"
          variant="contained"
          startIcon={<AddIcon />}
        >
          add product
        </Button>
      </header>
      <div id="products-filters" className="mt-2">
        <div className="left-filter ">
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
        </div>
      </div>
    </section>
  );
}
