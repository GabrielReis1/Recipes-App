import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Recipes from '../Components/Recipes';
import { useFilter } from '../Contexts/ProviderFilter';
import { getByCategory } from '../Services/ApiRequest';

jest.mock('../Contexts/ProviderFilter');
jest.mock('../Services/ApiRequest');

describe('Testa o componente Recipes', () => {
  beforeEach(() => {
    useFilter.mockReturnValue({
      categoryFilter: [],
      setCategoryFilter: jest.fn(),
      setRecipeId: jest.fn(),
      setToggle: jest.fn(),
    });
  });

  it('Testa se handleCategory atualiza o filtro de categorias', async () => {
    const filterRes = [
      { idMeal: '1', strMeal: 'Lasanha', strMealThumb: 'lasanha.jpg' },
      { idMeal: '2', strMeal: 'Brocolis', strMealThumb: 'brocolis.jpg' },
    ];

    getByCategory.mockResolvedValue(filterRes);

    await act(async () => {
      render(
        <Recipes path="Meal" categories={ [{ strCategory: 'Side' }] } recipes={ [] } />,
      );
    });

    const btnCategory = screen.getByRole('button', { name: 'Side' });

    await act(async () => {
      userEvent.click(btnCategory);
    });

    expect(useFilter().setCategoryFilter).toHaveBeenCalledWith(filterRes.slice(0, 12));
  });

  // testar setToggle
});
