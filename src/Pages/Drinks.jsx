import { useEffect, useState } from 'react';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import Recipes from '../Components/Recipes';
import { getDrinksCategories, getDrinksRecipes } from '../Services/ApiRequest';
import { useFilter } from '../Contexts/ProviderFilter';
import logo from '../images/logo.png';
import './logo.css';

function Drinks() {
  const [drinksRecipes, setDrinksRecipes] = useState([]);
  const [drinksCategories, setDrinksCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCategoryFilter } = useFilter();

  useEffect(() => {
    const requestDrinks = async () => {
      const eleven = 11;
      const four = 4;
      const recipesRes = await getDrinksRecipes();
      const categoriesRes = await getDrinksCategories();
      setDrinksRecipes(recipesRes.filter((_, idx) => idx <= eleven));
      setDrinksCategories(categoriesRes.filter((_, idx) => idx <= four));
      setCategoryFilter(recipesRes.filter((_, idx) => idx <= eleven));
      setLoading(false);
    };
    requestDrinks();
  }, []);

  return (
    <>
      <Header title="Drinks" />
      { loading
        ? <div className="logo-container"><img src={ logo } alt="logo-MiniCheff" className="logo-Minicheff" /></div>
        : (
          <Recipes
            path="Drink"
            recipes={ drinksRecipes }
            categories={ drinksCategories }
          />) }
      <Footer />
    </>
  );
}

export default Drinks;
