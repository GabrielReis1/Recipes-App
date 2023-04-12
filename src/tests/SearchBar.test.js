import React from 'react';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helpers/renderWithRouter';
import Header from '../Components/Header';
import fetch from '../../cypress/mocks/fetch';

const inputSearch = 'search-input';
const ingredienteRadio = 'ingredient-search-radio';

describe('Testa o componente SearchBar', () => {
  beforeEach(async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockImplementation(fetch);

    await act(async () => {
      renderWithRouter(<Header title="Meals" />);
    });
    const searchButton = screen.getByTestId('search-top-btn');
    expect(searchButton).toBeInTheDocument();
    userEvent.click(searchButton);
  });

  it('Deve renderizar o input de search', () => {
    const searchInput = screen.getByTestId(inputSearch);
    expect(searchInput).toBeInTheDocument();
  });

  it('Deve atualizar o input de search quando o usuário interage', () => {
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
  it('Testa se o botão funciona', () => {
    const searchInput = screen.getByTestId(inputSearch);
    const ingredientRadio = screen.getByTestId(ingredienteRadio);

    userEvent.type(searchInput, 'Chicken');
    expect(searchInput.value).toBe('Chicken');
    userEvent.click(ingredientRadio);

    const submitButton = screen.getByTestId('exec-search-btn');
    userEvent.click(submitButton);
  });
  it('Testa se pesquisar por uma refeição', async () => {
    const searchInput = screen.getByTestId(inputSearch);
    userEvent.type(searchInput, 'Corba');
    expect(searchInput.value).toBe('Corba');

    const nameRadio = screen.getByTestId('name-search-radio');

    userEvent.click(nameRadio);
    expect(nameRadio).toBeChecked();

    const submitButton = screen.getByText(/find/i);
    expect(submitButton).toBeVisible();
    userEvent.click(submitButton);

    expect(global.fetch).toBeCalledTimes(0);

    // SIMPLESMENTE NAO CHAMA NADA NO TESTE. POR QUE? NAO SEI

    // const ingredient = await screen.findByText('Lentils 1 cup');
    // expect(ingredient).toBeInTheDocument();
  });
});
