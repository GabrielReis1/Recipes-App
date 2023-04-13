const warming = 'Sorry, we haven\'t found any recipes for these filters.';

export const getMealsCategories = async () => {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
  const data = await response.json();

  return data.meals;
};

export const getMealsNationalities = async () => {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
  const data = await response.json();

  return data.meals;
};

export const searchMealsIngredients = async (ingredient) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  const data = await response.json();
  if (data.meals === null) {
    global.alert(warming);
  }

  return data.meals;
};

export const searchMealsName = async (name) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
  const data = await response.json();
  if (data.meals === null) {
    global.alert(warming);
  }

  return data.meals;
};

export const searchDrinkName = async (name) => {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
  const data = await response.json();
  if (data.drinks === null) {
    global.alert(warming);
  }

  return data.drinks;
};

export const searchMealsFirtsLetter = async (letter) => {
  if (letter.length > 1) {
    return global.alert('Your search must have only 1 (one) character');
  }
  if (letter.length === 1) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    const data = await response.json();
    if (data.meals === null) {
      global.alert(warming);
    }

    return data.meals;
  } return null;
};

export const searchDrinkFirtsLetter = async (letter) => {
  if (letter.length > 1) {
    return global.alert('Your search must have only 1 (one) character');
  }
  if (letter.length === 1) {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);
    const data = await response.json();
    if (data.drinks === null) {
      global.alert(warming);
    }

    return data.drinks;
  } return null;
};

export const searchDrinkIngredient = async (ingredient) => {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  const data = await response.json();
  if (data.drinks === null) {
    global.alert(warming);
  }

  return data.drinks;
};

export const getMealsRecipes = async () => {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  const data = await response.json();

  return data.meals;
};

export const getDrinksRecipes = async () => {
  const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
  const data = await response.json();

  return data.drinks;
};

export const getDrinksCategories = async () => {
  const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
  const data = await response.json();

  return data.drinks;
};

export const getByCategory = async (url, path) => {
  const response = await fetch(url);
  const data = await response.json();

  return path === 'Meal' ? data.meals : data.drinks;
};

export const getById = async (url, type) => {
  const response = await fetch(url);
  const data = await response.json();

  return type === 'Meal' ? data.meals[0] : data.drinks[0];
};

export const getRecipeById = async (type, id) => {
  const endpoint = type === 'meals'
    ? `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    : `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data[type][0];
  } catch (error) {
    console.log(error);
    return null;
  }
};
