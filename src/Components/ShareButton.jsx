import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clipboardCopy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';

function ShareButton({ id, type }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `http://localhost:3000/${type}/${id}`;

  const handleClick = () => {
    const Timeout = 2000;
    clipboardCopy(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), Timeout);
  };

  return (
    <button type="button" onClick={ handleClick } data-testid="share-btn">
      {copied ? 'Link copiado!' : shareIcon }
    </button>
  );
}

ShareButton.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

export default ShareButton;
