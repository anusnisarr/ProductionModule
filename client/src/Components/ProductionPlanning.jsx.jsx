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

    const matchedRecipe = recipeData.find(recipe => recipe.recipeCode === productId);
  
    if (matchedRecipe) {
      // Create a deep copy and calculate new required quantities
      const updatedIngredients = matchedRecipe.ingredients.map(ingredient => ({
        ...ingredient,
        requiredQty: ingredient.requiredQty * demandQuantity,
        shortage: Math.max((ingredient.requiredQty * demandQuantity) - ingredient.available, 0)
      }));
  
      setFindMainRecipe({
        ...matchedRecipe,
        ingredients: updatedIngredients
      });
    }
  
    setExpandedProduct(expandedProduct === productId ? null : productId);
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

  const finishGoodsDemand = demandData
  .flatMap(demand => demand.items.filter(i => i.itemType === "FinishedGoods"))
  .reduce((acc, item) => {
    const existingItem = acc.find(i => i.itemCode === item.itemCode);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item }); // Make a copy to avoid mutation
    }
    return acc;
  }, []);
  
  console.log(finishGoodsDemand);




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
            <h3>Total Demand</h3>
            <p>{demandData.reduce((sum, item) => sum + item.totalQuantity, 0)} units</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faFlask} />
          </div>
          <div className="card-content">
            <h3>Semi-Finished Needed</h3>
            <p>{finishGoodsDemand.reduce((sum, item) => sum + item.quantity, 0)} units</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faLayerGroup} />
          </div>
          <div className="card-content">
            <h3>Raw Material Needed</h3>
            {/* <p>{rawMaterialGoodsDemand.reduce((sum, item) => sum + item.quantity, 0)} units</p> */}
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
                  {demandData.flatMap(item => item.items.filter(subItem => subItem.itemType === "RawMaterial")).map((item) => (
                <div className="summary-items" key={item.itemCode}>
                  <div className="summary-item">
                    <div className="item-name">{item.itemName}</div>
                    <div className="item-total">{item.quantity} needed</div>
                  </div>
                </div>
                  ))}
              </div>
              
              <div className="summary-section">
                <h4>Finished Materials</h4>
                  {finishGoodsDemand.map((item) => (
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

                {expandedProduct === findMainRecipe?.recipeCode && (
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
                                className={expandedSemiFinished?`semi-finished-header`:"semi-finished-header-nonClickable"}
                                onClick={() => toggleSemiFinishedExpand(ingredient.itemCode , ingredient.quantity * item.quantity)}
                              >
                                
                                <div className="sf-name">
                                  <FontAwesomeIcon 
                                    icon={expandedSemiFinished?.recipeCode === ingredient.itemCode ? faChevronDown : faChevronRight} 
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