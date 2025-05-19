import {
    createBrowserRouter,
  } from "react-router-dom";
  
  import Layout from "./Components/Layout";
  import Items from "./Components/Items.jsx";
  import CreateOrEditItem from "./Components/createItem.jsx";
  import Categories from "./Components/categories";
  import CreateOrEditCategory from "./Components/createCategory.jsx";
  import Recipe from "./Components/Recipe.jsx";
  import CreateOrEditRecipe from "./Components/createRecipe.jsx";
  import DemandList from "./Components/DemandList.jsx";
  import CreateDemand from "./Components/createDemand.jsx";
  import ProductionPlanning from "./Components/ProductionPlanning.jsx";
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <ProductionPlanning /> },
        { path: "Items", element: <Items /> },
        { path: "Items/Create", element: <CreateOrEditItem /> },
        { path: "Items/Edit/:itemId", element: <CreateOrEditItem />},
        { path: "Categories", element: <Categories /> },
        { path: "Categories/Create", element: <CreateOrEditCategory /> },
        { path: "Categories/Edit/:categoryId", element: <CreateOrEditCategory /> },
        { path: "Recipe", element: <Recipe /> },
        { path: "Recipe/Create", element: <CreateOrEditRecipe /> },
        { path: "Recipe/Edit/:recipeCode", element: <CreateOrEditRecipe /> },
        { path: "Demand", element: <DemandList /> },
        { path: "Demand/Create", element: <CreateDemand /> },
        { path: "ProductionPlanning", element: <ProductionPlanning /> },
      ],
    },
  ]);
  
  export default router;
  