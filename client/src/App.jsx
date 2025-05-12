import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import './App.css'
import Items from './Components/Items.jsx'
import Recipe from './Components/Recipe.jsx';
// import Navigation from './Components/Navigation.jsx';
import CreateOrEditItem from "./Components/createItem.jsx";
import CreateOrEditRecipe from "./Components/createRecipe.jsx";
import CreateDemand from './Components/createDemand.jsx';
import DemandList from './Components/DemandList.jsx';
import ProductionPlanning from './Components/ProductionPlanning.jsx';


function App() {
  return (
    <div className="app">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Items />} /> 
          <Route path="/Items/Create" element={<CreateOrEditItem />} />
          <Route path="/Items/Edit/:itemId" element={<CreateOrEditItem />} />
          <Route path="/Recipe" element={<Recipe />} />
          <Route path="/Recipe/Create" element={<CreateOrEditRecipe />} />
          <Route path="/Recipe/Edit/:recipeCode" element={<CreateOrEditRecipe />} />
          <Route path="/Demand" element={<DemandList />} />
          <Route path="/Demand/Create" element={<CreateDemand />} />
          <Route path="/ProductionPlanning" element={<ProductionPlanning />} />



        </Route>      
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;