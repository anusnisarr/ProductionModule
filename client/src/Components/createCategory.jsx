import React, { useState, useEffect, useRef } from "react";
import "../StyleSheets/createItem.css";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
 
const CreateOrEditCategory = () => {
  const categoryId  = useParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState({
    categoryName: "",
    categoryCode: "",
    isActive: "Active"
  });
  const selectRef = useRef(null);
  const isEditMode = window.location.href.includes("Edit");

  useEffect(() => {
    if (isEditMode) {
      fetchCategoryDetails();
    }
  }, []);


  const fetchCategoryDetails = async () => {   
    try {
      const categoryId = window.location.pathname.split("/").pop();
      
      const categoryRes = await fetch(`http://localhost:3000/categories/api/categories/${categoryId}`)

      if (!categoryRes.ok) throw new Error("Failed to fetch categories");
  
      const category = await categoryRes.json();
      console.log("category" , category);
      
        
      setCategoryData({
        categoryName: category.categoryName,
        categoryCode: category.categoryCode,
        isActive: category.IsActive ? "Active" : "Inactive"
      });
  

    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({ ...prevData, [name]: value }));
    console.log(categoryData);
     
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryId = window.location.pathname.split("/").pop();

    if (
        !categoryData.categoryName ||
        !categoryData.categoryCode
      ) {
        alert("Please fill out all fields correctly.");
        return;
      }

    const formData = {
      categoryName: categoryData.categoryName,
      categoryCode: categoryData.categoryCode,
      isActive: categoryData.isActive,
    };

    console.log(formData);

    try {
        
      const url = isEditMode
        ? `http://localhost:3000/categories/Edit/${categoryId}`
        : `http://localhost:3000/categories/Create`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || "Network response was not ok");
      }

      const result = await response.json();
      console.log(result);
      navigate("/Categories");
      
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error: " + error.message);
    }
  };

  return (
<div className="form-container">
  <h2 className="form-heading">Add New Category</h2>
  <form onSubmit={handleSubmit} className="form">
    <div className="form-group">
      <label>Category Name</label>
      <input
        type="text"
        name="categoryName"
        value={categoryData.categoryName}
        onChange={handleInputChange}
        placeholder="Enter category name"
      />
    </div>

    <div className="form-group">
      <label>Category Code</label>
      <input
        type="text"
        name="categoryCode"
        value={categoryData.categoryCode}
        onChange={handleInputChange}
        disabled={isEditMode}
        placeholder="Enter category code"
      />
    </div>

    <div className="form-group">
      <label>Status</label>
      <select
    name="isActive"
    value={categoryData.isActive}  // Convert boolean to string here
    onChange={handleInputChange}
  >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>

    <div className="form-footer">
      <button type="submit" className="submit-button">
        {isEditMode ? "Edit Category" : "Create Category"}
      </button>
    </div>
  </form>
</div>
  );
};

export default CreateOrEditCategory;
