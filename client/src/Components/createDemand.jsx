// AddDemand.jsx
import React, { useEffect, useState } from 'react';
import '../StyleSheets/DemandList.css'; // Adjust the path as necessary
import { X } from 'lucide-react'; // You can use an icon library like lucide-react for better UI
import MySelect from './itemSelect.jsx'; // Assuming you have a custom select component
<<<<<<< HEAD
=======
import { useNavigate } from 'react-router-dom';
>>>>>>> master


const AddDemand = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [demandCount, setDemandCount] = useState('');
<<<<<<< HEAD
  const [demandNo, setNDemandNo] = useState(''); // State to hold the new demand number
=======
  const [demandNo, setNDemandNo] = useState(''); // State to hold the new demand numberconst navigate = useNavigate();
  const navigate = useNavigate();

>>>>>>> master

  const createDemandNo = () => {
    const year = new Date().getFullYear().toString().slice(-2); // Extracts the last two digits of the year (YY)
    const month = String(new Date().getMonth() + 1).padStart(2, '0'); // Gets the current month (MM)
    const demandNo = `DO-${month}${year}-${demandCount}`; // Constructs the demand number in the format "DO-MM-YY-XXXX"
    
    setNDemandNo(demandNo); // Update the state with the new demand number
    setFormData(prev => ({ ...prev, demandNo: demandNo }));   
    return demandNo;
  }

  const [formData, setFormData] = useState({
    demandNo: '',
    userName: '',
    demandDate: '',
    deliveryDate: '',
    noOfItems: 0,
    totalQuantity:0,
    items: []
  });

  useEffect(() => {
    const fetchDemandCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/demand/api/demand', {
          method: 'GET',
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        } else {
          const data = await response.json();
          setDemandCount(data.length + 1); // Assuming the demandNo is just the count of existing demands          
        }
      } catch (error) {
        console.error('Error fetching demand number:', error);
      }
    };
    fetchDemandCount();

  }, []);

  useEffect(() => {
    if (demandCount) {
    createDemandNo(demandCount); // Call the function to create the demand number
  }
  }, [demandCount]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleItemQtyAndRateChange = (index, e) => {
    const { name, value } = e.target;
    console.log('Name:', name, 'Value:', value);
    const newItems = [...formData.items];
    newItems[index][name] = value;
    setFormData(prev => ({...prev, items: newItems }));
    setFormData(prev => ({...prev, noOfItems: newItems.length ,totalQuantity: newItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}));
  };

  const addItem = () => {
    const newItems = [...formData.items, { itemName: '', quantity: 0, unitPrice: 0 }];
    setFormData(prev => ({...prev, items: newItems}));


  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, idx) => idx !== index);
    setFormData(prev => ({...prev, items: newItems}));
  };

  const totalQuantity = formData.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const itemCount = formData.items.filter(item => item.itemName.trim() !== '').length;
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      noOfItems: itemCount,
      totalQuantity: totalQuantity
    };

    console.log('Updated Form Data:', updatedFormData);

    // API call handling here
    const formDataToSubmit = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/demand/Create', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({updatedFormData})
        });

         if (response.ok) {
          const data = await response.json();
          console.log('Success:', data);
<<<<<<< HEAD
          location.href = '/demand';
=======
          navigate('/demand');
>>>>>>> master
        }
        else {
          const errorData = await response.json();
          console.error('Error:', errorData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
    }

    }
    formDataToSubmit();
  };

  const handleCancel = () => {
    setFormData({
      demandNo: '',
      userName: '',
      file: null,
      demandDate: '',
      deliveryDate: '',
      noOfItems: 0,
      totalQuantity: 0,
      items: []
    });
  };

  return (
    <div className="add-demand-container">

      <form className="demand-form" onSubmit={handleSubmit}>
        <header className="form-header">
          <h1>Add New Demand</h1>
        </header>
        <div className="top-section">
          <div className="form-group">
            <label>Demand No</label>
            <input type="text" name="demandNo" value={formData.demandNo} onChange={handleChange} disabled />
          </div>
          <div className="form-group">
            <label>User Name</label>
            <input type="text" name="userName" value={formData.userName} onChange={handleChange}  />
          </div>
          <div className="form-group">
            <label>Demand date</label>
            <input type="date" name="demandDate" value={formData.demandDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Delivery Date</label>
            <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange}  />
          </div>
          <div className="form-group">
            <label>Upload File</label>
            <input type="file" name="file" onChange={handleChange} />
          </div>
        </div>

        <div className="item-section">
          <div className="item-header">
            <label>Item Name</label>
            <label>Quantity</label>
            <label>Unit Price</label>
            <span>Action</span>
          </div>

          

          {formData.items.map((item, index) => (
            <div className="item-row" key={index}>
              <MySelect
                onChange={(selectedItem) => {
                  const updatedItems = [...formData.items];
                  updatedItems[index] = {
                    ...updatedItems[index],
                    itemName: selectedItem.value,
                    itemCode: selectedItem.itemCode,
                    itemType: selectedItem.itemType,
                    itemId: selectedItem.itemId,
                  };
                  setFormData(prev =>({...prev, items: updatedItems}));
                }}
                value={item.itemName}
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemQtyAndRateChange(index, e)}
                required
              />
              <input
                type="number"
                name="unitPrice"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) => handleItemQtyAndRateChange(index, e)}
                required
              />
              <button type="button" className="remove-item-btn" onClick={() => removeItem(index)}>
                <X size={18} />
              </button>
            </div>
          ))}

          <div className="item-header">
            <p>Item Count: {itemCount}</p>
            <p>Total Quantity: {totalQuantity}</p>
          </div>

          <button type="button" className="add-item-btn" onClick={addItem}>
            Add Item
          </button>
        </div>

        <footer className="form-footer">
          <div className="button-group">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </footer>

        {/* Loading State */}
          {isLoading && (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
          )}
      </form>
    </div>
  );
};

export default AddDemand;
