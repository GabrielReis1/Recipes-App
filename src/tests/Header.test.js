import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Meals from '../Pages/Meals';
import Drinks from '../Pages/Drinks';
import ProviderFilter from '../Contexts/ProviderFilter';

describe('Verifica o Header da aplicação', () => {
  it('Verifica se o componente Header é renderizado na página /meals', () => {
    render(
      <ProviderFilter>
        <Meals />
      </ProviderFilter>,
    );
    const header = screen.getByTestId('header-component');
    expect(header).toBeInTheDocument();
  });
  it('Verifica se os inputs sao renderizados', () => {
    render(
      <ProviderFilter>
        <Meals />
      </ProviderFilter>,
    );

    const lupaBtn = screen.getByTestId('search-top-btn');
    const profileBtn = screen.getByTestId('profile-top-btn');

    expect(lupaBtn).toBeInTheDocument();
    expect(profileBtn).toBeInTheDocument();
  });

  it('Verifica se ao clicar no botao de busca aparece o input de texto', () => {
    render(
      <ProviderFilter>
        <Meals />
      </ProviderFilter>,
    );

    const lupaBtn = screen.getByTestId('search-top-btn');

    expect(lupaBtn).toBeInTheDocument();

    userEvent.click(lupaBtn);

    const searchInput = screen.getByTestId('search-input');

    expect(searchInput).toBeInTheDocument();
  });

  it('Verifica se ao clicar no botao de perfil a rota é /profile', () => {
    const history = createMemoryHistory();

    render(
      <ProviderFilter>
        <Router history={ history }>
          <Meals />
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
        <Meals />
      </ProviderFilter>,
    );

    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeInTheDocument();
  });

  it('Verifica o título é renderizado de acordo com a rota /drinks', () => {
    render(
      <ProviderFilter>
        <Drinks />
      </ProviderFilter>,
    );

    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeInTheDocument();
  });
});
