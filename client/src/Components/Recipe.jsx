import React, { useEffect, useState } from "react";
import "../StyleSheets/Items.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faUpload, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const Recipe = () => {
    const [recipeArray, setRecipeArray] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [importModalVisible, setImportModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRecipe();
    }, []);

    const fetchRecipe = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/recipe/api/recipe");

            if (!response.ok) throw new Error("Network response was not ok");

            const fetchedRecipes = await response.json();
            setRecipeArray(fetchedRecipes);
            console.log("Fetched items:", fetchedRecipes);
        
        } catch (error) {
            console.error("❌ Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (recipeCode) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const response = await fetch(`http://localhost:3000/recipe/api/recipe/delete/${recipeCode}`, { method: "DELETE" });
            if (!response.ok) throw new Error(await response.json().message || "Cannot delete this item");
            setRecipeArray(prev => prev.filter(recipe => recipe.recipeCode !== recipeCode));
        } catch (error) {
            console.error("Error:", error);
            alert(`Delete failed: ${error.message}`);
        }
    };

    const handleFileImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        setSelectedFile(file.name);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            
            const response = await fetch("http://localhost:3000/items/import", {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error(await response.text());
            
            alert("Import successful!");
            fetchItems();
            setImportModalVisible(false);
        } catch (error) {
            console.error("Import error:", error);
            alert(`Import failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRecipes = recipeArray.filter(recipe => 
        Object.values(recipe).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );
    console.log("Filtered items:", filteredRecipes);
    
    return (
        <div className="items-container">
      {  /* Header Section */}
                        <div className="items-header">
                            <h2>Recipe</h2>
                            <div className="header-actions">
                    <div className="search-bar">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search items..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="action-buttons">
                        <Link 
                            className="btn-primary"
                            to = {"/recipe/create"}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add Recipe
                        </Link>
                        <button 
                            className="btn-secondary"
                            onClick={() => setImportModalVisible(true)}
                        >
                            <FontAwesomeIcon icon={faUpload} /> Import Recipe
                        </button>
                    </div>
                </div>
            </div>

            {/* Import Modal */}
            {importModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Import Recipe</h3>
                            <button 
                                className="close-btn"
                                onClick={() => {
                                    setImportModalVisible(false);
                                    setSelectedFile(null);
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <label className="file-upload">
                                <input 
                                    type="file" 
                                    onChange={handleFileImport}
                                    accept=".xlsx,.xls,.csv"
                                />
                                {selectedFile ? (
                                    <span>{selectedFile}</span>
                                ) : (
                                    <span>Choose Excel file to upload</span>
                                )}
                            </label>
                            <div className="modal-footer">
                                <button 
                                    className="btn-secondary"
                                    onClick={() => {
                                        setImportModalVisible(false);
                                        setSelectedFile(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}

            {/* Items Table */}
            <div className="table-container">
                {filteredRecipes.length > 0 ? (
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Recipe ID</th>
                                <th>Recipe Name</th>
                                <th>Recipe Code</th>
                                <th>Descroption</th>
                                <th>Cost</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecipes.map(recipe => (
                   
                                
                                <tr key={recipe.recipeId}>
                                    
                                    <td>{recipe.recipeId}</td>
                                    <td>
                                        <div className="item-name-cell">
                                            {recipe.recipeName}
                                            <span className="item-Type">{recipe.recipeType}</span>
                                        </div>
                                    </td>
                                    <td>{recipe.recipeCode}</td>
                                    <td>
                                        {recipe.description}
                                    </td>
                                    <td>{recipe.recipeCost}</td>
                                    <td>
                                        <span className={`status-badge ${recipe.Status ? "active" : "inactive"}`}>
                                            {recipe.Status ? "Active" : "Inactive"}
                                        </span>
                                     </td>
                                    <td>
                                       <div className="table-actions">
                                            <Link
                                                to={`/Recipe/Edit/${recipe.recipeCode}`}
                                                className="btn-icon"
                                                title="Edit"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                            <Link 
                                                className="btn-icon danger"
                                                onClick={() => handleDelete(recipe.recipeCode)}
                                                title="Delete"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        {isLoading ? (
                            <p>Loading items...</p>
                        ) : (
                            <>
                                <p>No Recipe found</p>
                                <button 
                                    className="btn-primary"
                                    onClick={() => window.location.href = "/Recipe/Create"}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Add Your First Recipe
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recipe;