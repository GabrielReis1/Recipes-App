import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DoneRecipes from '../Pages/DoneRecipes';
import renderWithRouter from '../helpers/renderWithRouter';

const grid = 'recipes-grid';

const doneRecipes = [
  {
    image: 'https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg',
    name: 'Apple Frangipan Tart',
    alcoholicOrNot: null,
    doneDate: '10/04/2023',
    id: '52768',
    type: 'meal',
    nacionality: 'British',
    category: 'Dessert',
    tags: ['Tart'],
  },
  {
    image: 'https://www.thecocktaildb.com/images/media/drink/jgvn7p1582484435.jpg',
    name: 'Caipirinha',
    alcoholicOrNot: 'Alcoholic',
    doneDate: '10/04/2023',
    id: '11202',
    type: 'drink',
    nacionality: 'Brazilian',
    category: 'Ordinary Drink',
    tags: ['Party'],
  },
];

describe('DoneRecipes', () => {
  beforeEach(() => {
    act(() => {
      renderWithRouter(
        <DoneRecipes />,
      );
    });
    localStorage.clear();
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
  });

  it('Testa se os botões de filtro funcionam', () => {
    const allButton = screen.getByTestId('filter-by-all-btn');
    const mealButton = screen.getByTestId('filter-by-meal-btn');
    const drinkButton = screen.getByTestId('filter-by-drink-btn');

    userEvent.click(mealButton);
    expect(screen.queryByTestId(grid)).toBeInTheDocument();

    userEvent.click(drinkButton);
    expect(screen.queryByTestId(grid)).toBeInTheDocument();

    userEvent.click(allButton);
    expect(screen.queryByTestId(grid)).toBeInTheDocument();
  });

  it('Testa o cartão de Meal', () => {
    const recipeCard = screen.queryByTestId('0-recipe-card');

    expect(recipeCard).toBeInTheDocument();

    const recipeImage = screen.getByTestId('0-horizontal-image');
    expect(recipeImage).toBeInTheDocument();

    const recipeName = screen.getByTestId('0-horizontal-name');
    expect(recipeName.textContent).toBe('Apple Frangipan Tart');

    const recipeCategory = screen.getByTestId('0-horizontal-top-text');
    expect(recipeCategory.textContent).toBe('Dessert');

    const recipeTags = screen.getByTestId('0-Tart-horizontal-tag');
    expect(recipeTags).toBeInTheDocument();

    const mealButton = screen.getByTestId('filter-by-meal-btn');
    userEvent.click(mealButton);
    const recipeCards = screen.getAllByTestId(/recipe-card/i);
    expect(recipeCards).toHaveLength(1);
  });
  it('Testa o cartão de Drink', () => {
    const recipeCard = screen.queryByTestId('1-recipe-card');

    expect(recipeCard).toBeInTheDocument();

    const recipeImage = screen.getByTestId('1-horizontal-image');
    expect(recipeImage).toBeInTheDocument();

    const recipeName = screen.getByTestId('1-horizontal-name');
    expect(recipeName.textContent).toBe('Caipirinha');

    const recipeTags = screen.getByTestId('1-Party-horizontal-tag');
    expect(recipeTags).toBeInTheDocument();

    const drinkButton = screen.getByTestId('filter-by-drink-btn');
    userEvent.click(drinkButton);
    const recipeCards = screen.getAllByTestId(/recipe-card/i);
    expect(recipeCards).toHaveLength(1);
  });
});
