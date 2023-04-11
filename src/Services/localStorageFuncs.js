export function LsProgress(action, id, type, detailRecipes) {
  let getRecipesInProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
  if (!getRecipesInProgress) { getRecipesInProgress = { drinks: {}, meals: {} }; }

  const ingredients = detailRecipes
  && Object.keys(detailRecipes)
    .filter((ingredient) => ingredient.includes('strIngredient')
  && detailRecipes[ingredient]);

  switch (action) {
  case 'save':
    localStorage.setItem('inProgressRecipes', JSON.stringify({
      ...getRecipesInProgress,
      [type]: {
        ...getRecipesInProgress[type],
        [id]: ingredients,
      },
    }));
    break;
  case 'remove':
    delete getRecipesInProgress[type][id];
    localStorage.setItem('inProgressRecipes', JSON.stringify(getRecipesInProgress));
    break;

  default: return getRecipesInProgress;
  }
}

export function LsDone(action, id, type, detailRecipes) {
  const getRecipesInProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
  let getDoneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
  console.log(getDoneRecipes);
  if (!getDoneRecipes) {
    getDoneRecipes = [];
  }
  const path = type === 'meals' ? 'Meal' : 'Drink';
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear().toString();
  const doneDate = `${day}/${month}/${year}`;
  switch (action) {
  case 'done':
    localStorage.setItem('doneRecipes', JSON.stringify([
      ...getDoneRecipes, {
        id,
        type: path.toLowerCase(),
        nationality: detailRecipes.strArea || '',
        category: detailRecipes.strCategory || '',
        alcoholicOrNot: detailRecipes.strAlcoholic || '',
        name: detailRecipes[`str${path}`],
        image: detailRecipes[`str${path}Thumb`],
        doneDate,
        tags: [detailRecipes.strTags] || [],
      },
    ]));
    delete getRecipesInProgress[type][id];
    localStorage.setItem('inProgressRecipes', JSON.stringify(getRecipesInProgress));
    break;
  default: return getDoneRecipes;
  }
}

export function LsFavorite(action, id, type, detailRecipes) {
  let getFavoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
  if (!getFavoriteRecipes) { getFavoriteRecipes = []; }

  const path = type === 'meals' ? 'Meal' : 'Drink';

  switch (action) {
  case 'addFavorite':
    localStorage.setItem('favoriteRecipes', JSON.stringify([
      ...getFavoriteRecipes, {
        id,
        type: path.toLowerCase(),
        nationality: detailRecipes.strArea || '',
        category: detailRecipes.strCategory || '',
        alcoholicOrNot: detailRecipes.strAlcoholic || '',
        name: detailRecipes[`str${path}`],
        image: detailRecipes[`str${path}Thumb`],
      },
    ]));
    break;

  case 'removeFavorite':
    localStorage.setItem('favoriteRecipes', JSON.stringify(getFavoriteRecipes
      .filter((recipe) => recipe.id !== id)));
    break;

  case 'isFavorite':
    return getFavoriteRecipes.some((recipe) => recipe.id === id);

  default: return getFavoriteRecipes;
  }
}

export function verifyRecipe(id, type) {
  let getRecipesInProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
  if (!getRecipesInProgress) { getRecipesInProgress = { drinks: {}, meals: {} }; }
  console.log(getRecipesInProgress[type]);

  let getDoneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
  if (!getDoneRecipes) {
    getDoneRecipes = [];
  }
  console.log(getDoneRecipes);
  if (id in getRecipesInProgress[type] || id in getDoneRecipes) {
    const status = (id in getRecipesInProgress[type] && 'inProgress')
      || (id in getDoneRecipes[type] && 'done');

    return status;
  }

  return '';
}
