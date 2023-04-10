import { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { getRecipeById, getIngredientAndMeasureList } from '../Services/ApiRequest';
import useRecipeInProgress from '../hooks/useRecipeInProgress';
import ShareButton from '../Components/ShareButton';
import FavoriteButton from '../Components/FavoriteButton';
import './recipeinprogress.css';

function RecipeInProgress() {
  const { id } = useParams();
  const history = useHistory();
  const { pathname } = useLocation();
  const [recipe, setRecipe] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');
  const type = pathname.includes('drinks') ? 'drinks' : 'meals';
  const [recipeInProgress, setRecipeInProgress] = useRecipeInProgress(type);
  const [
    checkedIngredients,
    setCheckedIngredients,
  ] = useState(Array(ingredients.length).fill(false));

  useEffect(() => {
    async function fetchRecipe() {
      const fetchedRecipe = await getRecipeById(type, id);
      setRecipe(fetchedRecipe);
      setIngredients(getIngredientAndMeasureList(fetchedRecipe));
      setInstructions(fetchedRecipe.strInstructions);
    }

    fetchRecipe();
  }, [id, type]);

  function handleFinishRecipe() {
    const inProgressRecipes = recipeInProgress;
    delete inProgressRecipes[type][id];
    setRecipeInProgress(inProgressRecipes);
    history.push('/done-recipes');
  }

  function handleIngredientCheck(index) {
    const updatedIngredients = [...checkedIngredients];
    updatedIngredients[index] = !updatedIngredients[index];
    setCheckedIngredients(updatedIngredients);
    const ingredientStep = document.getElementsByClassName(`ingredient-step-${index}`)[0];
    const ingredientSpan = ingredientStep.querySelector('span');
    if (checkedIngredients[index]) {
      ingredientSpan.classList.remove('checked');
    } else {
      ingredientSpan.classList.add('checked');
    }
  }

  return (
    <main>
      <section>
        <img
          src={ recipe.strMealThumb || recipe.strDrinkThumb }
          alt={ recipe.strMeal || recipe.strDrink }
          data-testid="recipe-photo"
          className="recipe-photo"
        />
        <section className="recipe-details">
          <div className="recipe-header">
            <h1 data-testid="recipe-title">{ recipe.strMeal || recipe.strDrink }</h1>
            <ShareButton data-testid="share-btn" />
            <FavoriteButton recipe={ recipe } type={ type } data-testid="favorite-btn" />
          </div>
          <h3 data-testid="recipe-category">{ recipe.strCategory }</h3>
          <section className="ingredients-list">
            <h2>Ingredients</h2>
            <ul>
              { ingredients.map((ingredient, index) => (
                <li key={ index }>
                  <label
                    className={ `ingredient-step-${index}` }
                    data-testid={ `${index}-ingredient-step` }
                    style={ checkedIngredients[index]
                      ? { textDecoration: 'line-through solid rgb(0, 0, 0)' } : {} }
                  >
                    <input
                      type="checkbox"
                      checked={ checkedIngredients[index] }
                      onChange={ () => handleIngredientCheck(index) }
                    />
                    <span
                      className={ checkedIngredients[index] ? 'checked' : '' }
                    >
                      {ingredient}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
          <section className="instructions">
            <h2>Instructions</h2>
            <p data-testid="instructions">{ instructions }</p>
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
    </main>
  );
}

export default RecipeInProgress;
