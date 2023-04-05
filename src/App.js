import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './Pages/Login';
import Meals from './Pages/Meals';
import Drinks from './Pages/Drinks';
import Profile from './Pages/Profile';
import Done from './Pages/Done';
import Favorites from './Pages/Favorites';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ Login } />
          <Route path="/meals/:id" />
          <Route exact path="/meals" component={ Meals } />
          <Route path="/drinks:id" />
          <Route exact path="/drinks" component={ Drinks } />
          <Route exact path="/profile" component={ Profile } />
          <Route exact path="/done-recipes" component={ Done } />
          <Route exact path="/favorite-recipes" component={ Favorites } />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
