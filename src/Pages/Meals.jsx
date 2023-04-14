import { useEffect, useState } from 'react';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import Recipes from '../Components/Recipes';
import { getMealsCategories, getMealsRecipes } from '../Services/ApiRequest';
import { useFilter } from '../Contexts/ProviderFilter';
import logo from '../images/logo.png';
import './logo.css';

function Meals() {
  const [mealsRecipes, setMealsRecipes] = useState([]);
  const [mealsCategories, setMealsCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    };

    requestMeals();
  }, []);

  return (
    <>
      <Header title="Meals" />
      { loading
        ? <div className="logo-container"><img src={ logo } alt="logo-MiniCheff" className="logo-Minicheff" /></div>
        : (
          <Recipes
            path="Meal"
            recipes={ mealsRecipes }
            categories={ mealsCategories }
          />) }
      <Footer />
    </>
  );
}

export default Meals;
