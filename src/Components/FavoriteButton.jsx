import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import { LsFavorite } from '../Services/localStorageFuncs';
import './recipes.css';
import { useFilter } from '../Contexts/ProviderFilter';

function FavoriteButton({ id, type, detailRecipes, testeId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { reloadFavorites, setReloadFavorites } = useFilter();

  const verifyFavorite = () => { setIsFavorite(LsFavorite('isFavorite', id)); };

  useEffect(() => { verifyFavorite(); }, []);

  return (
    <button
      type="button"
      className="share-and-favorite"
      onClick={ () => {
        LsFavorite(isFavorite
          ? 'removeFavorite' : 'addFavorite', id, type, detailRecipes);
        verifyFavorite();
        setReloadFavorites(!reloadFavorites);
      } }
    >
      {
        isFavorite ? <img
          data-testid={ testeId }
          src={ blackHeartIcon }
          alt="favorite"
        />
          : <img data-testid={ testeId } src={ whiteHeartIcon } alt="not favorite" />
      }
    </button>
  );
}

FavoriteButton.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  testeId: PropTypes.string,
  detailRecipes: PropTypes.shape({}),
}.isRequired;

export default FavoriteButton;
