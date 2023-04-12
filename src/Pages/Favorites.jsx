import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import { LsFavorite } from '../Services/localStorageFuncs';
import ShareButton from '../Components/ShareButton';
import FavoriteButton from '../Components/FavoriteButton';
import '../Components/done-favorites.css';
import { useFilter } from '../Contexts/ProviderFilter';

function FavoriteRecipes() {
  const [allRecipes, setAllRecipes] = useState();
  const [recipesDone, setDoneRecipes] = useState();
  const { reloadFavorites } = useFilter();

  useEffect(() => {
    const getRecipe = () => {
      const recipe = LsFavorite();
      setDoneRecipes(recipe);
      setAllRecipes(recipe);
    };
    getRecipe();
  }, []);

  useEffect(() => {
    setDoneRecipes(LsFavorite());
  }, [reloadFavorites]);

  return (
    <>
      <Header title="Favorite Recipes" />
      <h1>Favorite Recipes</h1>
      <section>
        <button
          data-testid="filter-by-all-btn"
          onClick={ () => setDoneRecipes(allRecipes) }
        >
          All
        </button>
        <button
          data-testid="filter-by-meal-btn"
          onClick={ () => setDoneRecipes(allRecipes
            .filter((recipe) => recipe.type === 'meal')) }
        >
          Meals
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={ () => setDoneRecipes(allRecipes
            .filter((recipe) => recipe.type === 'drink')) }
        >
          Drinks
        </button>
      </section>
      <section
        className="recipes-grid"
        data-testid="recipes-grid"
      >
        { recipesDone?.map((recipe, index) => (
          <article
            key={ index }
            data-testid={ `${index}-recipe-card` }
            className="card"
            aria-hidden="true"
          >
            <Link
              to={ `/${recipe.type === 'meal'
                ? 'meals'
                : 'drinks'}/${recipe.id}` }
            >
              <img
                data-testid={ `${index}-horizontal-image` }
                alt={ recipe.name }
                src={ recipe.image }
                className="card-img"
              />
              <h4
                data-testid={ `${index}-horizontal-name` }
                className="card-text"
              >
                { recipe.name }
              </h4>
            </Link>
            <h4
              data-testid={ `${index}-horizontal-top-text` }
              className="card-text"
            >
              {recipe.category}
            </h4>
            { recipe.nationality && (
              <h4
                data-testid={ `${index}-horizontal-top-text` }
                className="card-text"
              >
                {`${recipe.nationality} - ${recipe.category}`}
              </h4>
            )}
            { recipe.alcoholicOrNot && (
              <h4
                data-testid={ `${index}-horizontal-top-text` }
                className="card-text"
              >
                {recipe.alcoholicOrNot}
              </h4>
            )}
            <h4
              data-testid={ `${index}-horizontal-done-date` }
              className="card-text"
            >
              { recipe.doneDate }
            </h4>
            {
              recipe.tags
              && (recipe.tags.map((tag) => (
                <h4
                  key={ tag }
                  data-testid={ `${index}-${tag}-horizontal-tag` }
                  className="card-text"
                >
                  { tag }
                </h4>
              ))
              )
            }
            <ShareButton
              testeId={ `${index}-horizontal-share-btn` }
              type={ recipe.type === 'meal' ? 'meals' : 'drinks' }
              id={ recipe.id }
            />
            <FavoriteButton
              testeId={ `${index}-horizontal-favorite-btn` }
              type={ recipe.type === 'meal' ? 'meals' : 'drinks' }
              id={ recipe.id }
            />
          </article>
        ))}
      </section>
    </>
  );
}

export default FavoriteRecipes;
