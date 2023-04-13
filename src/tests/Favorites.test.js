import { screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from '../../cypress/mocks/fetch';
import App from '../App';
import renderWithRouter from '../helpers/renderWithRouter';

const login = async () => {
  act(() => {
    userEvent.type(screen.getByTestId('email-input'), 'receitas@app.com');
    userEvent.type(screen.getByTestId('password-input'), 'grupo08');
    userEvent.click(screen.getByTestId('login-submit-btn'));
  });
};

describe('Testa os favoritos', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockImplementation(fetch);
  });
  afterEach(() => jest.clearAllMocks());
  it('Testa o percurso de favoritar, fazer a receita e ver nos favoritos', async () => {
    await act(async () => {
      const { history } = renderWithRouter(<App />);
      history.push('/meals');
      localStorage.setItem('favoriteRecipes', JSON.stringify([{
        id: '178319',
        type: 'drink',
        nationality: '',
        category: '',
        alcoholicOrNot: '',
      }]));
    });

    login();

    const loading = screen.getByText(/loading recipes.../);

    expect(loading).toBeVisible();

    await waitFor(() => {
      const corba = screen.getByText(/corba/i);
      expect(corba).toBeInTheDocument();
      userEvent.click(corba);
    });
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      const favorite = screen.getByTestId('favorite-btn');
      expect(favorite).toBeInTheDocument();
      userEvent.click(favorite);
      const start = screen.getByTestId('start-recipe-btn');
      expect(start).toBeInTheDocument();
      userEvent.click(start);
    });

    const finish = screen.getByTestId('finish-recipe-btn');
    act(() => userEvent.click(finish));

    await waitFor(() => {
      const profile = screen.getByTestId('profile-top-btn');
      expect(profile).toBeInTheDocument();
      userEvent.click(profile);
    });

    await waitFor(() => {
      const favoriteBtn = screen.getByTestId('profile-favorite-btn');
      expect(favoriteBtn).toBeInTheDocument();
      userEvent.click(favoriteBtn);
    });

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      const allBtn = screen.getByTestId('filter-by-all-btn');
      const mealsBtn = screen.getByTestId('filter-by-meal-btn');
      const drinksBtn = screen.getByTestId('filter-by-drink-btn');
      expect(allBtn).toBeInTheDocument();
      expect(mealsBtn).toBeInTheDocument();
      expect(drinksBtn).toBeInTheDocument();
      userEvent.click(allBtn);
    });

    const recipeCard0 = screen.getByTestId('0-recipe-card');
    expect(recipeCard0).toBeInTheDocument();

    await waitFor(() => {
      const mealsBtn = screen.getByTestId('filter-by-meal-btn');
      expect(mealsBtn).toBeInTheDocument();
      userEvent.click(mealsBtn);
    });

    const recipeImage = screen.getByTestId('0-horizontal-image');
    expect(recipeImage).toBeInTheDocument();

    await waitFor(() => {
      const drinksBtn = screen.getByTestId('filter-by-drink-btn');
      expect(drinksBtn).toBeInTheDocument();
      userEvent.click(drinksBtn);
    });

    const doneDate = screen.getByTestId('0-horizontal-done-date');
    expect(doneDate).toBeInTheDocument();

    await waitFor(() => {
      const favorite = screen.getByTestId('0-horizontal-favorite-btn');
      expect(favorite).toBeInTheDocument();
      userEvent.click(favorite);
    });

    expect(recipeCard0).toBeInTheDocument();
  }, 2000);
});
