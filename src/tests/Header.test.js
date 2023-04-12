import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Header from '../Components/Header';
import ProviderFilter from '../Contexts/ProviderFilter';
import { Provider } from '../Contexts/ProviderData';

describe('Verifica o Header da aplicação', () => {
  it('Verifica se o componente Header é renderizado na página /meals', () => {
    render(
      <ProviderFilter>
        <Header />
      </ProviderFilter>,
    );
    const header = screen.getByTestId('header-component');
    expect(header).toBeInTheDocument();
  });
  it('Verifica se os inputs sao renderizados', () => {
    const history = createMemoryHistory({
      initialEntries: ['/meals'],
    });
    render(
      <Provider>
        <ProviderFilter>
          <Router history={ history }>
            <Header title="Meals" />
          </Router>
        </ProviderFilter>
      </Provider>,
    );
    expect(history.location.pathname).toBe('/meals');

    const searchButton = screen.getByTestId('search-top-btn');
    expect(searchButton).toBeInTheDocument();

    userEvent.click(searchButton);

    const searchInput = screen.getByTestId('search-input');

    expect(searchInput).toBeInTheDocument();
  });

  it('Verifica se ao clicar no botao de perfil a rota é /profile', () => {
    const history = createMemoryHistory({ initialEntries: ['/profile'] });

    render(
      <ProviderFilter>
        <Router history={ history }>
          <Header />
        </Router>
        ,
      </ProviderFilter>,
    );

    const profileBtn = screen.getByTestId('profile-top-btn');
    expect(profileBtn).toBeInTheDocument();

    fireEvent.click(profileBtn);

    const route = history.location.pathname;
    expect(route).toBe('/profile');
  });

  it('Verifica o título é renderizado de acordo com a rota /meals', () => {
    render(
      <ProviderFilter>
        <Header />
      </ProviderFilter>,
    );

    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeInTheDocument();
  });

  it('Verifica o título é renderizado de acordo com a rota /drinks', () => {
    render(
      <ProviderFilter>
        <Header />
      </ProviderFilter>,
    );

    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeInTheDocument();
  });
});
