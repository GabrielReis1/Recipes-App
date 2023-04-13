import { useState, useEffect } from 'react';

function useRecipeInProgress(type, id) {
  const [recipeInProgress, setRecipeInProgress] = useState({});

  useEffect(() => {
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (inProgressRecipes && inProgressRecipes[type] && inProgressRecipes[type][id]) {
      setRecipeInProgress(inProgressRecipes[type][id]);
    } else {
      const initialRecipeInProgress = {
        drinks: {},
        meals: {},
      };

      if (!initialRecipeInProgress[type]) {
        initialRecipeInProgress[type] = {};
      }

      initialRecipeInProgress[type][id] = [];
      setRecipeInProgress(initialRecipeInProgress);
    }
  }, [id, type]);

  useEffect(() => {
    localStorage.setItem('inProgressRecipes', JSON.stringify(recipeInProgress));
  }, [recipeInProgress]);

  return [recipeInProgress, setRecipeInProgress];
}

export default useRecipeInProgress;
