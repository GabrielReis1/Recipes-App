import { useState, useContext, useMemo, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import { getById } from '../Services/ApiRequest';

export const ContextFilter = createContext();

function ProviderFilter({ children }) {
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [recipeId, setRecipeId] = useState(null);
  const [detailRecipes, setDetailRecipes] = useState({});
  const [reloadFavorites, setReloadFavorites] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (recipeId) {
        const { id, type } = recipeId;

        const url = type === 'Drink'
          ? `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
          : `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

        setDetailRecipes(await getById(url, type));
      }
    };
    fetchRecipeDetails();
  }, [recipeId]);

  const values = useMemo(() => ({
    categoryFilter,
    setCategoryFilter,
    recipeId,
    setRecipeId,
    detailRecipes,
    reloadFavorites,
    setReloadFavorites,
  }), [
    categoryFilter,
    setCategoryFilter,
    recipeId,
    setRecipeId,
    detailRecipes,
    reloadFavorites,
    setReloadFavorites,
  ]);

  return (
    <ContextFilter.Provider value={ values }>
      { children }
    </ContextFilter.Provider>
  );
}

export const useFilter = () => useContext(ContextFilter);

ProviderFilter.propTypes = { children: PropTypes.node }.isRequired;

export default ProviderFilter;
