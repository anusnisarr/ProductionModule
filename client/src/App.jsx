import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import './App.css'
import Items from './Components/Items.jsx'
import Categories from './Components/categories.jsx'
import CreateOrEditCategory from './Components/createCategory.jsx';
import Recipe from './Components/Recipe.jsx';
import DemandList from './Components/DemandList.jsx';
import CreateOrEditItem from "./Components/createItem.jsx";
import CreateOrEditRecipe from "./Components/createRecipe.jsx";
import CreateDemand from './Components/createDemand.jsx';
import ProductionPlanning from './Components/ProductionPlanning.jsx';


function App() {
  return (
    <div className="app">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProductionPlanning />} /> 
          <Route path="/Items" element={<Items />} />
          <Route path="/Items/Create" element={<CreateOrEditItem />} />
          <Route path="/Items/Edit/:itemId" element={<CreateOrEditItem />} />
          <Route path='/Categories' element={<Categories />} />
          <Route path='/Categories/Create' element={<CreateOrEditCategory />} />
          <Route path='/Categories/Edit/:categoryId' element={<CreateOrEditCategory />} />
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