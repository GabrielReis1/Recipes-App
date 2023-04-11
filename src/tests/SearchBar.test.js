import React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import ProviderFilter from '../Contexts/ProviderFilter';
import { Provider } from '../Contexts/ProviderData';
import SearchBar from '../Components/SearchBar';
import renderWithRouter from '../helpers/renderWithRouter';

const inputSearch = 'search-input';
const ingredienteRadio = 'ingredient-search-radio';

describe('Testa o componente SearchBar', () => {
  beforeEach(async () => {
    await act(async () => {
      renderWithRouter(
        <Provider>
          <ProviderFilter>
            <SearchBar />
          </ProviderFilter>
        </Provider>,
      );
    });
  });

  it('Deve renderizar o input de search', () => {
    const searchInput = screen.getByTestId(inputSearch);
    expect(searchInput).toBeInTheDocument();
  });

  it('Deve atualizar o input de search quando o usuário interage', () => {
    const searchInput = screen.getByTestId(inputSearch);
    fireEvent.change(searchInput, { target: { value: 'broccoli' } });
    expect(searchInput.value).toBe('broccoli');

    const ingredientRadio = screen.getByTestId(ingredienteRadio);
    const nameRadio = screen.getByTestId('name-search-radio');
    const firstLetterRadio = screen.getByTestId('first-letter-search-radio');

    const allRadios = [ingredientRadio, nameRadio, firstLetterRadio];

    allRadios.forEach((radioChecked) => {
      fireEvent.click(radioChecked);

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

    fireEvent.change(searchInput, { target: { value: 'broccoli' } });
    fireEvent.click(ingredientRadio);

    const submitButton = screen.getByTestId('exec-search-btn');
    fireEvent.click(submitButton);
  });
});
