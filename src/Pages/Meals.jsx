import { useEffect, useState } from 'react';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import Recipes from '../Components/Recipes';
import { getMealsCategories, getMealsRecipes } from '../Services/ApiRequest';
import { useFilter } from '../Contexts/ProviderFilter';

function Meals() {
  const [mealsRecipes, setMealsRecipes] = useState([]);
  const [mealsCategories, setMealsCategories] = useState([]);
  const { setCategoryFilter } = useFilter();

  useEffect(() => {
    const requestMeals = async () => {
      const eleven = 11;
      const four = 4;
      const recipesRes = await getMealsRecipes();
      const categoriesRes = await getMealsCategories();
      setMealsRecipes(recipesRes.filter((_, idx) => idx <= eleven));
      setMealsCategories(categoriesRes.filter((_, idx) => idx <= four));
      setCategoryFilter(recipesRes.filter((_, idx) => idx <= eleven));
    };

    requestMeals();
  }, []);

  return (
    <>
      <Header title="Meals" />
      <Recipes
        path="Meal"
        recipes={ mealsRecipes }
        categories={ mealsCategories }
      />
      <Footer />
    </>
  );
}

export default Meals;
