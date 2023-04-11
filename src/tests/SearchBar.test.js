import React from 'react';
import { screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helpers/renderWithRouter';
import Header from '../Components/Header';

const inputSearch = 'search-input';
const ingredienteRadio = 'ingredient-search-radio';

describe('Testa o componente SearchBar', () => {
  beforeEach(async () => {
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
});
