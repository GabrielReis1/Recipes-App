import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import context from '../Contexts/ProviderData';
import { searchDrinkFirtsLetter,
  searchDrinkName,
  searchDrinkIngredient,
  searchMealsFirtsLetter,
  searchMealsIngredients,
  searchMealsName } from '../Services/ApiRequest';
import { useFilter } from '../Contexts/ProviderFilter';

import './searchbar.css';

function SearchBar() {
  const {
    dataSearch,
    setDataSearch,
    resultsOfSearch,
    setResultsOfSearch,
  } = useContext(context);

  const { setCategoryFilter } = useFilter();

  const history = useHistory();
  const page = (history.location.pathname);

  const handleSubmit = async (event, option, text, local) => {
    event.preventDefault();
    if (local === '/drinks') {
      switch (option) {
      case 'ingredient':
        return (setResultsOfSearch(await searchDrinkIngredient(text)), alert);
      case 'name':
        return (setResultsOfSearch(await searchDrinkName(text)), alert);
      case 'firstLetter':
        return (setResultsOfSearch(await searchDrinkFirtsLetter(text)), alert);
      default:
        return console.log('default');
      }
    }
    if (local === '/meals') {
      switch (option) {
      case 'ingredient':
        return (setResultsOfSearch(await searchMealsIngredients(text)), alert);
      case 'name':
        return (setResultsOfSearch(await searchMealsName(text)), alert);
      case 'firstLetter':
        return (setResultsOfSearch(await searchMealsFirtsLetter(text)), alert);
      default:
        return console.log('default');
      }
    }
  };

  useEffect(() => {
    const maxSize = 12;
    if (resultsOfSearch && resultsOfSearch.length > 1) {
      setCategoryFilter(resultsOfSearch.slice(0, maxSize));
    }
    const redirector = async () => {
      if (resultsOfSearch && resultsOfSearch.length === 1) {
        history.push(page === '/meals'
          ? `/meals/${resultsOfSearch[0].idMeal}`
          : `/drinks/${resultsOfSearch[0].idDrink}`);
        setResultsOfSearch([]);
      }
    };
    redirector();
  }, [
    resultsOfSearch,
    setCategoryFilter,
    history,
    page,
    setResultsOfSearch,
  ]);

  return (
    <form className="search-bar">
      <input
        type="text"
        className="text-input"
        placeholder="Search"
        data-testid="search-input"
        value={ dataSearch.textSearch }
        onChange={ ({ target: { value } }) => {
          setDataSearch({ ...dataSearch, textSearch: value });
        } }
      />

      <div
        onChange={ ({ target: { value } }) => {
          setDataSearch({ ...dataSearch, searchOptions: value });
        } }
      >
        <label htmlFor="ingredient-search-radio">
          Ingredient
          <input
            type="radio"
            data-testid="ingredient-search-radio"
            id="ingredient-search-radio"
            name="searchOptions"
            value="ingredient"
          />
        </label>

        <label htmlFor="name-search-radio">
          Name
          <input
            type="radio"
            data-testid="name-search-radio"
            id="name-search-radio"
            name="searchOptions"
            value="name"
          />
        </label>

        <label htmlFor="first-letter-search-radio">
          First Letter
          <input
            type="radio"
            data-testid="first-letter-search-radio"
            id="first-letter-search-radio"
            name="searchOptions"
            value="firstLetter"
          />
        </label>

        <button
          type="button"
          data-testid="exec-search-btn"
          onClick={ (event) => handleSubmit(
            event,
            dataSearch.searchOptions,
            dataSearch.textSearch,
            page,
          ) }
        >
          Find
        </button>
      </div>
    </form>

  );
}

export default SearchBar;
