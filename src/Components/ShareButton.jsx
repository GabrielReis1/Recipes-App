import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clipboardCopy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';
import { useFilter } from '../Contexts/ProviderFilter';

function ShareButton({ type }) {
  const [copied, setCopied] = useState(false);
  const { recipeId } = useFilter();

  const shareUrl = `http://localhost:3000/${type}/${recipeId.id}`;

  const handleClick = () => {
    const Timeout = 2000;
    clipboardCopy(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), Timeout);
  };

  return (
    <button type="button" onClick={ handleClick } data-testid="share-btn">
      {copied ? 'Link copiado!' : <img src={ shareIcon } alt="shareIcon" /> }
    </button>
  );
}

ShareButton.propTypes = {
  type: PropTypes.string.isRequired,
};

export default ShareButton;
