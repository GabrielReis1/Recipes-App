import PropTypes from 'prop-types';
import './recipes.css';
import { useFilter } from '../Contexts/ProviderFilter';
import { getByCategory } from '../Services/ApiRequest';

function Recipes({ path, recipes, categories }) {
  const { categoryFilter, setCategoryFilter } = useFilter();

  const handleCategory = async (category) => {
    const eleven = 11;
    const url = path === 'Meal'
      ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      : `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`;

    const filterRes = await getByCategory(url, path);
    setCategoryFilter(filterRes.filter((_, idx) => idx <= eleven));
  };

  return (
    <>
      <section className="category-filter">
        { categories?.map((category) => (
          <button
            type="button"
            key={ category.strCategory }
            data-testid={ `${category.strCategory}-category-filter` }
            className="category-btn"
            onClick={ () => handleCategory(category.strCategory) }
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
      <section className="recipes-grid">
        { categoryFilter?.map((recipe, idx) => (
          <article
            key={ recipe[`id${path}`] }
            data-testid={ `${idx}-recipe-card` }
            className="recipes-card"
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
