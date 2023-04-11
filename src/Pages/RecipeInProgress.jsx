import { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import ShareButton from '../Components/ShareButton';
// import FavoriteButton from '../Components/FavoriteButton';
import './recipeinprogress.css';
import { LsDone, LsProgress } from '../Services/localStorageFuncs';
import { useFilter } from '../Contexts/ProviderFilter';
import FavoriteButton from '../Components/FavoriteButton';

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
    <main>
      <section>
        <img
          src={ detailRecipes.strMealThumb || detailRecipes.strDrinkThumb }
          alt={ detailRecipes.strMeal || detailRecipes.strDrink }
          data-testid="recipe-photo"
          className="recipe-photo"
        />
        <section className="recipe-details">
          <div className="recipe-header">
            <h1 data-testid="recipe-title">
              { detailRecipes.strMeal || detailRecipes.strDrink }

            </h1>
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
          <h3 data-testid="recipe-category">{ detailRecipes.strCategory }</h3>
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
    </main>
  );
}

export default RecipeInProgress;
