import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { Provider } from '../Contexts/ProviderData';
import ProviderFilter from '../Contexts/ProviderFilter';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(
      <Provider>
        <ProviderFilter>
          <Router history={ history }>{component}</Router>
        </ProviderFilter>
      </Provider>,
    ),
    history,
  });
};
export default renderWithRouter;
