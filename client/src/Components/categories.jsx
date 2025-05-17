import React, { useEffect, useState } from "react";
import "../StyleSheets/Category.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faUpload, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const Categories = () => {
    const [CategoriesArray, setCategoriesArray] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [importModalVisible, setImportModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    // const fetchCategories = async () => {
    //     try {
    //         const response = await fetch("http://localhost:3000/categories/api/categories");
    //         if (!response.ok) throw new Error("Network response was not ok");
    //         setCategoriesData(await response.json());
    //     } catch (error) {
    //         console.error("❌ Fetch error:", error);
    //     }
    // };

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/categories/api/categories");
            if (!response.ok) throw new Error("Network response was not ok");
            const fetchedCategories = await response.json();
            setCategoriesArray(fetchedCategories);
            console.log("Fetched Categories:", fetchedCategories);
            localStorage.setItem("Categories", JSON.stringify(fetchedCategories));
        } catch (error) {
            console.error("❌ Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (itemCode) => {
        if (!window.confirm("Are you sure you want to delete this Category?")) return;

        try {
            const response = await fetch(`http://localhost:3000/Categories/delete/${itemCode}`, { method: "DELETE" });
            if (!response.ok) throw new Error(await response.json().message || "Cannot delete this Category");
            setCategoriesArray(prev => prev.filter(Category => Category.itemCode !== itemCode));
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
            
            const response = await fetch("http://localhost:3000/Categories/import", {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error(await response.text());
            
            alert("Import successful!");
            fetchCategories();
            setImportModalVisible(false);
        } catch (error) {
            console.error("Import error:", error);
            alert(`Import failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCategories = CategoriesArray.filter(Category => 
        Object.values(Category).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return (
        <div className="items-container">
      {  /* Header Section */}
                        <div className="items-header">
                            <h2>Categories</h2>
                            <div className="header-actions">
                    <div className="search-bar">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search Categories..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="action-buttons">
                        <Link 
                            className="btn-primary"
                            to = {"/Categories/Create"}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add Category
                        </Link>
                        <button 
                            className="btn-secondary"
                            onClick={() => setImportModalVisible(true)}
                        >
                            <FontAwesomeIcon icon={faUpload} /> Import
                        </button>
                    </div>
                </div>
            </div>

            {/* Import Modal */}
            {importModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Import Categories</h3>
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

            {/* Categories Table */}
            <div className="table-container">
                {filteredCategories.length > 0 ? (
                    <table className="categories-table">
                        <thead>
                            <tr>
                                <th>Category ID</th>
                                <th>Category Name</th>
                                <th>Category Code</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map(Category => (
                                <tr key={Category.categoryCode}>
                                    <td>{Category.categoryId}</td>
                                    <td>
                                        <div className="category-name-cell">
                                            {Category.categoryName}
                                        </div>
                                    </td>
                                    <td>{Category.categoryCode}</td>
                                    <td>
                                        <span className={`status-badge ${Category.IsActive ? "active" : "inactive"}`}>
                                            {Category.IsActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <Link
                                                to={`/Categories/Edit/${Category.categoryId}`}
                                                className="btn-icon"
                                                title="Edit"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                            <Link 
                                                className="btn-icon danger"
                                                onClick={() => handleDelete(Category.categoryId)}
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
                            <p>Loading Categories...</p>
                        ) : (
                            <>
                                <p>No Categories found</p>
                                <button 
                                    className="btn-primary"
                                    onClick={() => window.location.href = "/Categories/Create"}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Add Your First Category
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;