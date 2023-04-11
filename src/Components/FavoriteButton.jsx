import React from 'react';
// import PropTypes from 'prop-types';
// import whiteHeartIcon from '../images/whiteHeartIcon.svg';
// import blackHeartIcon from '../images/blackHeartIcon.svg';

function FavoriteButton() {
  return (
    <button type="button" data-testid="favorite-btn">
      {
        // isFavorite ? <img src={ blackHeartIcon } alt="favorite" />
        //   : <img src={ whiteHeartIcon } alt="not favorite" />
      }
    </button>
  );
}

// FavoriteButton.propTypes = {
//   isFavorite: PropTypes.bool.isRequired,
//   onClick: PropTypes.func.isRequired,
// };

export default FavoriteButton;
