import "./Search.css";
import React, { useEffect, useRef, useState } from "react";
import { Select, MenuItem, TextField, Button, colors } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useCategories } from "../contexts/CategoriesProvider";
import { useDispatch } from "react-redux";
import { searchForProducts } from "../features/products/productsSlice";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Link, useNavigate } from "react-router-dom";

export function Search() {
  const Categories = useCategories();
  const [selectedcategory, setSelectedCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isNewSearch, setIsNewSearch] = useState(true);

  const [productsState, setProductsState] = useState({
    products: null,
    loading: false,
    error: null,
    success: false,
  });
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (searchText.trim().length < 3) return;
    const handler = setTimeout(() => {
      handleSearch(selectedcategory, searchText);
    }, 1100);
    return () => {
      console.log("search canceled");
      clearTimeout(handler);
    };
  }, [selectedcategory, searchText, dispatch]);

  useEffect(() => {
    if (isNewSearch && (productsState.success || productsState.error)) {
      cachLastSearch(selectedcategory, searchText);
    }
  }, [productsState, isNewSearch]);

  const lastSearchRef = useRef({ categoryName: "", searchText: "" });
  const navigate = useNavigate();
  //handlers :
  const handleCategoryChange = (event) => {
    if (event.target.value !== selectedcategory) {
      setSelectedCategory(event.target.value);
    }
  };

  const getCategoryIdByName = (name) => {
    if (!Categories || !name || name === "" || name === "all") return 0;
    let id = 0;

    for (let i = 0; i < Categories.length; i++) {
      if (Categories[i].name === name) {
        id = Categories[i].id;
        break;
      }
    }
    return id;
  };
  const cachLastSearch = (categoryName, searchText) => {
    let lastCachedResults = JSON.parse(sessionStorage.getItem("search"));
    if (lastCachedResults) {
      if (lastCachedResults.length >= 50) {
        lastCachedResults.pop();
      }
      lastCachedResults.unshift({
        categoryName,
        searchText,
        status: productsState,
      });
      sessionStorage.setItem("search", JSON.stringify(lastCachedResults));
    } else
      sessionStorage.setItem(
        "search",
        JSON.stringify([{ categoryName, searchText, status: productsState }])
      );
  };

  const handleSearch = (categoryName, searchText) => {
    searchText = searchText.trim();
    if (searchText.length >= 3) {
      setProductsState({
        loading: true,
        error: null,
        success: false,
        products: null,
      });

      const cachedResults = JSON.parse(sessionStorage.getItem("search"));

      if (cachedResults && cachedResults.length > 0) {
        for (const result of cachedResults) {
          if (
            result.categoryName.toLowerCase().trim() ===
              categoryName.toLowerCase().trim() &&
            result.searchText.toLowerCase().trim() ===
              searchText.toLowerCase().trim()
          ) {
            setProductsState(result.status);
            setIsNewSearch(false);
            lastSearchRef.current = { categoryName, searchText };
            console.log("old search found : ", result);
            return;
          }
        }
      }

      setIsNewSearch(true);
      const categoryId = getCategoryIdByName(categoryName);
      dispatch(searchForProducts({ name: searchText, categoryId: categoryId }))
        .unwrap()
        .then((products) => {
          console.log("neww dispatch called ");
          console.log(`category : ${categoryName} | text : ${searchText}`);
          console.log(`result : `, products);
          setProductsState({
            loading: false,
            error: null,
            success: true,
            products: products,
          });
          lastSearchRef.current = { categoryName, searchText };
        })
        .catch((err) => {
          setProductsState({
            loading: false,
            error: err,
            success: false,
            products: null,
          });
          lastSearchRef.current = { categoryName, searchText };
        });
    }
  };

  const handleSearchBtnClick = (e) => {
    const isSameSearch = () =>
      productsState &&
      (productsState.success || productsState.error) &&
      searchText.trim().length >= 3 &&
      searchText === lastSearchRef.current.searchText &&
      selectedcategory === lastSearchRef.current.categoryName;

    if (isSameSearch) {
      e.preventDefault();
      return;
    }

    handleSearch(selectedcategory, searchText);
  };

  const handleClickAway = () => {
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function getProductImage(url, transform = "w_100,c_fill,q_auto,f_auto") {
    return url.length > 0
      ? url.replace("/upload/", `/upload/${transform}/`)
      : "/public/assets/pc-gamer1.png";
  }

  const handleTextChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value && e.target.value.length >= 3) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="search-cmp">
        <Select
          className="select"
          variant="standard"
          disableUnderline
          value={selectedcategory}
          onChange={(e) => {
            handleCategoryChange(e);
          }}
          onClick={() => {
            searchText && searchText.length >= 3
              ? setOpen(true)
              : setOpen(false);
          }}
          size="small"
          MenuProps={{
            getContentAnchorEl: null,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            PaperProps: {
              style: {
                width: "auto",
                minWidth: "150px",
              },
            },
          }}
        >
          <MenuItem key={0} value="all">
            All
          </MenuItem>
          {Array.isArray(Categories) &&
            Categories.map((c) => {
              return (
                <MenuItem value={c.name} key={c.id}>
                  {c.name}
                </MenuItem>
              );
            })}
        </Select>

        <TextField
          className="search-text"
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          value={searchText}
          onChange={(e) => {
            handleTextChange(e);
          }}
          size="small"
          placeholder="Search for products..."
          onFocus={() => {
            searchText && searchText.length >= 3
              ? setOpen(true)
              : setOpen(false);
          }}
        />

        <Button
          className="search-btn"
          variant="contained"
          onClick={(e) => handleSearchBtnClick(e)}
        >
          <SearchIcon />
        </Button>

        {open &&
          (productsState.loading ||
            productsState.success ||
            productsState.error) && (
            <div className="results-menu">
              {productsState.loading && (
                <div className="loading">
                  <span className="circle"></span>
                </div>
              )}
              {productsState.error && (
                <h5 style={{ textAlign: "start" }}>⚠️ {productsState.error}</h5>
              )}
              {productsState.success && productsState.products.length > 0 && (
                <div>
                  {productsState.products.map((p) => {
                    return (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        onClick={() => {
                          handleClose();
                        }}
                      >
                        <div className="item">
                          <img
                            src={getProductImage(p.imageUrl)}
                            alt="product"
                          />
                          <div className="content">
                            <h4 className="product-name">{p.name}</h4>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
      </div>
    </ClickAwayListener>
  );
}
