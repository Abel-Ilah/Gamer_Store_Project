import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const CategoriesContext = createContext([]);

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5268/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        // setCategories([]);
        console.log("error : ", error);
      });
  }, []);

  return (
    <CategoriesContext.Provider value={categories}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);
