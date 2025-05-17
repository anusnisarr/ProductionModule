import React, { useState, useEffect, useRef } from "react";
import "../StyleSheets/createItem.css";
import Choices from "choices.js";
import 'choices.js/public/assets/styles/choices.min.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
 
const CreateOrEditItem = () => {
  const itemId  = useParams();
  const navigate = useNavigate();

  const [activeCategories, setActiveCategories] = useState([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [itemData, setItemData] = useState({
    itemName: "",
    itemCode: "",
    itemPrice: "",
    isActive: "Active",
    itemType: "RawMaterial",
  });
  const selectRef = useRef(null);
  const isEditMode = window.location.href.includes("Edit");


  useEffect(() => {
    if(!isEditMode) {
      fetchCategoriesForItem();
    }
    if (isEditMode) {
      fetchItemDetails();
    }
  }, []);

  const fetchCategoriesForItem = async () => {
    try {
      const response = await fetch("http://localhost:3000/categories/api/categories");
       
      if (!response.ok) throw new Error("Failed to fetch categories");

      const categoriesJSON = await response.json();
      
      const activeCategories = categoriesJSON.filter(
        (category) => category.IsActive === true
      );

      console.log(activeCategories)
      setActiveCategories(activeCategories);
      populateCategories(activeCategories);
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
  };

  const populateCategories = (categories) => {    
    const choicesArray = categories.map((category) => ({
      value: category.categoryCode,
      label: category.categoryName,
    }));

    if (selectRef.current) {
      const categoryChoices = new Choices(selectRef.current, {
        choices: choicesArray,
        placeholder: true,
        placeholderValue: "Search Category...",
        paste: true,
        loadingText: "Loading...",
        
      });

      selectRef.current.choicesInstance = categoryChoices;
    }
  };

  const fetchItemDetails = async () => {   
    
    try {
      const itemCodeParam = window.location.pathname.split("/").pop();
  
      const [itemRes, categoryRes] = await Promise.all([
        fetch(`http://localhost:3000/items/api/${itemCodeParam}`),
        fetch(`http://localhost:3000/categories/api/categories`),
      ]);
  
      if (!itemRes.ok) throw new Error("Failed to fetch item details");
      if (!categoryRes.ok) throw new Error("Failed to fetch categories");
  
      const item = await itemRes.json();
      
      const categories = await categoryRes.json();

  
      setItemData({
        itemName: item.itemName,
        itemCode: item.itemCode,
        itemPrice: item.itemPrice,
        isActive: item.isActive ? "Active" : "Inactive",
        itemType: item.itemType,
      });
  
      setSelectedCategoryCode(item.categoryCode);
      setSelectedCategoryName(item.categoryName);


  
      populateCategoriesWithSelection(categories, item.categoryCode);
  
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const populateCategoriesWithSelection = (categories, selectedCode) => {
    if (!selectRef.current) return;
  
    const choicesArray = categories.map((category) => ({
      value: category.categoryCode,
      label: category.categoryName,
      selected: category.categoryCode === selectedCode,
    }));
  
    // Initialize Choices instance if not already
    if (!selectRef.current.choicesInstance) {
      selectRef.current.choicesInstance = new Choices(selectRef.current, {
        removeItemButton: true,
        searchEnabled: true,
        placeholder: true,
        shouldSort: false,
      });
    } else {
      // Clear previous choices & selection to avoid duplicates
      selectRef.current.choicesInstance.clearChoices();
      selectRef.current.choicesInstance.clearStore();
    }
  
    // Set new choices (replace existing, so no duplicates)
    selectRef.current.choicesInstance.setChoices(choicesArray, "value", "label", false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData((prevData) => ({ ...prevData, [name]: value }));
    console.log(itemData);
     
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemIdParam = window.location.pathname.split("/").pop();


    const formData = new FormData();
    const fileInput = document.getElementById("itemImage");

    if (fileInput.files.length > 0) {
      formData.append("itemImage", fileInput.files[0]);
    }

    formData.append("itemName", itemData.itemName);
    formData.append("itemCode", itemData.itemCode);
    formData.append("itemPrice", itemData.itemPrice);
    formData.append("categoryCode", selectedCategoryCode);
    formData.append("categoryName", selectedCategoryName);
    formData.append("isActive", itemData.isActive);   
    formData.append("itemType", itemData.itemType);  

  
    if (
      !itemData.itemName ||
      !itemData.itemCode ||
      !itemData.itemPrice ||
      !selectedCategoryCode ||
      !selectedCategoryName
    ) {
      alert("Please fill out all fields correctly.");
      return;
    }

    // showLoader();
    try {
      const url = isEditMode
        ? `http://localhost:3000/items/Edit/${itemIdParam}`
        : `http://localhost:3000/items/Create`;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || "Network response was not ok");
      }

      const result = await response.json();
      console.log(result);
      navigate("/items");
      
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error: " + error.message);
    } finally {
      // hideLoader();
    }
  };

  return (
<div className="form-container">
  <h2 className="form-heading">Add New Item</h2>
  <form onSubmit={handleSubmit} className="form">
    <div className="form-group">
      <label>Item Name</label>
      <input
        type="text"
        name="itemName"
        value={itemData.itemName}
        onChange={handleInputChange}
        placeholder="Enter item name"
      />
    </div>

    <div className="form-group">
      <label>Item Code</label>
      <input
        type="text"
        name="itemCode"
        value={itemData.itemCode}
        onChange={handleInputChange}
        disabled={isEditMode}
        placeholder="Enter item code"
      />
    </div>

    <div className="form-group">
      <label>Item Price</label>
      <input
        type="text"
        name="itemPrice"
        value={itemData.itemPrice}
        onChange={handleInputChange}
        placeholder="Enter item price"
      />
    </div>

    <div className="form-group">
      <label>Category</label>
      <select
        ref={selectRef}
        onChange={(e) => {
          setSelectedCategoryCode(e.target.value);
          setSelectedCategoryName(e.target.options[e.target.selectedIndex]?.text);
        }}
      >
        {/* options here */}
      </select>
    </div>

    <div className="form-group">
      <label>Status</label>
      <select
    name="isActive"
    value={itemData.isActive}  // Convert boolean to string here
    onChange={handleInputChange}
  >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>

    <div className="form-group">
      <label>Type</label>
      <select
    name="itemType"
    value={itemData.itemType}  // Convert boolean to string here
    onChange={handleInputChange}
  >
        <option value="RawMaterial">RawMaterial</option>
        <option value="SemiFinished">Semi Finished</option>
        <option value="FinishedGoods">Finished Goods</option>

      </select>
    </div>

    <div className="form-group">
      <label>Item Image</label>
      <input type="file" id="itemImage" />
    </div>

    <div className="form-footer">
      <button type="submit" className="submit-button">
        {isEditMode ? "Edit Item" : "Create Item"}
      </button>
    </div>
  </form>
</div>
  );
};

export default CreateOrEditItem;
