import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faBoxes, 
  faFlask, 
  faCalculator,
  faChevronDown,
  faChevronRight,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import '../StyleSheets/ProductionPlanning.css'; // Adjust the path as necessary
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ProductionPlanning = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [demandData, setDemandData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [expandedSemiFinished, setExpandedSemiFinished] = useState(null);
  const [itemData, setItemData] = useState([]);
  const [recipeData, setRecipeData] = useState([]);
  const [demandData1, setDemandData1] = useState([]);
  const [demandId, setDemandid] = useState(null);
  const [findMainRecipe, setFindMainRecipe] = useState(null);
  const [findSemiFinishedRecipe, setFindSemiFinishedRecipe] = useState(null);
  const MySwal = withReactContent(Swal);


  

  useEffect(() => {
    fetchItemData();
    fetchRecipeData();
    fetchDemandData();    
  }, []); 
  // console.log("Item Data:", itemData);
  // console.log("Recipe Data:", recipeData);
  // console.log("Demand Data:", demandData);
  
    // Simulate API call
  const fetchDemandData = async () => {
    setLoading(true);
    try{
      const demandData = await fetch("http://localhost:3000/demand/api/demand");
      if(!demandData.ok){
        throw new Error("Network response was not ok");
      }
      const demandJson = await demandData.json();

      setDemandData(demandJson);
      setDemandid(demandJson.length + 1);
      
      setLoading(false);
    }
    catch(e){
      console.error("There was a problem with the fetch item operation:", e);
    }
  }

  const fetchItemData = async () => {
    try{
      const itemData = await fetch("http://localhost:3000/items/api");
      if(!itemData.ok){
        throw new Error("Network response was not ok");
      }
      const itemJson = await itemData.json();
      setItemData(itemJson);
    }
    catch(e){
      console.error("There was a problem with the fetch item operation:", e);
    }
  }

  const fetchRecipeData = async () => {
    try{
      const recipeData = await fetch("http://localhost:3000/recipe/api/recipe");
      if(!recipeData.ok){
        throw new Error("Network response was not ok");
      }
      const recipeJson = await recipeData.json();
      setRecipeData(recipeJson);
    }
    catch(e){
      console.error("There was a problem with the fetch recipe operation:", e);
    }
  }


  useEffect(() => {
    fetchDemandData();
  }, [selectedDate]);

  const toggleProductExpand = (productId, demandQuantity) => {
      console.log(productId);
      
    if (expandedProduct === productId) {
      setExpandedProduct(null);
      setFindMainRecipe(null);
      setExpandedSemiFinished(null);
      return;
    }

  
    const matchedRecipe = recipeData.find(recipe => recipe.recipeCode === productId);

    if(!matchedRecipe){
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'info',
        background:"#292929",
        color:"#ffffff",
        title: 'Recipe Not Found',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return
    }
  
    if (matchedRecipe) {
      const updatedIngredients = matchedRecipe.ingredients.map(ingredient => {
        const requiredQty = ingredient.quantity * demandQuantity;
        return {
          ...ingredient,
          requiredQty,
          shortage: Math.max(requiredQty - ingredient.available, 0),
        };
      });
  
      setFindMainRecipe({
        ...matchedRecipe,
        ingredients: updatedIngredients
      });
    }
  
    setExpandedProduct(productId);
    setExpandedSemiFinished(null);
  };
  

  const toggleSemiFinishedExpand = (semiFinishedCode, quantityNeeded) => {
    console.log("semiFinishedCode:", semiFinishedCode);
    
    
    
    const matchedRecipe = recipeData.find(recipe => recipe.recipeCode === semiFinishedCode);
    console.log( "matchedRecipe:", matchedRecipe);

    if (matchedRecipe) {    
      const updatedIngredients = matchedRecipe.ingredients.map(ingredient => ({
        ...ingredient,
        requiredQty: ingredient.requiredQty * quantityNeeded,
        shortage: Math.max((ingredient.requiredQty * quantityNeeded) - ingredient.available, 0)
      }));

      setFindSemiFinishedRecipe({
        ...matchedRecipe,
        ingredients: updatedIngredients
      });

      setExpandedSemiFinished(expandedSemiFinished === semiFinishedCode ? null : semiFinishedCode);
    }
    
  };

 // Group and sum items by itemCode
function groupAndSumItems(items) {
  const map = new Map();
  for (const item of items) {
    if (map.has(item.itemCode)) {
      map.get(item.itemCode).quantity += item.quantity;
    } else {
      map.set(item.itemCode, { ...item }); // Clone to avoid mutation
    }
  }
  return Array.from(map.values());
}

// Extract Finished Goods from demandData
const finishedGoods = demandData.flatMap(demand =>
  demand.items.filter(item => item.itemType === "FinishedGoods")
);

//  Finished Goods Demand
const finishGoodsDemand = groupAndSumItems(finishedGoods);

// Semi-Finished Demand Calculation
const semiFinishDemand = groupAndSumItems(
  finishedGoods.flatMap(fgItem => {
    const recipe = recipeData.find(r => r.recipeCode === fgItem.itemCode);
    if (!recipe) return [];

    return recipe.ingredients
      .filter(i => i.itemType === "SemiFinished")
      .map(ingredient => ({
        ...ingredient,
        quantity: ingredient.quantity * fgItem.quantity
      }));
  })
);

// extract Raw Materials
function getAllRawMaterials(recipeCode, multiplier = 1) {
  const recipe = recipeData.find(r => r.recipeCode === recipeCode);
  if (!recipe) return [];

  let materials = [];

  for (const ingredient of recipe.ingredients) {
    const totalQty = ingredient.quantity * multiplier;

    if (ingredient.itemType === "RawMaterial") {
      materials.push({ ...ingredient, quantity: totalQty });
    } else if (["SemiFinished", "SemiFinishedSemiFinished"].includes(ingredient.itemType)) {
      materials.push(...getAllRawMaterials(ingredient.itemCode, totalQty));
    }
  }

  return materials;
}

// Raw Material Requirements
const rawMaterialRequirements = groupAndSumItems(
  finishedGoods.flatMap(item => getAllRawMaterials(item.itemCode, item.quantity))
);


console.log("Finished Goods Demand:", finishGoodsDemand);
console.log("Semi-Finished Demand:", semiFinishDemand);
console.log("Raw Material Requirements:", rawMaterialRequirements);


  // const calculateTotalShortage = (type) => {
  //   return demandData.reduce((total, product) => {
  //     return total + product.ingredients.reduce((sum, ingredient) => {
  //       if (ingredient.type === type) {
  //         return sum + (ingredient.shortage || 0);
  //       }
        
  //       // Include shortages from semi-finished components
  //       if (type === 'raw' && ingredient.components) {
  //         return sum + ingredient.components.reduce((compSum, comp) => {
  //           return compSum + (comp.shortage || 0);
  //         }, 0);
  //       }
        
  //       return sum;
  //     }, 0);
  //   }, 0);
  // };

  return (
    <div className="production-planning-container">
      <div className="planning-header">
        <h2>
          <FontAwesomeIcon icon={faCalculator} className="header-icon" />
          Production Planning
        </h2>
        <div className="date-selector">
          <label htmlFor="planning-date">
            <FontAwesomeIcon icon={faCalendarAlt} />
          </label>
          <input
            type="date"
            id="planning-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faBoxes} />
          </div>
          <div className="card-content">
            <h3>Total Finish Goods</h3>
            <p>{finishGoodsDemand.reduce((sum, item) => sum + item.quantity, 0)} units</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faFlask} />
          </div>
          <div className="card-content">
            <h3>Semi-Finished Needed</h3>
            <p>{semiFinishDemand.reduce((sum, item) => sum + item.quantity, 0)} units</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faLayerGroup} />
          </div>
          <div className="card-content">
            <h3>Raw Material Needed</h3>
            <p>{rawMaterialRequirements.reduce((sum, item) => sum + item.quantity, 0)} units</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Calculating production requirements...</p>
        </div>
      ) : (
        <>
          {/* Summary Section */}
          <div className="requirements-summary">
            <h3 className="summary-title">
              <FontAwesomeIcon icon={faLayerGroup} />
              Total Material Requirements
            </h3>
            
            <div className="summary-grid">
              <div className="summary-section">
                <h4>Raw Materials</h4>
                  {/* This would be dynamically generated from aggregated data */}
                  {rawMaterialRequirements.map((item) => (
                <div className="summary-items" key={item.itemCode}>
                  <div className="summary-item">
                    <div className="item-name">{item.itemName}</div>
                    <div className="item-total">{item.quantity} needed</div>
                  </div>
                </div>
                  ))}
              </div>
              
              <div className="summary-section">
                <h4>Semi-Finished Materials</h4>
                  {semiFinishDemand.map((item) => (
                <div className="summary-items">
                  <div className="summary-item">
                    <div className="item-name">{item.itemName}</div>
                    <div className="item-total">{item.quantity} needed</div>
                  </div>
                </div>
                   ))}
              </div>
            </div>
          </div>

          <div className="demand-table">
            <div className="table-header">
              <div>Product</div>
              <div>Demand</div>
              <div>Current Stock</div>
              <div>Production Needed</div>
              <div></div>
            </div>

            {finishGoodsDemand.map((item) => (
              <div className="product-row" key={item.itemCode}>
                
                <div className="product-main"  onClick={() => toggleProductExpand(item.itemCode, item.quantity)}>
                  <div className="product-name">{item.itemName}</div>
                  <div>{item.quantity} units</div>
                  <div>{/*product.currentStock*/} units</div>
                  <div className={item.quantity > 0 ? 'needed' : 'fulfilled'}>
                    {item.quantity} units
                  </div>
                    <div className="expand-icon">
                      <FontAwesomeIcon 
                        icon={expandedProduct === item.itemCode ? faChevronDown : faChevronRight} 
                      />
                    </div>
                </div>

              {expandedProduct === item.itemCode && findMainRecipe?.recipeCode === item.itemCode && (
                  <div className="ingredients-section">
                    <div className="section-title">Ingredients Breakdown</div>
                    {/* Raw Materials Section */}
                    <div className="materials-section">
                      <div className="section-subtitle">
                        <FontAwesomeIcon icon={faBoxes} />
                        Raw Materials Required
                      </div>
                      <div className="materials-grid">
                        {findMainRecipe?.ingredients
                          .filter(i => i.itemType === 'RawMaterial')
                          .map((ingredient, idx) => (
                            <div className="material-item" key={`raw-${idx}`}>
                              <div className="material-name">{ingredient.itemName}</div>
                              <div className="material-qty">{ingredient.requiredQty} {ingredient.unit}</div>
                              <div className="material-available">{ingredient.available} {ingredient.unit}</div>
                              <div className={`material-shortage ${ingredient.shortage > 0 ? 'negative' : 'positive'}`}>
                                {ingredient.shortage > 0 ? `${ingredient.shortage} ${ingredient.unit} needed` : 'Sufficient'}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Semi-Finished Materials Section */}
                    <div className="materials-section">
                      <div className="section-subtitle">
                        <FontAwesomeIcon icon={faFlask} />
                        Semi-Finished Materials Required
                      </div>
                      <div className="semi-finished-list">
                        {findMainRecipe?.ingredients
                          .filter(i => i.itemType === 'SemiFinished')
                          .map((ingredient, idx) => (
                            <div className="semi-finished-item" key={`semi-${idx}`}>
                              <div 
                                onClick={() => toggleSemiFinishedExpand(ingredient.itemCode , ingredient.quantity * item.quantity)}
                                className={`semi-finished-header`}
                              >
                                
                                <div className="sf-name">
                                  <FontAwesomeIcon 
                                    icon={expandedSemiFinished === ingredient.itemCode ? faChevronDown : faChevronRight} 
                                    className="sf-chevron"
                                  />
                                
                                  {ingredient.itemName}
                                </div>
                                <div className="sf-qty">{ingredient.quantity * item.quantity} {ingredient.unit}</div>
                                <div className="sf-available">{ingredient.available} {ingredient.unit}</div>
                                <div className={`sf-shortage ${ingredient.shortage > 0 ? 'negative' : 'positive'}`}>
                                  {ingredient.shortage > 0 ? `${ingredient.shortage} ${ingredient.unit} needed` : 'Sufficient'}
                                </div>
                              </div>

                              {expandedSemiFinished === ingredient.itemCode && (
                                <div className="sf-components">
                                  <div className="components-title">Components Required:</div>
                                  {findSemiFinishedRecipe.ingredients.map((component, cIdx) => (
                                    <div className="component-item" key={`comp-${cIdx}`}>
                                      <div className="component-name">
                                        <FontAwesomeIcon icon={faBoxes} className="component-icon" />
                                        {component.itemName}
                                      </div>
                                      <div className="component-qty">{component.quantity * (ingredient.quantity * item.quantity)} {component.unit}</div>
                                      <div className="component-available">{component.available} {component.unit}</div>
                                      <div className={`component-shortage ${component.shortage > 0 ? 'negative' : 'positive'}`}>
                                        {component.shortage > 0 ? `${component.shortage} ${component.unit} needed` : 'Sufficient'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                          {findSemiFinishedRecipe?.ingredients.length === 0 && (
                          <p>No semi-finished materials required.</p>  
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
                ))
            }
          </div>
        </>
      )}
    </div>
  );
};

export default ProductionPlanning;