import { useContext } from "react";
import { CATEGORIES_CONTEXT } from "../context/categories";

export const useCategories = () => {
  const categories = useContext(CATEGORIES_CONTEXT);
  if (!categories) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return categories;
}
