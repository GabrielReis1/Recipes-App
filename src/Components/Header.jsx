import PropTypes from 'prop-types';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './header.css';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import SearchBar from './SearchBar';

function Header({ title }) {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const history = useHistory();

  return (
    <header data-testid="header-component">
      <section className="header-bar">
        <h3>RECIPES app</h3>
        <div className="header-icons">
          {(title === 'Meals' || title === 'Drinks')
          && <input
            type="image"
            src={ searchIcon }
            alt="search"
            width="25px"
            onClick={ () => setShowSearchInput(!showSearchInput) }
            data-testid="search-top-btn"
          />}
          <input
            type="image"
            src={ profileIcon }
            alt="profile"
            width="25px"
            onClick={ () => history.push('/profile') }
            data-testid="profile-top-btn"
          />
        </div>
      </section>
      <section className="header-body">
        <h2 data-testid="page-title">{ title }</h2>
        { showSearchInput
          && <SearchBar />}
      </section>
    </header>
  );
}

Header.propTypes = { title: PropTypes.string }.isRequired;

export default Header;
