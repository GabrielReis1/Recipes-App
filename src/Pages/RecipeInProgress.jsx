import { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { getRecipeById, getIngredientAndMeasureList } from '../Services/ApiRequest';
import useRecipeInProgress from '../hooks/useRecipeInProgress';
import ShareButton from '../Components/ShareButton';
import FavoriteButton from '../Components/FavoriteButton';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import './recipeinprogress.css';

function RecipeInProgress() {
  const { pathname } = useLocation();
  const type = pathname.includes('drinks') ? 'drinks' : 'meals';
  const [recipe, setRecipe] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [recipeInProgress, setRecipeInProgress] = useRecipeInProgress(type);
  const { id } = useParams();
  const history = useHistory();

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

  return (
    <main>
      <Header title={ type === 'meals' ? recipe.strMeal : recipe.strDrink } />
      <img
        src={ recipe.strMealThumb || recipe.strDrinkThumb }
        alt={ recipe.strMeal || recipe.strDrink }
        data-testid="recipe-photo"
        className="recipe-photo"
      />
      <section className="recipe-details">
        <div className="recipe-header">
          <div className="recipe-header-buttons">
            <ShareButton data-testid="share-btn" />
            <FavoriteButton recipe={ recipe } type={ type } data-testid="favorite-btn" />
          </div>
        </div>
        <h3 data-testid="recipe-category">{ recipe.strCategory }</h3>
        <section className="ingredients-list">
          <h2>Ingredients</h2>
          <ul>
            { ingredients.map((ingredient, index) => (
              <li key={ index }>
                <span data-testid={ `${index}-ingredient-name-and-measure` }>
                  { ingredient }
                </span>
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
      <Footer />
    </main>
  );
}

export default RecipeInProgress;
