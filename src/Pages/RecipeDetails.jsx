import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useFilter } from '../Contexts/ProviderFilter';
import { getDrinksRecipes, getMealsRecipes } from '../Services/ApiRequest';

import '../Components/recipes.css';
import './carousel.css';

function RecipeDetails() {
  const history = useHistory();
  const { detailRecipes, setRecipeId } = useFilter();
  const [recomendedRecipes, setRecomendedRecipes] = useState([]);
  const [path, setPath] = useState('');
  const { id } = useParams();
  const { pathname } = history.location;

  console.log(detailRecipes);

  useEffect(() => {
    const defaultLoad = (recipeId, actualPath) => {
      if (actualPath === '/meals') {
        setRecipeId({ id: recipeId, type: 'Meal' });
      } else { setRecipeId({ id: recipeId, type: 'Drink' }); }
    };

    const fetchRecipes = async (actualPath) => {
      const five = 5;
      if (actualPath === '/meals') {
        const recipesRes = await getDrinksRecipes();
        setRecomendedRecipes(recipesRes.filter((_, idx) => idx <= five));
      } else {
        const recipesRes = await getMealsRecipes();
        setRecomendedRecipes(recipesRes.filter((_, idx) => idx <= five));
      }
    };

    const paths = ['/meals', '/drinks'];
    const regex = new RegExp(`(${paths.join('|')})/\\d+$`);
    const actualPath = pathname.replace(regex, (match, group) => group);
    setPath(actualPath === '/meals' ? 'Drink' : 'Meal');

    defaultLoad(id, actualPath);
    fetchRecipes(actualPath);
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
    </section>
  );
}

export default RecipeDetails;
