import PropTypes from 'prop-types';
import './recipes.css';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFilter } from '../Contexts/ProviderFilter';
import { getByCategory } from '../Services/ApiRequest';

function Recipes({ path, recipes, categories }) {
  const history = useHistory();
  const [toggle, setToggle] = useState('');
  const { categoryFilter, setCategoryFilter, setRecipeId } = useFilter();

  const handleCategory = async (category) => {
    setToggle(category);
    const eleven = 11;
    const url = path === 'Meal'
      ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      : `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`;

    const filterRes = await getByCategory(url, path);
    setCategoryFilter(filterRes.filter((_, idx) => idx <= eleven));
  };

  const categoryVerify = (category) => {
    if (category !== toggle) {
      handleCategory(category);
    } else {
      setCategoryFilter(recipes);
      setToggle('');
    }
  };

  return (
    <>
      <section className="category-filter">
        { categories?.map((category, idx) => (
          <button
            type="button"
            key={ idx }
            data-testid={ `${category.strCategory}-category-filter` }
            className="category-btn"
            onClick={ () => categoryVerify(category.strCategory) }
          >
            {category.strCategory}
          </button>
        )) }
        <button
          type="button"
          data-testid="All-category-filter"
          className="category-btn-all"
          onClick={ () => setCategoryFilter(recipes) }
        >
          All
        </button>
      </section>
      <section
        className="recipes-grid"
        data-testId="recipes-grid"
      >
        { categoryFilter?.map((recipe, idx) => (
          <article
            key={ idx }
            data-testid={ `${idx}-recipe-card` }
            className="recipes-card"
            aria-hidden="true"
            onClick={ () => {
              setRecipeId({ id: recipe[`id${path}`], type: path });
              history.push(path === 'Meal'
                ? `/meals/${recipe.idMeal}`
                : `/drinks/${recipe.idDrink}`);
            } }
          >
            <img
              data-testid={ `${idx}-card-img` }
              alt={ path }
              src={ recipe[`str${path}Thumb`] }
              className="card-img"
            />
            <p
              data-testid={ `${idx}-card-name` }
              className="card-text"
            >
              { recipe[`str${path}`] }
            </p>
          </article>
        ))}
      </section>
    </>
  );
}

Recipes.propTypes = { path: PropTypes.string }.isRequired;

export default Recipes;
