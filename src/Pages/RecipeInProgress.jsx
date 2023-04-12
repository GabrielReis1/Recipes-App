import { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { LsDone } from '../Services/localStorageFuncs';
import { useFilter } from '../Contexts/ProviderFilter';
import ShareButton from '../Components/ShareButton';
import FavoriteButton from '../Components/FavoriteButton';

import './recipeinprogress.css';
import '../Components/recipes.css';

function RecipeInProgress() {
  const { id } = useParams();
  const history = useHistory();
  const { pathname } = useLocation();
  const type = pathname.includes('drinks') ? 'drinks' : 'meals';
  const { detailRecipes, setRecipeId } = useFilter();
  const [checkedIngredients, setCheckedIngredients] = useState(['']);

  useEffect(() => {
    const defaultLoad = () => {
      if (type === 'meals') {
        setRecipeId({ id, type: 'Meal' });
      } else {
        setRecipeId({ id, type: 'Drink' });
      }
    };

    const getProgressRecipe = () => {
      const progressKey = `${type}-${id}`;
      const progress = JSON.parse(localStorage.getItem('inProgressRecipes')) || {};
      const savedCheckedIngredients = progress[progressKey] || [];
      setCheckedIngredients(savedCheckedIngredients);
    };

    defaultLoad();
    getProgressRecipe();
  }, []);

  const ingredients = detailRecipes
      && Object.keys(detailRecipes)
        .filter((ingredient) => ingredient.includes('strIngredient')
        && detailRecipes[ingredient]);

  function handleIngredientClick(event) {
    const ingredient = event.target.value;
    const isChecked = event.target.checked;

    const newCheckedIngredients = isChecked
      ? [...checkedIngredients, ingredient]
      : checkedIngredients.filter((i) => i !== ingredient);

    const progressKey = `${type}-${id}`;
    const progress = JSON.parse(localStorage.getItem('inProgressRecipes')) || {};

    if (progress[progressKey]?.includes(ingredient)) {
      progress[progressKey] = progress[progressKey].filter((i) => i !== ingredient);
    } else {
      progress[progressKey] = newCheckedIngredients;
    }

    localStorage.setItem('inProgressRecipes', JSON.stringify(progress));
    setCheckedIngredients(newCheckedIngredients);
  }

  function handleFinishRecipe() {
    LsDone('done', id, type, detailRecipes);
    history.push('/done-recipes');
  }

  const allIngredientsChecked = checkedIngredients.length === ingredients.length
  && (localStorage.getItem('inProgressRecipes')
    ? checkedIngredients.every((ingredient) => {
      const progress = JSON.parse(localStorage.getItem('inProgressRecipes')) || {};
      const progressKey = `${type}-${id}`;
      return progress[progressKey]?.includes(ingredient);
    })
    : true);

  const style = 'line-through solid rgb(0, 0, 0)';

  return (
    <section className="details">
      <article className="details-img-bg">
        <img
          src={ detailRecipes.strMealThumb || detailRecipes.strDrinkThumb }
          alt={ detailRecipes.strMeal || detailRecipes.strDrink }
          data-testid="recipe-photo"
          className="details-img"
        />
      </article>

      <header className="details-header">
        <p data-testid="recipe-category" className="details-category">
          { detailRecipes.strAlcoholic === 'Alcoholic'
            ? `${detailRecipes.strCategory} - ${detailRecipes.strAlcoholic}`
            : detailRecipes.strCategory }
        </p>

        <div>
          <ShareButton
            type={ type }
            id={ id }
            testeId="share-btn"
          />

          <FavoriteButton
            type={ type }
            id={ id }
            detailRecipes={ detailRecipes }
            testeId="favorite-btn"
          />
        </div>
      </header>

      <h1 className="details-title" data-testid="recipe-title">
        { detailRecipes.strMeal || detailRecipes.strDrink }
      </h1>

      <fieldset>
        <legend>Ingredients</legend>
        <ul>
          { ingredients.map((ingredient, idx) => {
            const isChecked = checkedIngredients.includes(ingredient);
            return (
              <li key={ idx }>
                <label
                  data-testid={ `${idx}-ingredient-step` }
                  style={ isChecked ? { textDecoration: style } : {} }
                >
                  <input
                    type="checkbox"
                    value={ ingredient }
                    checked={ isChecked }
                    onChange={ handleIngredientClick }
                  />
                  {detailRecipes[ingredient]}
                  {' '}
                  {detailRecipes[`strMeasure${idx + 1}`]}
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset>
        <legend>Instructions</legend>
        <p data-testid="instructions">{ detailRecipes.strInstructions }</p>
      </fieldset>

      <button
        type="button"
        data-testid="finish-recipe-btn"
        onClick={ () => handleFinishRecipe() }
        disabled={ !allIngredientsChecked }
      >
        Finish Recipe
      </button>
    </section>
  );
}

export default RecipeInProgress;
