import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clipboardCopy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';
// import './recipes.css';

function ShareButton({ type, id, testeId }) {
  const [copied, setCopied] = useState(false);
  // const { recipeId } = useFilter();
  const shareUrl = `http://localhost:3000/${type}/${id}`;

  const handleClick = () => {
    const Timeout = 2000;
    clipboardCopy(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), Timeout);
  };

  return (
    <button
      type="button"
      onClick={ handleClick }
      className="share-and-favorite"
    >
      { copied
        ? 'Link copied!'
        : <img data-testid={ testeId } src={ shareIcon } alt="shareIcon" /> }
    </button>
  );
}

ShareButton.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  testeId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default ShareButton;
