import React, { useState , useEffect, use } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faSave,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import "../StyleSheets/RecipeForm.css";
import ItemSelect from "../Components/itemSelect.jsx";
import { useForm } from "react-hook-form";




const RecipeForm = () => {

  // const { register, handleSubmit, watch, formState: { errors } } = useForm();
  // const onSubmit = data => console.log(data);
  const [mainRecipeError, setMainRecipeError] = useState("");
  const [recipeItemError, setRecipeItemError] = useState("");

  const isEditMode = window.location.href.includes("Edit");

  const [recipe, setRecipe] = useState({
    recipeName: "",
    recipeCode: "",
    recipeId: null,
    description: "",
    recipeType:"",
    recipeCost: 0,
    Status: "Active",
    ingredients: [],
  });

  const [currentItem, setCurrentItem] = useState({
    itemId: null,
    itemCode: "",
    itemName: "",
    itemType: "",
    quantity: 1,
    rate: 0,
    wastage: 0,
    unit: "g",
    totalAmount: 0,
  });

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const recipeId = window.location.href.split("/").pop();
      try {
        const response = await fetch(`http://localhost:3000/recipe/api/recipe/${recipeId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }
        const recipeData = await response.json();
        setRecipe({
          recipeName: recipeData.recipeName,
          recipeCode: recipeData.recipeCode,
          recipeId: recipeData.recipeId,
          description: recipeData.description,
          recipeType: recipeData.recipeType,
          recipeCost: recipeData.recipeCost,
          Status: recipeData.Status,
          ingredients: recipeData.ingredients.map((item) => ({
            itemId: item.itemId,
            itemCode: item.itemCode,
            itemName: item.itemName,
            itemType: item.itemType,
            quantity: item.quantity,
            rate: item.rate,
            wastage: item.wastage,
            unit: item.unit,
            totalAmount: item.totalAmount,
          })),
        });
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        alert("Error fetching recipe details: " + error.message);
      }
    };
    if (isEditMode) {
      fetchRecipeDetails();
    }
  }, []);

  useEffect(() => {  
    if (isEditMode) return;

    const checkIsRecipeExists = async () => {
      try {
        const response = await fetch(`http://localhost:3000/recipe/api/recipe/${recipe.recipeCode}`);
        
        if (response.status === 404) {
          // Recipe not found => this is fine => user can continue
          return setMainRecipeError("");;
        }
  
        if (!response.ok) {
          // Other errors (e.g. 500 server error)
          throw new Error("Failed to fetch recipe data");
        }
  
        if (response.status === 200) {
          // Recipe exists => Stop user and show error
          setRecipe((prev) => ({
            ...prev,
            recipeCode: "",
            recipeName: "",
            recipeType:"",
            recipeCost: 0,
            recipeId: null
          }));
  
          
          throw new Error("Recipe already exists with this item");

        }
      } catch (error) {
        setMainRecipeError(error.message);
        console.error("Error checking recipe:", error.message);
      }
    };

    if (recipe.recipeCode) {checkIsRecipeExists()};

    
  }, [recipe.recipeCode]);
  
  useEffect(() => {
    
    const checkIsRecipeitemSame = async () => {
      
      setRecipeItemError("");  
      if (currentItem.itemCode === recipe.recipeCode) {
          console.log("Recipe item cannot be the same as main recipe.");
          return setRecipeItemError("Recipe item cannot be the same as main recipe.");  
        }

      }

    if (currentItem.itemCode) {checkIsRecipeitemSame()};

  } , [currentItem.itemCode])
  

  const handleAddItem = () => {
    if (!currentItem.itemCode) return;

    const totalAmount = Number(
      (
        currentItem.quantity *
        currentItem.rate *
        (1 + currentItem.wastage / 100)
      ).toFixed(2)
    );

    const recipeCost = Number(
      recipe.ingredients
        .reduce((sum, item) => sum + parseFloat(item.totalAmount), 0)
        .toFixed(2)
    );

    setRecipe((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          ...currentItem,
          itemId: currentItem.itemId,
          itemName: currentItem.itemName,
          itemCode: currentItem.itemCode,
          quantity: currentItem.quantity,
          rate: currentItem.rate,
          wastage: currentItem.wastage,
          unit: currentItem.unit,
          itemType: currentItem.itemType,
          totalAmount,
        },
      ],
      recipeCost: recipeCost + totalAmount,
    }));

    setCurrentItem({
      itemId: null,
      itemCode: "",
      itemName: "",
      itemType: "",
      quantity: 1,
      rate: 0,
      wastage: 0,
      unit: "g",
      totalAmount: 0,
    });

    console.log("recipe :", recipe);
  };

  const handleRemoveItem = (index) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));

    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (recipe.ingredients.length === 0) return setRecipeItemError("Please add at least one recipe item.");
    if (!recipe.recipeCode) return setMainRecipeError("Please select a recipe first.");
    
    console.log("Recipe submitted:", recipe);
    try {
      const url = isEditMode ? `http://localhost:3000/recipe/Edit/${recipe.recipeCode}` 
      : "http://localhost:3000/recipe/Create";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe)
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || "Network response was not ok");
      }
      const result = await response.json();
      console.log(result);
      // window.location.href = "/recipe";
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error: " + error.message);
    }
  };

  
  return (
    <div className="recipe-form-container">
      <h2 className="form-title">Create New Recipe</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-group">
            <label>Recipe Name</label>
            <ItemSelect
              onChange={(selectedItem) => {
                setRecipe((prev) => ({
                  ...prev,
                  recipeName: selectedItem.value,
                  recipeCode: selectedItem.itemCode,
                  recipeType: selectedItem.itemType,
                  recipeId: selectedItem.itemId,
                  
                }));
              }}
              value={recipe.recipeName}
            />
            {mainRecipeError && <p style={{ color: "red" }}>{mainRecipeError}</p>}

          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
            value={recipe.description}
            onChange={(e) =>
              setRecipe({ ...recipe, description: e.target.value })
            }
            placeholder="Recipe description..."
            rows="3"

            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="isActive"
              value={recipe.Status} // Convert boolean to string here
              onChange= {(e)=> {setRecipe((prevData) => ({ ...prevData, Status: e.target.value }))}}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Recipe Items</h3>

          <div className="item-selection-grid">
            <div className="form-group">
              <label>Item</label>
              <ItemSelect
                onChange={(selectedItem) => {
                  setCurrentItem((prev) => ({
                    ...prev,
                    itemName: selectedItem.value,
                    itemCode: selectedItem.itemCode,
                    itemType: selectedItem.itemType,
                    itemId: selectedItem.itemId,
                  }));
                }}
                value={currentItem.itemName}
              />
              {recipeItemError && <p style={{ color: "red" }}>{recipeItemError}</p>}
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={currentItem.quantity}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    quantity: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select
                value={currentItem.unit}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, unit: e.target.value })
                }
              >
                <option value="g">Grams (g)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="l">Liters (l)</option>
                <option value="pc">Pieces (pc)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Rate (per unit)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={currentItem.rate}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    rate: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Wastage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={currentItem.wastage}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    wastage: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <button
              type="button"
              className="btn-add-item"
              onClick={handleAddItem}
              disabled={!currentItem.itemCode}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Item
            </button>
          </div>

          {recipe.ingredients.length > 0 && (
            <div className="items-table">
              <div className="table-header">
                <div>Item</div>
                <div>Qty</div>
                <div>Rate</div>
                <div>Wastage</div>
                <div>Amount</div>
                <div>Action</div>
              </div>

              {recipe.ingredients.map((item, index) => (
                <div className="table-row" key={index}>
                  <div>
                    <span className="item-name">{item.itemName}</span>
                    <span className="item-Type">{item.itemType}</span>
                  </div>
                  <div>
                    {item.quantity} {item.unit}
                  </div>
                  <div>${item.rate.toFixed(2)}</div>
                  <div>{item.wastage}%</div>
                  <div>${item.totalAmount.toFixed(2)}</div>
                  <div>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="table-footer">
                <div>Total Cost:</div>
                <div>
                  $
                  {recipe.ingredients
                    .reduce(
                      (sum, item) => sum + parseFloat(item.totalAmount),
                      0
                    )
                    .toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            <FontAwesomeIcon icon={faSave} /> Save Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
