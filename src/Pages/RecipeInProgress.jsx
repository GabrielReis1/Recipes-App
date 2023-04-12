import { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { LsDone, LsProgress } from '../Services/localStorageFuncs';
import { useFilter } from '../Contexts/ProviderFilter';
import ShareButton from '../Components/ShareButton';
import FavoriteButton from '../Components/FavoriteButton';

import './recipeinprogress.css';
import '../Components/recipes.css';

function RecipeInProgress() {
  const { pathname } = useLocation();
  const type = pathname.includes('drinks') ? 'drinks' : 'meals';
  const { detailRecipes, setRecipeId } = useFilter();
  const [ingredients, setIngredients] = useState([]);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const defaultLoad = () => {
      if (type === 'meals') {
        setRecipeId({ id, type: 'Meal' });
      } else { setRecipeId({ id, type: 'Drink' }); }
    };

    const getRecipe = () => {
      const recipe = LsProgress();
      setIngredients(recipe[type][id]);
    };

    defaultLoad();
    getRecipe();
  }, []);

  function handleFinishRecipe() {
    LsDone('done', id, type, detailRecipes);
    history.push('/done-recipes');
  }

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
          { detailRecipes.Alcoholic === 'Alcoholic'
            ? `${detailRecipes.strCategory} - ${detailRecipes.strAlcoholic}`
            : detailRecipes.strCategory }
        </p>
      </header>
      <section className="recipe-details">
        <div className="recipe-header">
          <h1 data-testid="recipe-title">
            { detailRecipes.strMeal || detailRecipes.strDrink }

          </h1>
          <ShareButton
            type={ type }
            id={ id }
          />
          <FavoriteButton
            type={ type }
            id={ id }
            detailRecipes={ detailRecipes }
          />
        </div>

        <section className="ingredients-list">
          <h2>Ingredients</h2>
          <ul>
            { ingredients?.map((ingredient, idx) => (
              <li
                data-testid={ `${idx}-ingredient-name-and-measure` }
                key={ idx }
              >
                { detailRecipes[ingredient] }
                {' '}
                { detailRecipes[`strMeasure${idx + 1}`] }
              </li>
            ))}
          </ul>
        </section>
        <section className="instructions">
          <h2>Instructions</h2>
          <p data-testid="instructions">{ detailRecipes.strInstructions }</p>
        </section>
      </section>
      <button
        type="button"
        data-testid="finish-recipe-btn"
        onClick={ handleFinishRecipe }
      >
        Finish Recipe
      </button>
    </section>
  );
}

export default RecipeInProgress;
