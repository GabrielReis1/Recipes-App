import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import { LsDone } from '../Services/localStorageFuncs';
import ShareButton from '../Components/ShareButton';
import '../Components/done-favorites.css';

function DoneRecipes() {
  const [allRecipes, setAllRecipes] = useState();
  const [recipesDone, setDoneRecipes] = useState();

  useEffect(() => {
    const getRecipe = () => {
      const recipe = LsDone();
      setDoneRecipes(recipe);
      setAllRecipes(recipe);
    };
    getRecipe();
  }, []);

  return (
    <>
      <Header title="Done Recipes" />
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
            </Link>

            <section className="card-infos">
              <h3
                data-testid={ `${index}-horizontal-name` }
                className="card-text"
              >
                { recipe.name }
              </h3>

              { recipe.nationality && (
                <p
                  data-testid={ `${index}-horizontal-top-text` }
                  className="card-text"
                >
                  {`${recipe.nationality} - ${recipe.category}`}
                </p>
              )}
              { recipe.alcoholicOrNot && (
                <span
                  data-testid={ `${index}-horizontal-top-text` }
                  className="card-text"
                >
                  {recipe.alcoholicOrNot}
                </span>
              )}
              <p
                data-testid={ `${index}-horizontal-done-date` }
                className="card-text"
              >
                { recipe.doneDate }
              </p>
              {
                recipe.tags
              && (recipe.tags.map((tag) => (
                <p
                  key={ tag }
                  data-testid={ `${index}-${tag}-horizontal-tag` }
                  className="card-text"
                >
                  { tag }
                </p>
              ))
              )
              }
              <ShareButton
                testeId={ `${index}-horizontal-share-btn` }
                type={ recipe.type === 'meal' ? 'meals' : 'drinks' }
                id={ recipe.id }
              />
            </section>
          </article>
        ))}
      </section>
    </>
  );
}

export default DoneRecipes;
