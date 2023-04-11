import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useFilter } from '../Contexts/ProviderFilter';
import { getDrinksRecipes, getMealsRecipes } from '../Services/ApiRequest';
import { LsProgress, verifyRecipe } from '../Services/localStorageFuncs';
import ShareButton from '../Components/ShareButton';
import FavoriteButton from '../Components/FavoriteButton';

import '../Components/recipes.css';
import './carousel.css';

function RecipeDetails() {
  const history = useHistory();
  const { detailRecipes, setRecipeId } = useFilter();
  const [recomendedRecipes, setRecomendedRecipes] = useState([]);
  const [recipeStatus, setRecipeStatus] = useState('');
  const [path, setPath] = useState('');

  const { id } = useParams();
  const { pathname } = history.location;
  const actualPath = pathname.includes('drinks') ? 'drinks' : 'meals';

  useEffect(() => {
    const defaultLoad = (recipeId) => {
      if (actualPath === 'meals') {
        setRecipeId({ id: recipeId, type: 'Meal' });
      } else { setRecipeId({ id: recipeId, type: 'Drink' }); }
    };

    const fetchRecipes = async () => {
      const five = 5;
      if (actualPath === 'meals') {
        const recipesRes = await getDrinksRecipes();
        setRecomendedRecipes(recipesRes.filter((_, idx) => idx <= five));
      } else {
        const recipesRes = await getMealsRecipes();
        setRecomendedRecipes(recipesRes.filter((_, idx) => idx <= five));
      }
    };

    setRecipeStatus(verifyRecipe(id, actualPath));

    setPath(actualPath === 'meals' ? 'Drink' : 'Meal');

    defaultLoad(id);
    fetchRecipes();
  }, []);

  const ingredients = detailRecipes
  && Object.keys(detailRecipes)
    .filter((ingredient) => ingredient.includes('strIngredient')
  && detailRecipes[ingredient]);

  if (!detailRecipes) {
    return <div>Loading...</div>;
  }

  const {
    strMealThumb,
    strDrinkThumb,
    strMeal,
    strDrink,
    strCategory,
    strAlcoholic,
    strInstructions,
    strYoutube,
  } = detailRecipes;

  return (
    <section className="details">
      <article className="details-img-bg">
        <img
          src={ strMealThumb || strDrinkThumb }
          alt={ strMeal || strDrink }
          data-testid="recipe-photo"
          className="details-img"
        />
      </article>

      <header className="details-header">
        <p data-testid="recipe-category" className="details-category">
          { strAlcoholic === 'Alcoholic'
            ? `${strCategory} - ${strAlcoholic}`
            : strCategory }
        </p>

        <div>
          <ShareButton
            type={ actualPath }
            id={ id }
            testeId="share-btn"
          />

          <FavoriteButton
            type={ actualPath }
            id={ id }
            detailRecipes={ detailRecipes }
            testeId="favorite-btn"
          />
        </div>
      </header>

      <h1 className="details-title" data-testid="recipe-title">
        {strMeal || strDrink}
      </h1>

      <fieldset>
        <legend>Ingredients</legend>
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
      </fieldset>

      <fieldset>
        <legend>Instructions</legend>
        <p data-testid="instructions">
          { strInstructions }
        </p>
      </fieldset>

      <video
        controls
        data-testid="video"
      >
        <source src={ `${strYoutube}` } />
        <track kind="captions" />
      </video>

      <div className="carousel-container">
        { recomendedRecipes.map((recipe, idx) => (
          <article
            data-testid={ `${idx}-recommendation-card` }
            className="carousel-item"
            key={ idx }
          >
            <img
              alt={ recipe[`str${path}`] }
              src={ recipe[`str${path}Thumb`] }
              className="card-img"
            />
            <p data-testid={ `${idx}-recommendation-title` }>
              { recipe[`str${path}`] }
            </p>
          </article>
        )) }
      </div>

      { recipeStatus === 'done'
        ? ''
        : (
          <button
            type="button"
            data-testid="start-recipe-btn"
            className="start-recipe-btn"
            onClick={ () => {
              LsProgress('save', id, path === 'Meal' ? 'drinks' : 'meals', detailRecipes);
              history.push(path === 'Drink'
                ? `/meals/${id}/in-progress`
                : `/drinks/${id}/in-progress`);
            } }
          >
            { recipeStatus === 'inProgress'
              ? <span>Continue Recipe</span> : <span>Start Recipe</span> }
          </button>) }
    </section>
  );
}

export default RecipeDetails;
