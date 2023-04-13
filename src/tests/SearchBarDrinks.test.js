import React from 'react';
import { screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import renderWithRouter from '../helpers/renderWithRouter';
import App from '../App';
import fetch from '../../cypress/mocks/fetch';

const inputSearch = 'search-input';
const searchTopBtn = 'search-top-btn';
const ingredienteRadio = 'ingredient-search-radio';
const login = async () => {
  act(() => {
    userEvent.type(screen.getByTestId('email-input'), 'teste@teste.com');
    userEvent.type(screen.getByTestId('password-input'), 'testando');
    userEvent.click(screen.getByTestId('login-submit-btn'));
  });
};

describe('Testa o componente SearchBar na Drinks', () => {
  beforeEach(async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockImplementation(fetch);

    jest.spyOn(global, 'alert');
    global.alert.mockImplementation(() => {});
    await act(async () => {
      const { history } = renderWithRouter(<App />);
      history.push('/drinks');
    });
  });

  it('Deve renderizar o input de search', async () => {
    await waitFor(() => login());
    await waitFor(() => {
      const searchButton = screen.getByTestId(searchTopBtn);
      expect(searchButton).toBeInTheDocument();
      act(() => userEvent.click(searchButton));
      const searchInput = screen.getByTestId(inputSearch);
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('Deve atualizar o input de search quando o usuário interage', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/drinks'],
    });
    expect(history.location.pathname).toBe('/drinks');
    await waitFor(() => {
      const searchButton = screen.getByTestId(searchTopBtn);
      expect(searchButton).toBeInTheDocument();
      act(() => userEvent.click(searchButton));

      const searchInput = screen.getByTestId(inputSearch);
      userEvent.type(searchInput, 'Vodka');
      expect(searchInput.value).toBe('Vodka');

      const ingredientRadio = screen.getByTestId(ingredienteRadio);
      const nameRadio = screen.getByTestId('name-search-radio');
      const firstLetterRadio = screen.getByTestId('first-letter-search-radio');

      const allRadios = [ingredientRadio, nameRadio, firstLetterRadio];

      allRadios.forEach((radioChecked) => {
        userEvent.click(radioChecked);

        expect(radioChecked).toBeChecked();

        allRadios.filter((radio) => radio !== radioChecked)
          .forEach((radioNotChecked) => {
            expect(radioNotChecked).not.toBeChecked();
          });
      });
    });
  });
  it('Deve chamar a API quando o botão Find for clicado', async () => {
    const endPoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    await waitFor(() => {
      const drinkBtn = screen.getByTestId('drinks-bottom-btn');
      expect(drinkBtn).toBeInTheDocument();
      act(() => userEvent.click(drinkBtn));
    });
    const history = createMemoryHistory({
      initialEntries: ['/drinks'],
    });
    expect(history.location.pathname).toBe('/drinks');
    await waitFor(() => {
      const searchButton = screen.getByTestId(searchTopBtn);
      expect(searchButton).toBeInTheDocument();
      act(() => userEvent.click(searchButton));
    });

    const searchInput = screen.getByTestId(inputSearch);
    userEvent.type(searchInput, 'Vodka');
    expect(searchInput.value).toBe('Vodka');

    const firstLetterRadio = screen.getByTestId('first-letter-search-radio');
    userEvent.click(firstLetterRadio);

    const submitButton = screen.getByTestId('exec-search-btn');
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(global.fetch).toBeCalledWith(endPoint);
    });
  });
  it('Deve exibir um alerta caso pesquise por mais uma letra usando o filtro firstLetter', async () => {
    const alertMsg = 'Your search must have only 1 (one) character';

    const searchButton = screen.getByTestId(searchTopBtn);
    expect(searchButton).toBeInTheDocument();
    act(() => userEvent.click(searchButton));

    const searchInput = screen.getByTestId(inputSearch);
    userEvent.type(searchInput, 'xablau');
    expect(searchInput.value).toBe('xablau');

    const firstLetterRadio = screen.getByTestId('first-letter-search-radio');
    userEvent.click(firstLetterRadio);
    expect(firstLetterRadio).toBeChecked();

    const submitButton = screen.getByTestId('exec-search-btn');
    expect(submitButton).toBeVisible();
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toBeCalledWith(alertMsg);
    });
  });
});
