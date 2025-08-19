import axios from "axios";
import { useEffect, useReducer } from "react";

// action types :
export const GET_PRODUCT = "GET_PRODUCT";
export const ADD_NEW_PRODUCT = "ADD_NEW_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";

export const PRODUCTS_ERROR = "PRODUCTS_ERROR";

export function ProductReducer(state, action) {
  switch (action.type) {
    case "START":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return { ...state, loading: false, product: action.payload, error: null };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const initialState = {
  product: {},
  loading: false,
  error: null,
};

export const useProduct = function (action) {
  const [state, dispatch] = useReducer(ProductReducer, initialState);
  const { actionType, payload } = action;

  useEffect(() => {
    const controller = new AbortController();
    const manageProduct = async () => {
      dispatch({ type: "START" });
      let result;
      try {
        switch (actionType) {
          case GET_PRODUCT:
            const url = `http://localhost:5268/api/products/${payload}`;
            result = await axios.get(url, { signal: controller.signal });
            break;
          default:
        }
        dispatch({ type: "SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "ERROR", payload: error.message });
      }
    };

    manageProduct();

    return () => {
      controller.abort();
    };
  }, [actionType, payload]);
  return state;
};
