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
const subBtn = 'exec-search-btn';
const login = async () => {
  act(() => {
    userEvent.type(screen.getByTestId('email-input'), 'teste@teste.com');
    userEvent.type(screen.getByTestId('password-input'), 'testando');
    userEvent.click(screen.getByTestId('login-submit-btn'));
  });
};
describe('Testa o componente SearchBar na Meals', () => {
  beforeEach(async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockImplementation(fetch);

    jest.spyOn(global, 'alert');
    global.alert.mockImplementation(() => {});
    await act(async () => {
      const { history } = renderWithRouter(<App />);
      history.push('/meals');
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
    await waitFor(() => {
      const searchButton = screen.getByTestId(searchTopBtn);
      expect(searchButton).toBeInTheDocument();
      act(() => userEvent.click(searchButton));

      const searchInput = screen.getByTestId(inputSearch);
      userEvent.type(searchInput, 'Chicken');
      expect(searchInput.value).toBe('Chicken');

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
  it('Não deve chamar a API quando o botão Find for clicado sem filtro selecionado', async () => {
    await waitFor(() => {
      const searchButton = screen.getByTestId(searchTopBtn);
      expect(searchButton).toBeInTheDocument();
      act(() => userEvent.click(searchButton));

      const searchInput = screen.getByTestId(inputSearch);
      userEvent.type(searchInput, 'Chicken');
      expect(searchInput.value).toBe('Chicken');

      const submitButton = screen.getByTestId(subBtn);
      userEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(2);
    });
  });
  it('Deve chamar a API quando o botão Find for clicado e mostrar mais de uma e menos de 12 pratos', async () => {
    const endPoint = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=Chicken';
    await waitFor(() => {
      const searchButton = screen.getByTestId(searchTopBtn);
      expect(searchButton).toBeInTheDocument();
      act(() => userEvent.click(searchButton));

      const searchInput = screen.getByTestId(inputSearch);
      userEvent.type(searchInput, 'Chicken');
      expect(searchInput.value).toBe('Chicken');

      const ingredientRadio = screen.getByTestId(ingredienteRadio);
      userEvent.click(ingredientRadio);

      const submitButton = screen.getByTestId(subBtn);
      userEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(global.fetch).toBeCalledWith(endPoint);
    });
    await waitFor(() => {
      const chicken1 = screen.getByText(/Brown Stew Chicken/);
      expect(chicken1).toBeVisible();
      const chicken2 = screen.getByText(/Chicken & mushroom Hotpot/);
      expect(chicken2).toBeVisible();
      const chicken3 = screen.getByText(/Chicken Alfredo Primavera/);
      expect(chicken3).toBeVisible();
      const chicken4 = screen.getByText(/Chicken Basquaise/);
      expect(chicken4).toBeVisible();
      const chicken5 = screen.getByText(/Chicken Congee/);
      expect(chicken5).toBeVisible();
      const chicken6 = screen.getByText(/Chicken Handi/);
      expect(chicken6).toBeVisible();
      const chicken7 = screen.getByText(/Pad See Ew/);
      expect(chicken7).toBeVisible();
      const chicken8 = screen.getByText(/Thai Green Curry/);
      expect(chicken8).toBeVisible();
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

    const submitButton = screen.getByTestId(subBtn);
    expect(submitButton).toBeVisible();
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toBeCalledWith(alertMsg);
    });
  });
  it('Deve ir direto para a página de detalhes, quando só existir uma receita', async () => {
    const history2 = createMemoryHistory({
      initialEntries: ['/meals/52771'],
    });
    const searchButton = screen.getByTestId(searchTopBtn);
    expect(searchButton).toBeInTheDocument();
    act(() => userEvent.click(searchButton));

    const searchInput = screen.getByTestId(inputSearch);
    userEvent.type(searchInput, 'Arrabiata');
    expect(searchInput.value).toBe('Arrabiata');

    const nameRadio = screen.getByTestId('name-search-radio');
    userEvent.click(nameRadio);
    expect(nameRadio).toBeChecked();

    const submitButton = screen.getByTestId(subBtn);
    expect(submitButton).toBeVisible();
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toBeCalledTimes(5);
    });

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      const start = screen.getByTestId('start-recipe-btn');
      expect(start).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(history2.location.pathname).toBe('/meals/52771');
    });
  });
});
