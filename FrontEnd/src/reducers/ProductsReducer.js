import axios from "axios";
import { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { getFilter } from "../features/filter/filterSlice";

//actions:
export const GET_ALL_PRODUCTS = "GET_ALL_PRODUCTS";
export const GET_PRODUCTS_BY_CATEGORY = "GET_PRODUCTS_BY_CATEGORY";
export const GET_NEW_PRODUCTS = "GET_NEW_PRODUCTS";
export const GET_DISCOUNTED_PRODUCTS = "GET_DISCOUNTED_PRODUCTS";
export const GET_POPULAR_PRODUCTS = "GET_POPULAR_PRODUCTS";
export const GET_BEST_SELLERS = "GET_BEST_SELLERS";
export const GET_PRODUCT_BY_ID = "GET_PRODUCT_BY_ID";

export const PRODUCTS_ERROR = "PRODUCTS_ERROR";

export function ProductsReducer(state, action) {
  switch (action.type) {
    case "START":
      return { loading: true, error: null };
    case "SUCCESS":
      return { loading: false, data: action.payload, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const useProducts = function () {
  const filter = useSelector(getFilter);

  const [state, dispatch] = useReducer(ProductsReducer, initialState);
  const { actionType, actionValue } = filter.action;
  const { min, max } = filter.priceRange;
  const { pageNumber, pageSize } = filter.page;

  useEffect(() => {
    const controller = new AbortController();
    const getProducts = async () => {
      dispatch({ type: "START" });
      try {
        let url = "";
        switch (actionType) {
          case GET_ALL_PRODUCTS:
            url = `http://localhost:5268/api/products?pageNumber=${pageNumber}&pageSize=${pageSize}&minPrice=${min}&maxPrice=${max}`;
            sessionStorage.setItem("filter", JSON.stringify(filter));
            break;
          case GET_PRODUCTS_BY_CATEGORY:
            url = `http://localhost:5268/api/products/${actionValue}?pageNumber=${pageNumber}&pageSize=${pageSize}&MinPrice=${min}&MaxPrice=${max}`;
            sessionStorage.setItem("filter", JSON.stringify(filter));
            break;
          case GET_NEW_PRODUCTS:
            url = `http://localhost:5268/api/products/new-products?pageNumber=${pageNumber}&pageSize=${pageSize}&minPrice=${min}&maxPrice=${max}`;
            sessionStorage.setItem("filter", JSON.stringify(filter));
            break;
          case GET_DISCOUNTED_PRODUCTS:
            url = `http://localhost:5268/api/products/discounts?pageNumber=${pageNumber}&pageSize=${pageSize}&minPrice=${min}&maxPrice=${max}`;
            sessionStorage.setItem("filter", JSON.stringify(filter));
            break;
          case GET_POPULAR_PRODUCTS:
            url = `http://localhost:5268/api/products/popular-products`;
            sessionStorage.setItem("filter", JSON.stringify(filter));
            break;
          case GET_BEST_SELLERS:
            url = `http://localhost:5268/api/products/best-sellers?pageNumber=${pageNumber}&pageSize=${pageSize}&minPrice=${min}&maxPrice=${max}`;
            sessionStorage.setItem("filter", JSON.stringify(filter));
            break;
          default:
            url = `http://localhost:5268/api/products`;
            sessionStorage.setItem("filter", JSON.stringify(filter));
        }
        const res = await axios.get(url, { signal: controller.signal });
        dispatch({ type: "SUCCESS", payload: res.data });
      } catch (error) {
        dispatch({ type: "ERROR", payload: error.message });
      }
    };
    getProducts();
    return () => {
      controller.abort();
    };
  }, [filter]);

  return state;
};
export const use10Products = function (actionType) {
  const [state, dispatch] = useReducer(ProductsReducer, initialState);
  const min = 0,
    max = 10000000,
    pageSize = 10;
  useEffect(() => {
    const controller = new AbortController();
    const get10Products = async () => {
      dispatch({ type: "START" });
      try {
        let url = "";
        switch (actionType) {
          case GET_ALL_PRODUCTS:
            url = `http://localhost:5268/api/products?pageNumber=${1}&pageSize=${pageSize}&minPrice=${min}&maxPrice=${max}`;
            break;
          case GET_NEW_PRODUCTS:
            url = `http://localhost:5268/api/products/new-products?pageNumber=${1}&pageSize=${pageSize}&minPrice=${min}&maxPrice=${max}`;
            break;
          case GET_DISCOUNTED_PRODUCTS:
            url = `http://localhost:5268/api/products/discounts?pageNumber=${1}&pageSize=${pageSize}&minPrice=${min}&maxPrice=${max}`;
            break;
          case GET_POPULAR_PRODUCTS:
            url = `http://localhost:5268/api/products/popular-products`;
            break;
          case GET_BEST_SELLERS:
            url = `http://localhost:5268/api/products/best-sellers?pageNumber=${1}&pageSize=${pageSize}&minPrice=${min}&maxPrice=${max}`;
            break;
          default:
            url = `http://localhost:5268/api/products?pageNumber=${1}&pageSize=${10}&minPrice=${min}&maxPrice=${max}`;
        }
        const res = await axios.get(url, { signal: controller.signal });
        dispatch({ type: "SUCCESS", payload: res.data });
      } catch (error) {
        dispatch({ type: "ERROR", payload: error.message });
      }
    };
    get10Products();
    return () => {
      controller.abort();
    };
  }, []);

  return state;
};
