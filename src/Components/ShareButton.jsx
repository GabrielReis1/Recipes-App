import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clipboardCopy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';
import './recipes.css';

function ShareButton({ type, id }) {
  const [copied, setCopied] = useState(false);

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
      data-testid="share-btn"
      className="share-and-favorite"
    >
      { copied ? 'Link copied!' : <img src={ shareIcon } alt="shareIcon" /> }
    </button>
  );
}

ShareButton.propTypes = {
  type: PropTypes.string,
  id: PropTypes.number,
}.isRequired;

export default ShareButton;
