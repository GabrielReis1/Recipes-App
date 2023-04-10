import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import ProviderFilter from '../Contexts/ProviderFilter';
import fetch from '../../cypress/mocks/fetch';
import Meals from '../Pages/Meals';
import Drinks from '../Pages/Drinks';

describe('Verifica a página de receitas da aplicação', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockImplementation(fetch);
  });
  afterEach(() => jest.clearAllMocks());

  it('Verifica se renderiza as categorias e receitas na página Meals', async () => {
    render(
      <ProviderFilter>
        <Meals />
      </ProviderFilter>,
    );

    const categoryFilter = await screen.getByTestId(/category-filter/i);

    expect(categoryFilter).toBeVisible();
  }, 2000);

  it('Verifica se renderiza os botões de categoria', async () => {
    render(
      <ProviderFilter>
        <Meals />
      </ProviderFilter>,
    );
    await waitFor(() => {
      const beefButton = screen.getByTestId('Beef-category-filter');
      expect(beefButton).toBeInTheDocument();

      const breakfastButton = screen.getByTestId('Breakfast-category-filter');
      expect(breakfastButton).toBeInTheDocument();
    }, { timeout: 5000 });
  }, 10000);

  it('Verifica a renderização das receitas', async () => {
    render(
      <ProviderFilter>
        <Meals />
      </ProviderFilter>,
    );
    const gridRecipe = await screen.getByTestId('recipes-grid');
    expect(gridRecipe).toBeInTheDocument();
  }, 2000);

  it('Verifica se todas as receitas aparecem quando a categoria All é clicada', async () => {
    render(
      <ProviderFilter>
        <Meals />
      </ProviderFilter>,
    );
    await waitFor(() => {
      const allButton = screen.getByTestId('All-category-filter');
      fireEvent.click(allButton);
    }, { timeout: 10000 });

    await waitFor(() => {
      const receita1 = screen.getByTestId('0-card-name');
      expect(receita1).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 20000);

  it('Verifica o filtro por categoria e se a rota é alterada', async () => {
    const history = createMemoryHistory();

    render(
      <ProviderFilter>
        <Router history={ history }>
          <Meals />
        </Router>
      </ProviderFilter>,
    );

    await waitFor(() => {
      const allButton = screen.getByTestId('All-category-filter');
      fireEvent.click(allButton);

      const receita1 = screen.getByTestId('0-card-name');
      expect(receita1).toBeInTheDocument();
      fireEvent.click(receita1);
    }, { timeout: 50000 });

    await waitFor(() => {
      const { pathname } = history.location;
      expect(pathname).toBe('/meals/52977');
    }, { timeout: 10000 });

    await waitFor(() => {
      const corbaMeal = screen.getByText(/Corba/i);
      expect(corbaMeal).toBeInTheDocument();
    }, { timeout: 10000 });

    await waitFor(() => {
      expect(global.fetch).toBeCalled();
      expect(global.fetch).toBeCalledWith(
        'https://www.themealdb.com/api/json/v1/1/list.php?c=list',
      );
    }, { timeout: 10000 });
  }, 40000);

  // // DRINKS:

  it('Verifica se renderiza as categorias e receitas na página Drinks', async () => {
    render(
      <ProviderFilter>
        <Drinks />
      </ProviderFilter>,
    );

    await waitFor(() => {
      const categoryFilter = screen.getByTestId(/category-filter/i);

      expect(categoryFilter).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 20000);

  it('Verifica se renderiza os botões da Drinks', async () => {
    render(
      <ProviderFilter>
        <Drinks />
      </ProviderFilter>,
    );
    await waitFor(() => {
      const ordinaryBtn = screen.getByTestId(/Ordinary Drink-category-filter/i);
      expect(ordinaryBtn).toBeInTheDocument();

      const cocktailBtn = screen.getByTestId(/Cocktail-category-filter/i);
      expect(cocktailBtn).toBeInTheDocument();
    }, { timeout: 20000 });
  }, 20000);

  it('Verifica a renderização das receitas da Drinks', async () => {
    render(
      <ProviderFilter>
        <Drinks />
      </ProviderFilter>,
    );

    await waitFor(() => {
      const gridRecipe = screen.getByTestId('recipes-grid');
      expect(gridRecipe).toBeInTheDocument();
    }, { timeout: 20000 });
  }, 20000);

  it('Verifica o filtro por categoria e se a rota é alterada', async () => {
    const history = createMemoryHistory();

    render(
      <ProviderFilter>
        <Router history={ history }>
          <Drinks />
        </Router>
      </ProviderFilter>,
    );

    await waitFor(() => {
      const allButton = screen.getByTestId('All-category-filter');
      fireEvent.click(allButton);

      const receita1 = screen.getByTestId('0-card-name');
      expect(receita1).toBeInTheDocument();
      fireEvent.click(receita1);
    }, { timeout: 50000 });

    await waitFor(() => {
      const { pathname } = history.location;
      expect(pathname).toBe('/drinks/15997');
    }, { timeout: 10000 });

    await waitFor(() => {
      const gege = screen.getByText(/GG/i);
      expect(gege).toBeInTheDocument();
    }, { timeout: 10000 });

    await waitFor(() => {
      expect(global.fetch).toBeCalled();
      expect(global.fetch).toBeCalledWith(
        'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list',
      );
    }, { timeout: 10000 });
  }, 40000);
});
