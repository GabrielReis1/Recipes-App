import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import { LsFavorite } from '../Services/localStorageFuncs';
import './recipes.css';

function FavoriteButton({ id, type, detailRecipes }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const verifyFavorite = () => { setIsFavorite(LsFavorite('isFavorite', id)); };

  useEffect(() => { verifyFavorite(); }, []);

  return (
    <button
      type="button"
      data-testid="favorite-btn"
      className="share-and-favorite"
      onClick={ () => {
        LsFavorite(isFavorite
          ? 'removeFavorite' : 'addFavorite', id, type, detailRecipes);
        verifyFavorite();
      } }
    >
      {
        isFavorite ? <img src={ blackHeartIcon } alt="favorite" />
          : <img src={ whiteHeartIcon } alt="not favorite" />
      }
    </button>
  );
}

FavoriteButton.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  detailRecipes: PropTypes.shape({}),
}.isRequired;

export default FavoriteButton;
