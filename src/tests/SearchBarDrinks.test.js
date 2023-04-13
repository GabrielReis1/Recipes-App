import React from 'react';
import { screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helpers/renderWithRouter';
import App from '../App';
import fetch from '../../cypress/mocks/fetch';

const inputSearch = 'search-input';
const searchTopBtn = 'search-top-btn';
const ingredienteRadio = 'ingredient-search-radio';
const first = 'first-letter-search-radio';
const subBtn = 'exec-search-btn';
const alertMsg = 'Your search must have only 1 (one) character';

const login = async () => {
  act(() => {
    userEvent.type(screen.getByTestId('email-input'), 'receitas@app.com');
    userEvent.type(screen.getByTestId('password-input'), 'grupo08');
    userEvent.click(screen.getByTestId('login-submit-btn'));
  });
};

describe('Testa o componente SearchBar na Drinks', () => {
  let history2;
  beforeEach(async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockImplementation(fetch);

    jest.spyOn(global, 'alert');
    global.alert.mockImplementation(() => {});
  });

  it('Deve renderizar o input de search', async () => {
    await act(async () => {
      const { history } = renderWithRouter(<App />);
      history.push('/drinks');
    });
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
    await act(async () => {
      const { history } = renderWithRouter(<App />);
      history.push('/drinks');
    });
    await waitFor(() => {
      const searchButton = screen.getByTestId(searchTopBtn);
      expect(searchButton).toBeInTheDocument();
      act(() => userEvent.click(searchButton));

      const searchInput = screen.getByTestId(inputSearch);
      act(() => { userEvent.type(searchInput, 'Vodka'); });
      expect(searchInput.value).toBe('Vodka');

      const ingredientRadio = screen.getByTestId(ingredienteRadio);
      const nameRadio = screen.getByTestId('name-search-radio');
      const firstLetterRadio = screen.getByTestId(first);

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
  it('Não deve chamar a API quando o botão Find for clicado sem filtro selecionado', async () => {
    await act(async () => {
      const { history } = renderWithRouter(<App />);
      history.push('/drinks');
    });
    await waitFor(() => {
      const searchButton = screen.getByTestId(searchTopBtn);
      expect(searchButton).toBeInTheDocument();
      act(() => userEvent.click(searchButton));

      const searchInput = screen.getByTestId(inputSearch);
      act(() => { userEvent.type(searchInput, 'Cocoa'); });
      expect(searchInput.value).toBe('Cocoa');

      const submitButton = screen.getByTestId(subBtn);
      userEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(2);
    });
  });
  it('Deve chamar a API quando o botão Find for clicado', async () => {
    await act(async () => {
      const { history } = renderWithRouter(<App />);
      history.push('/drinks');
    });
    const endPoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    await waitFor(() => {
      const drinkBtn = screen.getByTestId('drinks-bottom-btn');
      expect(drinkBtn).toBeInTheDocument();
      act(() => userEvent.click(drinkBtn));
    });
    await waitFor(() => {
      const searchButton = screen.getByTestId(searchTopBtn);
      expect(searchButton).toBeInTheDocument();
      act(() => userEvent.click(searchButton));
    });

    const searchInput = screen.getByTestId(inputSearch);
    act(() => { userEvent.type(searchInput, 'Cocoa'); });
    expect(searchInput.value).toBe('Cocoa');

    const ingredientRadio = screen.getByTestId(ingredienteRadio);
    userEvent.click(ingredientRadio);

    const submitButton = screen.getByTestId(subBtn);
    act(() => { userEvent.click(submitButton); });
    await waitFor(() => {
      expect(global.fetch).toBeCalledWith(endPoint);
    });
  });
  it('Deve exibir um alerta caso pesquise por mais de uma letra usando o filtro firstLetter', async () => {
    await act(async () => {
      const { history } = renderWithRouter(<App />);
      history.push('/drinks');
    });

    const searchButton = screen.getByTestId(searchTopBtn);
    expect(searchButton).toBeInTheDocument();
    act(() => userEvent.click(searchButton));

    const searchInput = screen.getByTestId(inputSearch);
    act(() => { userEvent.type(searchInput, 'xablau'); });
    expect(searchInput.value).toBe('xablau');

    const firstLetterRadio = screen.getByTestId(first);
    userEvent.click(firstLetterRadio);
    expect(firstLetterRadio).toBeChecked();

    const submitButton = screen.getByTestId(subBtn);
    expect(submitButton).toBeVisible();
    act(() => { userEvent.click(submitButton); });

    await waitFor(() => {
      expect(global.alert).toBeCalledWith(alertMsg);
    });
  });
  it('Deve ir direto para a página de detalhes, quando só existir uma receita', async () => {
    await act(async () => {
      const { history } = renderWithRouter(<App />);
      localStorage.clear();
      history.push('/drinks/178319');
      history2 = history;
    });
    const searchButton = screen.getByTestId(searchTopBtn);
    expect(searchButton).toBeInTheDocument();
    act(() => userEvent.click(searchButton));

    const searchInput = screen.getByTestId(inputSearch);
    userEvent.type(searchInput, 'Aquamarine');
    expect(searchInput.value).toBe('Aquamarine');

    const nameRadio = screen.getByTestId('name-search-radio');
    act(() => userEvent.click(nameRadio));
    expect(nameRadio).toBeChecked();

    const submitButton = screen.getByTestId(subBtn);
    expect(submitButton).toBeVisible();
    act(() => { userEvent.click(submitButton); });

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(3);
    });

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      const start = screen.getByTestId('start-recipe-btn');
      expect(start).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(history2.location.pathname).toBe('/drinks/178319');
    });
  });
});
