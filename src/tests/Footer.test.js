import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Meals from '../Pages/Meals';
import Drinks from '../Pages/Drinks';
import ProviderFilter from '../Contexts/ProviderFilter';

describe('Verifica o Footer da aplicação', () => {
  it('Verifica se o componente Footer é renderizado na página /meals', () => {
    render(
      <ProviderFilter>
        <Meals />
      </ProviderFilter>,
    );

    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });
  it('Verifica se os inputs sao renderizados', () => {
    render(
      <ProviderFilter>
        <Meals />
      </ProviderFilter>,
    );

    const drinksBtn = screen.getByTestId('drinks-bottom-btn');
    const mealsBtn = screen.getByTestId('meals-bottom-btn');

    expect(drinksBtn).toBeInTheDocument();
    expect(mealsBtn).toBeInTheDocument();
  });

  it('Verifica se ao clicar no botao de drinks a rota é /drinks', () => {
    const history = createMemoryHistory();
    render(
      <ProviderFilter>
        <Router history={ history }>
          <Meals />
        </Router>
        ,
      </ProviderFilter>,
    );

    const drinksBtn = screen.getByTestId('drinks-bottom-btn');

    expect(drinksBtn).toBeInTheDocument();

    userEvent.click(drinksBtn);

    const route = history.location.pathname;
    expect(route).toBe('/drinks');
  });

  it('Verifica se ao clicar no botao de meals a rota é /meals', () => {
    const history = createMemoryHistory();
    render(
      <ProviderFilter>
        <Router history={ history }>
          <Drinks />
        </Router>
        ,
      </ProviderFilter>,
    );

    const mealsBtn = screen.getByTestId('meals-bottom-btn');

    expect(mealsBtn).toBeInTheDocument();

    userEvent.click(mealsBtn);

    const route = history.location.pathname;
    expect(route).toBe('/meals');
  });
});
