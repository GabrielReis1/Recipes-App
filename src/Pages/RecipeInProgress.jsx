import { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import ShareButton from '../Components/ShareButton';
// import FavoriteButton from '../Components/FavoriteButton';
import './recipeinprogress.css';
import { LsDone, LsProgress } from '../Services/localStorageFuncs';
import { useFilter } from '../Contexts/ProviderFilter';

function RecipeInProgress() {
  const { id } = useParams();
  const history = useHistory();
  const { pathname } = useLocation();
  const type = pathname.includes('drinks') ? 'drinks' : 'meals';
  const { detailRecipes, setRecipeId } = useFilter();
  const [ingredients, setIngredients] = useState([]);
  const [checkedIngredients, setCheckedIngredients] = useState([]);

  useEffect(() => {
    const defaultLoad = () => {
      if (type === 'meals') {
        setRecipeId({ id, type: 'Meal' });
      } else { setRecipeId({ id, type: 'Drink' }); }
    };

    const getRecipe = () => {
      const savedRecipe = LsProgress();
      const recipe = savedRecipe[type]
      && savedRecipe[type][id] ? savedRecipe[type][id] : {};
      setIngredients(recipe);
    };

    defaultLoad();
    getRecipe();
  }, []);

  function handleIngredientClick(event) {
    const ingredient = event.target.value;
    if (event.target.checked) {
      setCheckedIngredients([...checkedIngredients, ingredient]);
    } else {
      setCheckedIngredients(checkedIngredients.filter((i) => i !== ingredient));
    }
  }

  function handleFinishRecipe() {
    LsDone('done', id, type, detailRecipes);
    history.push('/done-recipes');
  }

  const style = 'line-through solid rgb(0, 0, 0)';

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
              data-testid="share-btn"
            />
            {/* <FavoriteButton
              recipe={ detailRecipes }
              type={ type }
              data-testid="favorite-btn"
            /> */}
          </div>
          <h3 data-testid="recipe-category">{ detailRecipes.strCategory }</h3>
          <section className="ingredients-list">
            <h2>Ingredients</h2>
            <ul>
              {ingredients?.map((ingredient, idx) => {
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
