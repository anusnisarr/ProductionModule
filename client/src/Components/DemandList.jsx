import React, { useEffect, useState } from "react";
import "../StyleSheets/Items.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faUpload, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const Demand = () => {
    const [DemandArray, setDemandArray] = useState([]);
    const [importModalVisible, setImportModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDemand();
    }, []);

    const fetchDemand = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/demand/api/demand");

            if (!response.ok) throw new Error("Network response was not ok");

            const fetchedDemands = await response.json();
            setDemandArray(fetchedDemands);
            console.log("Fetched items:", fetchedDemands);
        
        } catch (error) {
            console.error("❌ Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (demandNo) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const response = await fetch(`http://localhost:3000/Demand/api/Demand/delete/${demandNo}`, { method: "DELETE" });
            if (!response.ok) throw new Error(await response.json().message || "Cannot delete this item");
            setDemandArray(prev => prev.filter(Demand => Demand.demandNo !== demandNo));
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

    const filteredDemands = DemandArray.filter(Demand => 
        Object.values(Demand).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );
    console.log("Filtered items:", filteredDemands);
    
    return (
        <div className="items-container">
      {  /* Header Section */}
                        <div className="items-header">
                            <h2>Demand Orders</h2>
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
                            to = {"/Demand/Create"}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add Demand
                        </Link>
                        <button 
                            className="btn-secondary"
                            onClick={() => setImportModalVisible(true)}
                        >
                            <FontAwesomeIcon icon={faUpload} /> Import Demand
                        </button>
                    </div>
                </div>
            </div>

            {/* Import Modal */}
            {importModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Import Demand</h3>
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
                {filteredDemands.length > 0 ? (
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Demand No</th>
                                <th>Demand Date</th>
                                <th>UserName</th>
                                <th>No Of Items</th>
                                <th>Total Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDemands.map(Demand => (
                   
                                
                                <tr key={Demand.demandNo}>
                                    
                                    <td>{Demand.demandNo}</td>
                                    <td>{Demand.demandDate}</td>
                                    <td>{Demand.userName}</td>
                                    <td>{Demand.noOfItems}</td>
                                    <td>{Demand.totalQuantity}</td>
                                    <td>
                                       <div className="table-actions">
                                            <Link
                                                // to={`/Items/Edit/${item.itemId}`}
                                                className="btn-icon"
                                                title="Edit"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                            <Link 
                                                className="btn-icon danger"
                                                onClick={() => handleDelete(Demand.demandNo)}
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
                                <p>No Demand found</p>
                                <Link to="/Demand/Create" className="btn-primary"> 
                                    <FontAwesomeIcon icon={faPlus} /> Add Your First Demand
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Demand;