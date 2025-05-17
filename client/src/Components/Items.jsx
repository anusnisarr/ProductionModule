import React, { useEffect, useState } from "react";
import "../StyleSheets/Items.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faUpload, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const Items = () => {
    const [itemsArray, setItemsArray] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [importModalVisible, setImportModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const MySwal = withReactContent(Swal);
    

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:3000/categories/api/categories");
            if (!response.ok) throw new Error("Network response was not ok");
            setCategoriesData(await response.json());
        } catch (error) {
            console.error("❌ Fetch error:", error);
        }
    };

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/items/api");
            if (!response.ok) throw new Error("Network response was not ok");
            const fetchedItems = await response.json();
            setItemsArray(fetchedItems);
            console.log("Fetched items:", fetchedItems);
            
            localStorage.setItem("Items", JSON.stringify(fetchedItems));
            await fetchCategories();
        } catch (error) {
            console.error("❌ Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (itemCode) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const response = await fetch(`http://localhost:3000/items/delete/${itemCode}`, { method: "DELETE" });
            if (!response.ok) throw new Error(await response.json().message || "Cannot delete this item");
            setItemsArray(prev => prev.filter(item => item.itemCode !== itemCode));
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
            console.log(formData)
            
            const response = await fetch("http://localhost:3000/items/upload", {
                method: "POST",
                body: formData
            });

            const data = await response.json(); // <-- READ THE RESPONSE BODY

            if (!response.ok) throw new Error(data.message || "Unknown error occurred");

            console.log("Import successful!" , response.json())
            
            fetchItems();
            setImportModalVisible(false);
        } catch (error) {
            console.error("Import error:", error);
            // alert(`Import failed: ${error.message}`);
                Swal.fire({
                    toast: true,
                    position: 'top',
                    icon: 'error',
                    background: "#cd4747",
                    color: "#ffffff",
                    iconColor: "#ffffff", // Added icon color
                    title: error.message,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
                  return
        } finally {
            setIsLoading(false);
        }
    };

    const filteredItems = itemsArray.filter(item => 
        Object.values(item).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return (
        <div className="items-container">
      {  /* Header Section */}
                        <div className="items-header">
                            <h2>Items</h2>
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
                            to = {"/Items/Create"}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add Item
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
                            <h3>Import Items</h3>
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
                {filteredItems.length > 0 ? (
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Item Code</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map(item => (
                   
                                
                                <tr key={item.itemCode}>
                                    <td>{item.itemId}</td>
                                    <td>
                                        <div className="item-name-cell">
                                            {item.itemName}
                                        </div>
                                    </td>
                                    <td>{item.itemCode}</td>
                                    <td>
                                       {item.categoryName}
                                    </td>
                                    <td>
                                        {item.itemType}
                                    </td>
                                    <td>${item.itemPrice.toFixed(2)}</td>
                                    <td>
                                        <span className={`status-badge ${item.isActive ? "active" : "inactive"}`}>
                                            {item.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <Link
                                                to={`/Items/Edit/${item.itemId}`}
                                                className="btn-icon"
                                                title="Edit"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                            <Link 
                                                className="btn-icon danger"
                                                onClick={() => handleDelete(item.itemCode)}
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
                                <p>No items found</p>
                                <button 
                                    className="btn-primary"
                                    onClick={() => window.location.href = "/Items/Create"}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Add Your First Item
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Items;